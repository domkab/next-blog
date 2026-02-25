/* eslint-disable @typescript-eslint/no-explicit-any */

import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config({ path: ".env.local" });

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var ${name}`);
  return v;
}

const SOURCE_URI = requireEnv("SOURCE_MONGODB_URI");
const SOURCE_DB = requireEnv("SOURCE_MONGODB_DBNAME");
const TARGET_URI = requireEnv("TARGET_MONGODB_URI");
const TARGET_DB = requireEnv("TARGET_MONGODB_DBNAME");

/**
 * Safety: prevent accidental live->live / same-db sync
 */
function assertSafe(sourceDb: string, targetDb: string) {
  if (sourceDb === targetDb) {
    throw new Error(
      `Safety check failed: SOURCE_DB === TARGET_DB (${sourceDb}). Refusing to run.`,
    );
  }
}

const BATCH_SIZE = Number(process.env.MIGRATE_BATCH_SIZE ?? 1000);

/**
 * Mode:
 * - clone: drop target collections first, then copy everything (target becomes exact clone)
 * - upsert: keep existing target docs, upsert by _id (does not delete extras)
 */
type Mode = "clone" | "upsert";
const MODE: Mode = (process.env.MIGRATE_MODE as Mode) ?? "upsert";

/**
 * Optional: comma-separated list of collections to skip.
 * Example: MIGRATE_SKIP_COLLECTIONS=logs,audit,events
 */

/**
 * USAGE:
 * MIGRATE_MODE=clone npm run migrate:db
 * # drop target collections first, then copy everything (target becomes exact clone)
 *
 *  MIGRATE_MODE=upsert npm run migrate:db
 * # keep existing target docs, upsert by _id (does not delete extras)
 *
 *  MIGRATE_SKIP_COLLECTIONS=logs,audit,events npm run migrate:db
 * # skip specified collections
 *
 * MIGRATE_BATCH_SIZE=2000 npm run migrate:db
 * # increase batch size for faster migration (more memory usage)
 */

const SKIP = new Set(
  (process.env.MIGRATE_SKIP_COLLECTIONS ?? "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean),
);

function maskUri(uri: string) {
  return uri.replace(/:\/\/.*@/, "://***:***@");
}

async function withClients<T>(
  fn: (source: MongoClient, target: MongoClient) => Promise<T>,
) {
  const sourceClient = new MongoClient(SOURCE_URI);
  const targetClient = new MongoClient(TARGET_URI);

  await Promise.all([sourceClient.connect(), targetClient.connect()]);
  try {
    return await fn(sourceClient, targetClient);
  } finally {
    await Promise.all([sourceClient.close(), targetClient.close()]);
  }
}

async function migrateCollection(params: {
  sourceDb: ReturnType<MongoClient["db"]>;
  targetDb: ReturnType<MongoClient["db"]>;
  name: string;
}) {
  const { sourceDb, targetDb, name } = params;

  if (SKIP.has(name)) {
    console.log(`⏭️  Skipping collection: ${name}`);
    return;
  }

  const sourceCol = sourceDb.collection(name);
  const targetCol = targetDb.collection(name);

  const sourceCount = await sourceCol.estimatedDocumentCount();

  if (MODE === "clone") {
    // drop target collection if exists
    const exists =
      (await targetDb.listCollections({ name }).toArray()).length > 0;
    if (exists) {
      await targetCol.drop();
      console.log(`🧨 Dropped target collection: ${name}`);
    }
  }

  console.log(`\n📦 Migrating "${name}" (≈${sourceCount} docs)`);

  const cursor = sourceCol.find({}, { batchSize: BATCH_SIZE });

  let processed = 0;
  let bulk: any[] = [];

  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    if (!doc) break;

    // Ensure _id exists (should always in Mongo)
    if (!doc._id) doc._id = new ObjectId();

    bulk.push({
      replaceOne: {
        filter: { _id: doc._id },
        replacement: doc,
        upsert: true,
      },
    });

    if (bulk.length >= BATCH_SIZE) {
      const res = await targetCol.bulkWrite(bulk, { ordered: false });
      processed += bulk.length;
      bulk = [];

      console.log(
        `  → ${name}: ${processed}/${sourceCount} (upserted ${res.upsertedCount}, modified ${res.modifiedCount})`,
      );
    }
  }

  if (bulk.length) {
    const res = await targetCol.bulkWrite(bulk, { ordered: false });
    processed += bulk.length;

    console.log(
      `  → ${name}: ${processed}/${sourceCount} (upserted ${res.upsertedCount}, modified ${res.modifiedCount})`,
    );
  }

  // Best-effort: replicate indexes (optional but useful)
  try {
    const indexes = await sourceCol.indexes();
    // indexes includes the default _id_ index — safe to ignore or recreate
    const toCreate = indexes.filter(i => i.name !== "_id_");
    if (toCreate.length) {
      // Drop existing indexes (except _id_) only in clone mode
      if (MODE === "clone") {
        const targetIndexes = await targetCol.indexes();
        const targetToDrop = targetIndexes.filter(i => i.name !== "_id_");
        for (const idx of targetToDrop) {
          if (idx.name) {
            await targetCol.dropIndex(idx.name);
          }
        }
      }

      for (const idx of toCreate) {
        const {
          key,
          name: idxName,
          unique,
          sparse,
          partialFilterExpression,
        } = idx;
        await targetCol.createIndex(key, {
          name: idxName,
          unique,
          sparse,
          partialFilterExpression,
        });
      }
      console.log(`  🧷 ${name}: indexes replicated (${toCreate.length})`);
    }
  } catch (e) {
    console.warn(`  ⚠️  ${name}: could not replicate indexes`, e);
  }
}

async function migrateDb() {
  assertSafe(SOURCE_DB, TARGET_DB);

  console.log(`SOURCE: ${maskUri(SOURCE_URI)}/${SOURCE_DB}`);
  console.log(`TARGET: ${maskUri(TARGET_URI)}/${TARGET_DB}`);
  console.log(`MODE:   ${MODE}`);
  console.log(`BATCH:  ${BATCH_SIZE}`);
  if (SKIP.size) console.log(`SKIP:   ${Array.from(SKIP).join(", ")}`);

  await withClients(async (sourceClient, targetClient) => {
    const sourceDb = sourceClient.db(SOURCE_DB);
    const targetDb = targetClient.db(TARGET_DB);

    const collections = await sourceDb.listCollections().toArray();
    const names = collections.map(c => c.name).sort();

    if (!names.length) {
      console.log("No collections found in source DB. Nothing to do.");
      return;
    }

    console.log(`\nFound ${names.length} collections in source DB.`);
    for (const name of names) {
      await migrateCollection({ sourceDb, targetDb, name });
    }

    console.log("\n✅ DB migration complete.");
  });
}

migrateDb().catch(err => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});

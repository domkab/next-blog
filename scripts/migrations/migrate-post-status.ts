// scripts/migrate-post-status.ts
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: ".env.local" });

type PostStatus = "draft" | "published" | "scheduled";

type CliOptions = {
  dryRun: boolean;
  confirm: boolean;
  limit?: number;
  slug?: string;
};

const getArgValue = (name: string) => {
  const arg = process.argv.find(value => value.startsWith(`--${name}=`));
  return arg?.split("=")[1];
};

const getOptions = (): CliOptions => {
  const dryRun = process.argv.includes("--dry-run");
  const confirm = process.argv.includes("--confirm");
  const limitValue = getArgValue("limit");
  const slug = getArgValue("slug");

  if (!dryRun && !confirm) {
    throw new Error("Use either --dry-run or --confirm");
  }

  if (dryRun && confirm) {
    throw new Error("Use only one: --dry-run or --confirm");
  }

  return {
    dryRun,
    confirm,
    limit: limitValue ? Number(limitValue) : undefined,
    slug,
  };
};

const main = async () => {
  const options = getOptions();

  const mongoUri = process.env.TARGET_MONGODB_URI ?? process.env.MONGODB_URI;
  const dbName =
    process.env.TARGET_MONGODB_DBNAME ?? process.env.MONGODB_DBNAME;

  if (!mongoUri) throw new Error("Missing TARGET_MONGODB_URI or MONGODB_URI");
  if (!dbName)
    throw new Error("Missing TARGET_MONGODB_DBNAME or MONGODB_DBNAME");

  const conn = await mongoose
    .createConnection(mongoUri, { dbName })
    .asPromise();
  const postsCollection = conn.collection("posts");

  const query = {
    ...(options.slug ? { slug: options.slug } : {}),
    status: { $exists: false },
  };

  let cursor = postsCollection.find(query);

  if (options.limit) {
    cursor = cursor.limit(options.limit);
  }

  const posts = await cursor.toArray();

  console.log(`Found ${posts.length} post(s) missing status.`);
  console.log(
    options.dryRun ? "Running DRY RUN." : "Running CONFIRMED migration.",
  );

  const summary = {
    postsChecked: posts.length,
    postsChanged: 0,
  };

  for (const post of posts) {
    const status: PostStatus = "published";
    const publishedAt =
      post.publishedAt ?? post.createdAt ?? post.updatedAt ?? new Date();

    console.log(`\nPost: ${post.slug}`);
    console.log(`  status: ${post.status ?? "(missing)"} -> ${status}`);
    console.log(`  publishedAt: ${publishedAt.toISOString?.() ?? publishedAt}`);
    console.log(`  scheduledFor: null`);

    summary.postsChanged += 1;

    if (options.dryRun) {
      console.log("  Preview only. No database changes written.");
      continue;
    }

    await postsCollection.updateOne(
      { _id: post._id },
      {
        $set: {
          status,
          publishedAt,
          scheduledFor: null,
          updatedAt: new Date(),
        },
      },
    );

    console.log("  Saved.");
  }

  console.log("\nMigration summary:");
  console.table(summary);

  await conn.close();
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});

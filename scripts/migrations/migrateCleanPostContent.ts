/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var ${name}`);
  return value;
}

const ENV = process.env.MIGRATE_ENV || "staging";

const URI =
  ENV === "production"
    ? requireEnv("MONGODB_URI")
    : requireEnv("MONGODB_URI");

const DB =
  ENV === "production"
    ? requireEnv("MONGODB_DBNAME")
    : requireEnv("MONGODB_DBNAME");

function normalizePostContent(content: string): string {
  return content
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/<p>(\s|<br\s*\/?>|&nbsp;|&#160;)*<\/p>/gi, "")
    .replace(/>\s+</g, "><")
    .trim();
}

async function migrate() {
  const conn = await mongoose.createConnection(URI, { dbName: DB }).asPromise();

  console.log(`Connected to ${ENV} DB`);

  const posts = conn.collection("posts");

  const cursor = posts.find({ content: { $exists: true } });

  let scanned = 0;
  let updated = 0;

  while (await cursor.hasNext()) {
    const post: any = await cursor.next();
    scanned++;

    const cleaned = normalizePostContent(post.content);

    if (cleaned !== post.content) {
      await posts.updateOne({ _id: post._id }, { $set: { content: cleaned } });

      updated++;
      console.log(`Updated post: ${post.slug}`);
    }
  }

  console.log(`Scanned: ${scanned}`);
  console.log(`Updated: ${updated}`);

  await conn.close();
  console.log("Migration finished");
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});

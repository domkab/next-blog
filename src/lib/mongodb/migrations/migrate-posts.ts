import { FeaturedPostType, PostType } from "@/types/Post";
import mongoose, { Connection, Schema, Types } from "mongoose";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var ${name}`);
  return value;
}

const SOURCE_URI = requireEnv("SOURCE_MONGODB_URI");
const SOURCE_DB = requireEnv("SOURCE_MONGODB_DBNAME");
const TARGET_URI = requireEnv("TARGET_MONGODB_URI");
const TARGET_DB = requireEnv("TARGET_MONGODB_DBNAME");

const postSchema = new Schema({}, { strict: false, collection: "posts" });
const featuredSchema = new Schema(
  {
    postId: { type: Types.ObjectId, required: true, ref: "Post" },
    order: { type: Number, default: 0 },
  },
  { strict: false, collection: "featuredposts" },
);

async function connect(uri: string, dbName: string): Promise<Connection> {
  const conn = await mongoose.createConnection(uri, { dbName }).asPromise();
  console.log(
    `Connected to ${uri.replace(/:\/\/.*@/, "://***:***@")}/${dbName}`,
  );
  return conn;
}

async function migrate() {
  const source = await connect(SOURCE_URI, SOURCE_DB);
  const target = await connect(TARGET_URI, TARGET_DB);

  const SourcePost = source.model("Post", postSchema);
  const TargetPost = target.model("Post", postSchema);
  const SourceFeatured = source.model("FeaturedPost", featuredSchema);
  const TargetFeatured = target.model("FeaturedPost", featuredSchema);

  const posts = await SourcePost.find().lean();
  console.log(`Found ${posts.length} posts to migrate.`);

  let upserted = 0;
  for (const p of posts) {
    const slug = (p as PostType).slug;
    if (!slug) continue;

    // Drop __v to avoid version conflicts
    delete (p as PostType).__v;

    // Ensure no conflicting slug with different _id in target
    await TargetPost.deleteOne({ slug, _id: { $ne: p._id } });

    const res = await TargetPost.replaceOne({ _id: p._id }, p, {
      upsert: true,
    });
    if (res.modifiedCount > 0 || res.upsertedCount > 0) upserted += 1;
  }
  console.log(`Upserted ${upserted} posts.`);

  const featured = await SourceFeatured.find().lean();
  let featuredUpserts = 0;
  for (const f of featured) {
    // only migrate if the post exists in target
    const exists = await TargetPost.exists({ _id: f.postId });
    if (!exists) {
      console.warn(`Skip featured for missing postId ${f.postId}`);
      continue;
    }
    delete (f as FeaturedPostType).__v;
    const res = await TargetFeatured.replaceOne({ _id: f._id }, f, {
      upsert: true,
    });
    if (res.modifiedCount > 0 || res.upsertedCount > 0) featuredUpserts += 1;
  }
  console.log(`Upserted ${featuredUpserts} featured entries.`);

  await source.close();
  await target.close();
  console.log("Migration complete.");
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});

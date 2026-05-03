// scripts/list-post-urls.ts
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function listPostUrls() {
  const { default: Post } = await import("@/lib/models/postModel");
  const { connect } = await import("@/lib/mongodb/mongoose");

  await connect();

  const posts = await Post.find({}, { slug: 1, _id: 0 }).lean();

  const urls = posts
    .map(post => post.slug && `/post/${post.slug}`)
    .filter(Boolean);

  urls.forEach((url, index) => {
    console.log(`${index + 1}. ${url}`);
  });

  console.log(`\nTotal: ${urls.length}`);
  process.exit(0);
}

listPostUrls().catch(error => {
  console.error("Failed to list post URLs:", error);
  process.exit(1);
});

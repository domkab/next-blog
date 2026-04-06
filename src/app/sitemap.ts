import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllPosts } from "@/lib/services/postService";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  const postUrls = posts.map(post => ({
    url: `${SITE_URL}/post/${post.slug}`,
    lastModified: new Date(post.updatedAt),
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
    },
    ...postUrls,
  ];
}

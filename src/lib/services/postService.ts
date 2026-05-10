import { connect } from "@/lib/mongodb/mongoose";
import { PostType } from "@/types/Post";
import Post from "../models/postModel";
import { Types } from "mongoose";
import FeaturedPost from "../models/featuredPostModel";
import { PostWithCategoryName, withCategoryNames } from "./postServiceUtils";

export async function getRecentPosts(
  limit = 9,
  order = "desc",
): Promise<PostWithCategoryName[]> {
  await connect();
  const sort = order === "asc" ? 1 : -1;

  const posts = (await Post.find({ status: "published" })
    .sort({ updatedAt: sort })
    .limit(limit)
    .lean()) as PostType[];

  return withCategoryNames(posts);
}

type PostStatus = "draft" | "published" | "scheduled";

type GetPostBySlugOptions = {
  status?: PostStatus;
};

export async function getPostBySlug(
  slug: string,
  options?: GetPostBySlugOptions,
): Promise<PostWithCategoryName | null> {
  await connect();

  const query: Record<string, unknown> = { slug };
  if (options?.status) {
    query.status = options.status;
  }

  const post = await Post.findOne(query).lean();
  if (!post) return null;

  const [withCategoryName] = await withCategoryNames([post]);
  return withCategoryName;
}

type FeaturedWithPost = {
  _id?: string | Types.ObjectId;
  postId?: PostType;
  overrideSummary?: string;
  overrideImage?: string;
};

export async function getFeaturedPosts(): Promise<
  {
    post: PostWithCategoryName;
    overrideSummary?: string;
    overrideImage?: string;
  }[]
> {
  await connect();

  const featured = await FeaturedPost.find()
    .sort({ priority: -1 })
    .populate("postId")
    .lean();

  const normalized = (featured as FeaturedWithPost[])
    .filter(item => item.postId)
    .map(item => ({
      _id: item._id?.toString(),
      post: item.postId!,
      overrideSummary: item.overrideSummary,
      overrideImage: item.overrideImage,
    }));

  const featuredPostsWithCategory = await withCategoryNames(
    normalized.map(item => item.post),
  );

  const bySlug = new Map(
    featuredPostsWithCategory.map(post => [post.slug, post]),
  );

  return normalized.map(item => ({
    ...item,
    post:
      bySlug.get(item.post.slug) ??
      ({ ...item.post, categoryName: null } as PostWithCategoryName),
  }));
}

// later this service can be improved when we will have more posts and more complex needs for the project

export async function getAllPostsForSitemap() {
  await connect();
  const posts = await Post.find(
    { status: "published" },
    {
      slug: 1,
      updatedAt: 1, // or publishedAt
      _id: 0,
    },
  ).lean();

  return posts;
}

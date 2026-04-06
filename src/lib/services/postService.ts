import { connect } from "@/lib/mongodb/mongoose";
import { PostType } from "@/types/Post";
import Post from "../models/postModel";
import { Types } from "mongoose";
import FeaturedPost from "../models/featuredPostModel";
import Category from "@/lib/models/CategoryModel";

export type PostWithCategoryName = PostType & {
  categoryName: string | null;
};

async function withCategoryNames(
  posts: PostType[],
): Promise<PostWithCategoryName[]> {
  const slugs = Array.from(
    new Set(posts.map(p => p?.category).filter(Boolean) as string[]),
  );

  if (slugs.length === 0) {
    return posts.map(p => ({ ...p, categoryName: null }));
  }

  const categories = await Category.find({ slug: { $in: slugs } })
    .select({ slug: 1, name: 1, _id: 0 })
    .lean();

  const categoryMap = new Map<string, string>(
    categories.map(c => [c.slug, c.name]),
  );

  return posts.map(p => ({
    ...p,
    categoryName: p.category ? categoryMap.get(p.category) ?? null : null,
  }));
}

export async function getRecentPosts(
  limit = 9,
  order = "desc",
): Promise<PostWithCategoryName[]> {
  await connect();
  const sort = order === "asc" ? 1 : -1;

  const posts = (await Post.find()
    .sort({ updatedAt: sort })
    .limit(limit)
    .lean()) as PostType[];

  return withCategoryNames(posts);
}

export async function getPostBySlug(
  slug: string,
): Promise<PostWithCategoryName | null> {
  await connect();
  const post = await Post.findOne({ slug }).lean();

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

export async function getAllPosts(): Promise<PostWithCategoryName[]> {
  await connect();
  const posts = (await Post.find().lean()) as PostType[];

  console.log("posts", posts);

  return withCategoryNames(posts);
}

import { PostType } from "@/types/Post";
import Category from "@/lib/models/CategoryModel";

export type PostWithCategoryName = PostType & {
  categoryName: string | null;
};

export async function withCategoryNames(
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

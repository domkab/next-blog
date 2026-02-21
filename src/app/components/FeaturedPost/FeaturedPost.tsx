import { getFeaturedPosts } from "@/lib/services/postService";
import LinkTracker from "../Tracking/LinkTracker";
import Image from "next/image";
import { getImageUrl } from "@/utils/getImageUrl";
import clsx from "clsx";
import styles from "./FeaturedPost.module.scss";
import { labelFromSlug } from "@/utils/generateSlug";

export default async function FeaturedPost() {
  const featured = await getFeaturedPosts();
  const first = featured[0];

  if (!first) return null;

  const { post, overrideImage, overrideSummary } = first;

  return (
    <div className={clsx(styles["featured-post"], "mx-auto max-w-7xl")}>
      <LinkTracker
        href={`/post/${post.slug}`}
        eventName="featured_post_click"
        eventData={{
          slug: post.slug,
          title: post.title,
          category: post.category || "uncategorized",
        }}
        className="block"
      >
        <article
          className={clsx(
            styles["featured-post__article"],
            "flex flex-col bg-white dark:bg-slate-800 rounded-lg shadow-md border",
            "border-teal-300 hover:shadow-lg hover:translate-y-[-1px] transition-all duration-300",
          )}
        >
          <div className="w-full h-64 md:h-96 relative">
            <Image
              src={getImageUrl(overrideImage || post.images?.main?.url)}
              alt={post.title}
              fill
              unoptimized
              priority
              className={clsx(styles["featured-post__image"], "object-cover")}
            />
          </div>

          <div className="p-4 flex flex-col gap-2">
            <h3 className="text-xl font-bold mb-2">{post.title}</h3>

            {post.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {overrideSummary || post?.description}
              </p>
            )}

            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 italic">
              {post.category && <span>{labelFromSlug(post.category)}</span>}
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>

            <span className="text-teal-500 hover:underline cursor-pointer flex items-center gap-1 w-fit">
              Read article →
            </span>
          </div>
        </article>
      </LinkTracker>
    </div>
  );
}

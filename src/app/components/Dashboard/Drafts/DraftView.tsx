"use client";

import clsx from "clsx";
import { Button } from "flowbite-react";
import Link from "next/link";
import PostContent from "@/app/components/PostContent/PostContent";
import styles from "@/app/post/[slug]/PostPage.module.scss";
import NotFound from "@/app/not-found";
import Image from "next/image";
import { getImageUrl } from "@/utils/getImageUrl";
import { labelFromSlug } from "@/utils/generateSlug";
import { getReadTimeMinutes } from "@/utils/utils";
import { useUser } from "@clerk/nextjs";
import { PostWithCategoryName } from "@/lib/services/postServiceUtils";
import RecentPosts from "../../RecentPosts/RecentPosts";

export default function DraftView({ post }: { post: PostWithCategoryName }) {
  const { isSignedIn, user } = useUser();

  if (!post) return <NotFound />;
  if (!(isSignedIn && user.publicMetadata.isAdmin)) {
    return (
      <h1 className="text-center text-3xl my-7 font-semibold min-h-screen">
        You need to be an admin to preview drafts
      </h1>
    );
  }

  return (
    <main className={styles.post}>
      <div className={styles.post__layout}>
        <h1 className={styles.post__title}>{post.title}</h1>

        {post.category && (
          <Link
            href={`/search?category=${post.category}`}
            className={styles.post__category}
          >
            <Button color="gray" pill size="xs">
              <span>{post.categoryName ?? labelFromSlug(post.category)}</span>
            </Button>
          </Link>
        )}

        {post.images.main.url && (
          <figure className={styles.post__hero}>
            <Image
              src={getImageUrl(post.images.main.url)}
              alt={
                post.images.main.meta?.altText ||
                post.images.main.meta?.description ||
                "Main Image"
              }
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 92vw, 1200px"
              fill
              unoptimized
              priority
              className={styles.post__heroImage}
            />

            {(post.images.main.meta?.description ||
              post.images.main.meta?.author) && (
              <figcaption className={clsx(styles.post__caption)}>
                {post.images.main.meta?.author
                  ? `${post.images.main.meta?.description} — ${post.images.main.meta?.author}`
                  : post.images.main.meta?.description}
              </figcaption>
            )}
          </figure>
        )}

        <div className={styles.post__meta}>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <span className={styles.post__readTime}>
            {getReadTimeMinutes(post.content)} min read
          </span>
        </div>

        <PostContent post={post} />
      </div>
      <div className={styles.post__extras}>
        {/* <RecentPosts limit={3} /> */}
        {/* <EmailSubscribeWModal /> */}
      </div>
    </main>
  );
}

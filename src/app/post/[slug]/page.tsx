import clsx from "clsx";
import { Button } from "flowbite-react";
import Link from "next/link";
import RecentPosts from "@/app/components/RecentPosts/RecentPosts";
import PostContent from "@/app/components/PostContent/PostContent";
import styles from "./PostPage.module.scss";
import NotFound from "@/app/not-found";
import { getPostBySlug } from "@/lib/services/postService";
import Image from "next/image";
import { EmailSubscribeWModal } from "@/app/components/CallToAction/EmailSubscribeWModal";
import { getImageUrl } from "@/utils/getImageUrl";
import { labelFromSlug } from "@/utils/generateSlug";
import { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  console.log("post:", post);

  if (!post) {
    return {
      title: { absolute: "Not found" },
      robots: { index: false, follow: false },
    };
  }

  const titleText = post.title;
  const desc = post.description || "";
  const heroUrl = post.images?.main?.url
    ? getImageUrl(post.images.main.url)
    : undefined;

  return {
    title: { absolute: `${titleText} — ${SITE_NAME}` },
    description: desc,
    openGraph: {
      type: "article",
      title: titleText,
      description: desc,
      ...(heroUrl
        ? { images: [{ url: heroUrl, width: 1200, height: 630 }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description: desc,
      ...(heroUrl ? { images: [heroUrl] } : {}),
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return <NotFound />;

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
            {(post.content.length / 1000).toFixed(0)} mins read
          </span>
        </div>

        <PostContent post={post} />
      </div>
      <div className={styles.post__extras}>
        <RecentPosts limit={3} />
        <EmailSubscribeWModal />
      </div>
    </main>
  );
}

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
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getReadTimeMinutes, normalizePostContent } from "@/utils/utils";
import PostJsonLd from "./PostJsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: { absolute: "Not found" },
      robots: { index: false, follow: false },
    };
  }

  const title = post.title;
  const description =
    post.description?.trim() ||
    normalizePostContent(post.content).slice(0, 155).trim();

  const heroUrl = post.images?.main?.url
    ? getImageUrl(post.images.main.url)
    : undefined;

  const postUrl = `${SITE_URL}/post/${post.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      type: "article",
      url: postUrl,
      title,
      description,
      siteName: SITE_NAME,
      publishedTime: new Date(post.createdAt).toISOString(),
      modifiedTime: new Date(post.updatedAt).toISOString(),
      section: post.categoryName ?? post.category,
      ...(heroUrl
        ? {
            images: [
              {
                url: heroUrl,
                width: 1200,
                height: 630,
                alt:
                  post.images?.main?.meta?.altText ||
                  post.images?.main?.meta?.description ||
                  post.title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
      <PostJsonLd post={post} slug={slug} />

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
        <RecentPosts limit={3} />
        <EmailSubscribeWModal />
      </div>
    </main>
  );
}

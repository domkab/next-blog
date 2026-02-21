import clsx from "clsx";
import { Button } from "flowbite-react";
import Link from "next/link";
import RecentPosts from "@/app/components/RecentPosts/RecentPosts";
import PostContent from "@/app/components/PostContent/PostContent";
// import styles from "../../components/PostContent/PostContent.module.scss";
import styles from "./PostPage.module.scss";
import NotFound from "@/app/not-found";
import { getPostBySlug } from "@/lib/services/postService";
import Image from "next/image";
import { EmailSubscribeWModal } from "@/app/components/CallToAction/EmailSubscribeWModal";
import { getImageUrl } from "@/utils/getImageUrl";
import { labelFromSlug } from "@/utils/generateSlug";

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
              {labelFromSlug(post.category)}
            </Button>
          </Link>
        )}

        {post.images.main.url && (
          <figure className={styles.post__hero}>
            <Image
              src={getImageUrl(post.images.main.url)}
              alt={post.images.main.meta?.description || "Main Image"}
              sizes="(max-width: 768px) 100vw, 680px"
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

import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

import { getImageUrl } from "@/utils/getImageUrl";
import { labelFromSlug } from "@/utils/generateSlug";
import { PostWithCategoryName } from "@/lib/services/postService";

import styles from "./PostCard.module.scss";

type PostCardProps = {
  post: PostWithCategoryName;
  limit?: number;
};

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/post/${post.slug}`}
      className={clsx(styles.postCard, "group")}
      aria-label={`Read article: ${post.title}`}
    >
      <article className={styles.postCard__inner}>
        <div className={styles.postCard__media}>
          <figure className={styles.postCard__imageWrapper}>
            <Image
              src={getImageUrl(post.images.main.url)}
              alt={post.title}
              fill
              unoptimized
              priority
              className={styles.postCard__image}
            />
          </figure>
        </div>

        <div className={styles.postCard__content}>
          <p className={styles.postCard__title}>{post.title}</p>

          <div className={styles.postCard__meta}>
            <span className={styles.postCard__category}>
              {post.categoryName ?? labelFromSlug(post.category)}
            </span>

            <span className={styles.postCard__date}>
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className={styles.postCard__description}>{post.description}</p>
        </div>
      </article>
    </Link>
  );
}

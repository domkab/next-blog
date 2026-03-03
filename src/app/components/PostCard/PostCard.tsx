import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/utils/getImageUrl";
import { labelFromSlug } from "@/utils/generateSlug";
import styles from "./PostCard.module.scss";
import clsx from "clsx";
import { PostWithCategoryName } from "@/lib/services/postService";

type PostCardProps = {
  post: PostWithCategoryName;
  limit?: number;
};

export default function PostCard({ post }: PostCardProps) {
  return (
    <div
      className={clsx(
        "group relative w-full border md:min-w-[320px] border-teal-500 hover:border-2 h-[420px] overflow-hidden rounded-lg sm:w-full transition-all",
        styles.postCard,
      )}
    >
      <Link href={`/post/${post.slug}`}>
        <div
          className={clsx(
            "relative w-full h-[260px] group-hover:h-[200px] transition-all duration-300",
          )}
        >
          <figure className={styles.postCard__imageWrapper}>
            <Image
              src={getImageUrl(post.images.main.url)}
              alt="post cover"
              fill
              unoptimized
              priority
              className={clsx("object-cover", styles.postCard__image)}
            />
          </figure>
        </div>
      </Link>

      <div className="p-3 flex flex-col gap-2">
        <p className="text-lg font-semibold leading-[1.25] line-clamp-2 mb-1">
          {post.title}
        </p>

        <div className="flex justify-between mb-3">
          <span className="italic text-sm/4">
            <span>{post.categoryName ?? labelFromSlug(post.category)}</span>
          </span>
          <span className="italic text-sm/4">
            {post && new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* try hiding desc on mobile */}
        {/* fix lineheights and spacings */}
        {/* see your notes for more details */}

        {/* <p className="text-sm">{post.description}</p> */}

        {/* <p className="text-sm leading-[1.4] line-clamp-1 md:line-clamp-2">
          {post.description}
        </p> */}

        <p
          className={clsx(
            styles.postCard__description,
            "text-sm text-gray-500 leading-[1.4] line-clamp-2",
          )}
        >
          {post.description}
        </p>

        <Link
          href={`/post/${post.slug}`}
          className={clsx(
            "z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2",
          )}
        >
          Read article
        </Link>
      </div>
    </div>
  );
}

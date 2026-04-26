import React from "react";
import parse, {
  HTMLReactParserOptions,
  Element as DomElement,
  Text as DomText,
  domToReact,
} from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import { PostType } from "@/types/Post";
import styles from "./PostContent.module.scss";
import { getImageUrl } from "@/utils/getImageUrl";
import Link from "next/link";

interface PostContentProps {
  post: PostType;
}

const isInternalHref = (href: string) => {
  return (
    href.startsWith("/") ||
    href.startsWith("#") ||
    href.startsWith("./") ||
    href.startsWith("../")
  );
};

const normalizeImageUrl = (url?: string) => {
  if (!url) return "";

  try {
    return decodeURIComponent(url).trim();
  } catch {
    return url.trim();
  }
};

const getStoragePathFromUrl = (url?: string) => {
  const normalizedUrl = normalizeImageUrl(url);

  const marker = ".app/";
  const markerIndex = normalizedUrl.indexOf(marker);

  if (markerIndex === -1) return "";

  return normalizedUrl.slice(markerIndex + marker.length);
};

const PostContent: React.FC<PostContentProps> = ({ post }) => {
  const options: HTMLReactParserOptions = {
    replace: (domNode, index) => {
      if (domNode.type === "tag" && domNode.name === "a") {
        const linkNode = domNode as DomElement;
        const href = linkNode.attribs?.href?.trim();

        if (!href) {
          return (
            <span key={index} className={styles["post-content__link-invalid"]}>
              {domToReact(linkNode.children as never, options)}
            </span>
          );
        }

        const children = domToReact(linkNode.children as never, options);

        if (isInternalHref(href)) {
          return (
            <Link
              key={index}
              href={href}
              className={styles["post-content__link"]}
            >
              {children}
            </Link>
          );
        }

        return (
          <Link
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles["post-content__link"]}
          >
            {children}
          </Link>
        );
      }

      if (domNode.type === "tag" && domNode.name === "p") {
        const p = domNode as DomElement;

        const imgNode = p.children.find(
          child => child.type === "tag" && (child as DomElement).name === "img",
        ) as DomElement | undefined;

        if (imgNode) {
          const { src, alt } = imgNode.attribs;

          const imageSrc = src?.trim() || "";
          const normalizedSrc = normalizeImageUrl(imageSrc);
          const srcStoragePath = getStoragePathFromUrl(imageSrc);

          const inlineImage = post.images.inline.find(image => {
            if (image.storagePath && srcStoragePath) {
              return image.storagePath === srcStoragePath;
            }

            return normalizeImageUrl(image.url) === normalizedSrc;
          });

          const meta = (inlineImage?.meta || {}) as {
            author?: string;
            description?: string;
            altText?: string;
          };

          const hasCaption =
            (meta.description && meta.description.trim()) ||
            (meta.author && meta.author.trim());

          return (
            <figure key={index} className={styles["post-content__figure"]}>
              <Image
                src={getImageUrl(normalizedSrc)}
                alt={
                  meta?.altText || meta?.description || alt || "inline image"
                }
                width={800}
                height={450}
                unoptimized
                priority
                className={styles["post-content__image"]}
              />

              {hasCaption && (
                <figcaption className={styles["post-content__caption"]}>
                  {meta.author && meta.description
                    ? `${meta.description} — ${meta.author}`
                    : meta.description || meta.author}
                </figcaption>
              )}
            </figure>
          );
        }

        const isEmptyParagraph =
          p.children.length === 0 ||
          p.children.every(c => {
            if (c.type === "text") {
              const text = (c as DomText).data.replace(/\u00A0/g, " ");
              return text.trim() === "";
            }
            // Quill sometimes uses <br> inside empty paragraphs
            if (c.type === "tag" && (c as DomElement).name === "br") {
              return true;
            }

            return false;
          });

        if (isEmptyParagraph) {
          return (
            <p key={index} className={styles["post-content__empty-paragraph"]}>
              <br />
            </p>
          );
        }

        const allText = p.children.every(
          c => c.type === "text" && !(c as DomText).data.trim(),
        );

        if (allText) {
          return <React.Fragment key={index} />;
        }
      }
    },
  };

  //  move to backend in the future

  const cleanHtml = DOMPurify.sanitize(post.content, {
    USE_PROFILES: { html: true },
  });

  return (
    <article className={styles["post-content"]}>
      {parse(cleanHtml, options)}
    </article>
  );
};

export default PostContent;

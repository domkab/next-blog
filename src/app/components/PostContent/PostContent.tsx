import React from "react";
import parse, {
  HTMLReactParserOptions,
  Element as DomElement,
  Text as DomText,
} from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import { PostType } from "@/types/Post";
import styles from "./PostContent.module.scss";
import { getImageUrl } from "@/utils/getImageUrl";

interface PostContentProps {
  post: PostType;
}

const PostContent: React.FC<PostContentProps> = ({ post }) => {
  const options: HTMLReactParserOptions = {
    replace: (domNode, index) => {
      if (domNode.type === "tag" && domNode.name === "p") {
        const p = domNode as DomElement;

        const imgNode = p.children.find(
          child => child.type === "tag" && (child as DomElement).name === "img",
        ) as DomElement | undefined;

        if (imgNode) {
          const { src, alt } = imgNode.attribs;

          // Now we treat `src` as a public local path
          const path = decodeURIComponent(src);
          const inlineImage = post.images.inline.find(i => i.url === path);

          const meta = (inlineImage?.meta || {}) as {
            author?: string;
            description?: string;
          };

          const hasCaption =
            (meta.description && meta.description.trim()) ||
            (meta.author && meta.author.trim());

          return (
            <figure key={index} className={styles["post-content__figure"]}>
              <Image
                src={getImageUrl(path)}
                alt={alt || meta.description || "inline image"}
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

        const isEmptyParagraph = p.children.every(c => {
          if (c.type === "text") {
            const text = (c as DomText).data.replace(/\u00A0/g, " ");
            return text.trim() === "";
          }
          // Quill sometimes uses <br> inside empty paragraphs
          if (c.type === "tag" && (c as DomElement).name === "br") return true;
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

  // IMPLEMENT IN DB ON SAVE:

  // later implement clean up on back end submission:

  // const normalized = content
  // .replace(/&nbsp;/g, " ")
  // .replace(/\u00A0/g, " ");

  //  also strip unneccessary inline styling:
  // <span style="color: rgb(...); background-color: rgb(...);"></span>

  // const cleanHtml = post.content
  //   .replace(/&nbsp;/g, " ")
  //   .replace(/\u00A0/g, " ");

  const normalized = post.content
    .replace(/&nbsp;/g, " ")
    .replace(/\u00A0/g, " ");

  const cleanHtml = DOMPurify.sanitize(normalized, {
    USE_PROFILES: { html: true },
  });

  return (
    <article className={styles["post-content"]}>
      {parse(cleanHtml, options)}
    </article>
  );
};

export default PostContent;

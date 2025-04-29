import React from 'react';
import parse, {
  HTMLReactParserOptions,
  Element as DomElement,
  Text as DomText,
} from 'html-react-parser';
import Image from 'next/image';
import { PostType } from '@/types/Post';
import styles from './PostContent.module.scss';

interface PostContentProps {
  post: PostType;
}

const PostContent: React.FC<PostContentProps> = ({ post }) => {
  const options: HTMLReactParserOptions = {
    replace: (domNode, index) => {
      if (domNode.type === 'tag' && domNode.name === 'p') {
        const p = domNode as DomElement;

        if (
          p.children.length === 1 &&
          p.children[0].type === 'tag' &&
          (p.children[0] as DomElement).name === 'img'
        ) {
          const imgNode = p.children[0] as DomElement;
          const { src, alt } = imgNode.attribs;
          const inlineImage = post.images.inline.find(i => i.url === src);
          if (!inlineImage) {
            return;
          }

          const { meta } = inlineImage;
          const hasCaption = Boolean(meta?.description || meta?.author);

          return (
            <figure key={index} className={styles['post-content__figure']}>
              <Image
                src={src}
                alt={alt || meta?.description || 'inline image'}
                width={800}
                height={450}
                className={styles['post-content__image']}
              />
              {hasCaption && (
                <figcaption className={styles['post-content__caption']}>
                  {meta?.author
                    ? `${meta?.description} — ${meta?.author}`
                    : meta?.description !== alt
                      ? meta?.description
                      : null}
                </figcaption>
              )}
            </figure>
          );
        }

        const allText = p.children.every(
          c => c.type === 'text' && !((c as DomText).data.trim())
        );
        if (allText) {
          return <React.Fragment key={index} />;
        }
      }
    },
  };

  return <div className={styles['post-content']}>{parse(post.content, options)}</div>;
};

export default PostContent;
import React from 'react';
import parse, {
  HTMLReactParserOptions,
  Element as DomElement,
  Text as DomText,
} from 'html-react-parser';
import { PostType } from '@/types/Post';
import styles from './PostContent.module.scss';
import SecuredImage from '../SecureImage';

interface PostContentProps {
  post: PostType;
}

const PostContent: React.FC<PostContentProps> = ({ post }) => {
  const options: HTMLReactParserOptions = {
    replace: (domNode, index) => {
      if (domNode.type === 'tag' && domNode.name === 'p') {
        const p = domNode as DomElement;

        const imgNode = p.children.find(
          (child) => child.type === 'tag' && (child as DomElement).name === 'img'
        ) as DomElement | undefined;

        if (imgNode) {
          const { src, alt } = imgNode.attribs;

          const extractPath = (url: string) => {
            const decoded = decodeURIComponent(url);
            const match = decoded.match(/\/posts\/[^\s"'?<>]+/);
            return match ? match[0].replace(/^\//, '') : url;
          };

          const path = extractPath(src);
          const inlineImage = post.images.inline.find(i => i.url === path);

          const meta = (inlineImage?.meta || {}) as {
            author?: string;
            description?: string;
          };

          const hasCaption =
            (meta.description && meta.description.trim()) ||
            (meta.author && meta.author.trim());

          return (
            <figure key={index} className={styles['post-content__figure']}>
              <SecuredImage
                path={path}
                alt={alt || meta?.description || 'inline image'}
                width={800}
                height={450}
                className={styles['post-content__image']}
                unoptimized
              />
              {hasCaption && (
                <figcaption className={styles['post-content__caption']}>
                  {meta.author && meta.description
                    ? `${meta.description} — ${meta.author}`
                    : meta.description || meta.author}
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
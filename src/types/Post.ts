import { PostCategory } from './PostCategory';

export interface ImageMeta {
  author?: string;
  link?: string;
  license?: string;
}

export interface PostImage {
  url: string;
  meta?: ImageMeta;
}

export interface PostType {
  _id: string;
  userId: string;
  content: string;
  title: string;
  images: {
    main: PostImage;
    inline: PostImage[];
  };
  category: PostCategory;
  slug: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}
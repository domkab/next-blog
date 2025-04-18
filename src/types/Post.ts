export interface ImageMeta {
  description: string;
  author?: string;
}

export interface PostImage {
  id: string
  url: string;
  meta?: ImageMeta;
}

export enum PostCategory {
  All = '',
  Uncategorized = 'uncategorized',
  JavaScript = 'javascript',
  ReactJS = 'reactjs',
  NextJS = 'nextjs'
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
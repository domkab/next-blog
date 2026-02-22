export interface ImageMeta {
  description: string;
  author?: string;
}

export interface PostImage {
  id: string;
  url: string;
  meta?: ImageMeta;
}

export enum PostCategory {
  All = "",
  Uncategorized = "uncategorized",
  JavaScript = "javascript",
  ReactJS = "reactjs",
  NextJS = "nextjs",
}

export interface PostType {
  _id: string;
  userId: string;
  content: string;
  title: string;
  description: string;
  images: {
    main: PostImage;
    inline: PostImage[];
  };
  category: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface PostCreateInput {
  userMongoId: string;
  title: string;
  description: string;
  content: string;
  category: PostCategory;
  images: {
    main: PostImage;
    inline?: PostImage[];
  };
}

export interface PostUpdateInput {
  postId: string;
  userMongoId: string;
  title: string;
  description: string;
  content: string;
  category: string;
  images: {
    main: PostImage;
    inline?: PostImage[];
  };
}

export interface FeaturedPostType {
  _id?: string;
  post: PostType;
  overrideSummary?: string;
  overrideImage?: string;
  __v?: number;
}

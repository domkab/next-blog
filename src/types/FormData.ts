export interface ImageMeta {
  author?: string;
  description?: string;
  altText?: string;
}

export interface ImageData {
  id: string;
  url: string;
  storagePath?: string;
  provider?: "firebase";
  meta?: ImageMeta;
}

export interface FormData {
  title: string;
  description: string;
  content: string;
  slug: string;
  category: string;
  images: {
    main: {
      url: string;
      storagePath?: string;
      provider?: "firebase";
      meta?: ImageMeta;
    };
    inline: ImageData[];
  };
}

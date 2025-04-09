export interface FormData {
  title: string;
  content: string;
  slug: string;
  category: string;
  images: {
    main: {
      url: string;
      meta?: {
        author?: string;
        link?: string;
        license?: string;
      };
    };
    inline: Array<{
      url: string;
      meta?: {
        author?: string;
        link?: string;
        license?: string;
      };
    }>;
  };
}
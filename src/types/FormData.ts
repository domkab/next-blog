export interface FormData {
  title: string;
  content: string;
  slug: string;
  category: string;
  images: {
    main: {
      url: string;
      meta?: {
        author?: string
        description?: string
      };
    };
    inline: Array<{
      id: string;
      url: string;
      meta?: {
        author?: string
        description?: string
      };
    }>;
  };
}
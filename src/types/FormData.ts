// export interface FormData {
//   title: string;
//   content: string;
//   image?: string;
//   category: string;
// }

export interface FormData {
  title: string;
  content: string;
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
  category: string;
}
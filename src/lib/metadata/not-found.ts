import { Metadata } from "next";
import { seoDefaults } from "./seoDefaults";

export const notFoundMetadata: Metadata = {
  ...seoDefaults,
  title: "Page Not Found",
  description:
    "The page you were looking for could not be found. Head back to the homepage or explore other articles on the site.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

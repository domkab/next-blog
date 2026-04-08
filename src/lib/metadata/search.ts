import { Metadata } from "next";
import { SITE_URL } from "../constants";
import { seoDefaults } from "./seoDefaults";

export const searchMetadata: Metadata = {
  ...seoDefaults,
  title: "Tech Buying Guides & Laptop Advice",
  description:
    "Browse practical tech buying guides, laptop comparisons, and real-world advice to help you choose the right device without overpaying.",
  alternates: {
    canonical: `${SITE_URL}/search`,
  },
};

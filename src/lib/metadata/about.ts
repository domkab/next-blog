import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "../constants";
import { seoDefaults } from "./seoDefaults";

export const aboutMetadata: Metadata = {
  ...seoDefaults,
  title: "About Pixel Tech — Practical Tech Buying Advice",
  description:
    "Pixel Tech helps you make smarter tech buying decisions with clear, real-world advice on laptops and everyday gadgets.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
};

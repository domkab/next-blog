import { Metadata } from "next";
import { SITE_NAME } from "../constants";
import { seoDefaults } from "./seoDefaults";

export const layoutMetadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  // needs more better description i think ?
  // needs to be dynamic based on the content of the page?
  description:
    "Practical tech buying guides, laptop comparisons, and gadget advice for people who want clarity without the jargon.",
  keywords: [
    "tech buying guides",
    "laptop buying guide",
    "laptop comparisons",
    "RAM explained",
    "SSD explained",
    "MacBook Air vs MacBook Pro",
    "how to choose a laptop",
    "tech blog",
    "gadget advice",
  ],
  ...seoDefaults,
};

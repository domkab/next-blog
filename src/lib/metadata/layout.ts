import { Metadata } from "next";
import { SITE_NAME } from "../constants";
import { seoDefaults } from "./seoDefaults";

export const layoutMetadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Practical tech buying guides, laptop comparisons, and clear gadget advice for people who want to make smart choices without getting lost in specs.",
  keywords: [
    "tech buying guides",
    "laptop buying guide",
    "laptop comparisons",
    "MacBook Air vs MacBook Pro",
    "RAM explained",
    "SSD explained",
    "how to choose a laptop",
    "gadget advice",
    "practical tech blog",
  ],
  ...seoDefaults,
};

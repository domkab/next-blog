import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import { seoDefaults } from "./seoDefaults";

export const contactMetadata: Metadata = {
  ...seoDefaults,
  title: "Contact Pixel Tech",
  description:
    "Get in touch with Pixel Tech for feedback, questions, or collaboration inquiries.",
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
};

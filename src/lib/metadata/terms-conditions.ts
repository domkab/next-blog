import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import { seoDefaults } from "./seoDefaults";

export const termsConditionsMetadata: Metadata = {
  ...seoDefaults,
  title: "Terms and Conditions",
  description:
    "Read Pixel Tech’s Terms and Conditions to understand the rules and guidelines for using the website.",
  alternates: {
    canonical: `${SITE_URL}/terms-and-conditions`,
  },
};

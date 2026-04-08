import { Metadata } from "next";
import { SITE_URL } from "../constants";
import { seoDefaults } from "./seoDefaults";

export const privacyPolicyMetadata: Metadata = {
  ...seoDefaults,
  title: "Privacy Policy",
  description:
    "Read Pixel Tech’s Privacy Policy to learn how your information is collected, used, and protected on the site.",
  alternates: {
    canonical: `${SITE_URL}/privacy-policy`,
  },
};

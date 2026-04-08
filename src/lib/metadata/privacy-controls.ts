import { Metadata } from "next";
import { SITE_URL } from "../constants";
import { seoDefaults } from "./seoDefaults";

export const privacyControlsMetadata: Metadata = {
  ...seoDefaults,
  title: "Privacy Controls",
  description:
    "Manage your privacy preferences and control how data and cookies are used on Pixel Tech.",
  alternates: {
    canonical: `${SITE_URL}/privacy-controls`,
  },
};

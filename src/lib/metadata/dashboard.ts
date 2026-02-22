import { Metadata } from "next";
import { SITE_NAME } from "../constants";
import { seoDefaults } from "./seoDefaults";

export const dashboardMetadata: Metadata = {
  title: { absolute: `${SITE_NAME} | dashboard` },
  ...seoDefaults,
  keywords: [],
  robots: {
    index: false,
    follow: false,
  },
};

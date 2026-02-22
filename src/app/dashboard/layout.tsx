import type { Metadata } from "next";

// this allows to inherit metadata from the root layout and add to it
// see https://nextjs.org/docs/app/building-your-application/metadata#inheriting-metadata-from-layouts

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Dashboard",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

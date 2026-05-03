import "./globals.css";
import "./globals.scss";
import ReduxProvider from "@/redux/ReduxProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import NavigationLoader from "./components/Navigation/NavigationLoader";
import GA from "./components/Tracking/GA";
import PageViewTracker from "./components/Tracking/PageViewTracker";
import CookieBannerToggle from "./components/Tracking/CookieBannerToggle";
import ThemeComponent from "./components/ThemeComponent";
import { layoutMetadata } from "@/lib/metadata/layout";
import BodyFontManager from "./components/BodyFontManager";
import Script from "next/script";
import { cookies, headers } from "next/headers";
import TrackingExclusion from "./components/Tracking/TrackingExclusion";

export const metadata = layoutMetadata;

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   display: "swap",
//   variable: "--font-poppins",
// });

// const outfit = Outfit({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   display: "swap",
//   variable: "--font-outfit",
// });

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const useThemeFlag = process.env.NEXT_PUBLIC_USE_THEME === "true";
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const cookieStore = await cookies();
  const ignoreTracking = cookieStore.get("umami_ignore");

  const shouldTrack = !pathname.startsWith("/dashboard") && !ignoreTracking;

  const shouldShowCookieBanner =
    headersList.get("x-should-show-cookie-banner") === "1";

  const bodyClassName = `
  ${inter.variable} 
  antialiased -webkit-font-smoothing
  antialiased${useThemeFlag ? "" : " background"}
  `;

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={bodyClassName}>
          <TrackingExclusion />
          {/* umami analytics */}
          {shouldTrack && (
            <Script
              src="https://cloud.umami.is/script.js"
              data-website-id={
                process.env.NODE_ENV === "production"
                  ? "034cf6a9-05f1-4a66-a1b2-9599289dcdb1"
                  : "d9b1cbb6-5b3c-4c8e-9a2b-9c0a1fbbd8b2"
              }
              strategy="afterInteractive"
              defer
            />
          )}

          <BodyFontManager />
          <ReduxProvider>
            <ThemeComponent>
              <div className="flex min-h-screen flex-col">
                <Suspense fallback={<div>Loading...</div>}>
                  <Header />
                </Suspense>
                <NavigationLoader />

                {shouldTrack && <GA />}
                {shouldTrack && (
                  <Suspense fallback={null}>
                    <PageViewTracker />
                  </Suspense>
                )}

                <CookieBannerToggle initialShow={shouldShowCookieBanner} />
                {children}
                <Footer />
              </div>
            </ThemeComponent>
          </ReduxProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

import "./globals.css";
import "./globals.scss";
import ReduxProvider from '@/redux/ReduxProvider';
import { ClerkProvider } from '@clerk/nextjs';
import {
  Poppins,
  Outfit,
  Inter
} from "next/font/google";
import { Suspense } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import NavigationLoader from './components/Navigation/NavigationLoader';
import GA from './components/Tracking/GA';
import PageViewTracker from './components/Tracking/PageViewTracker';
import CookieBannerToggle from './components/Tracking/CookieBannerToggle';
import ThemeComponent from './components/ThemeComponent';
import { layoutMetadata } from '@/lib/metadata/layout';
import BodyFontManager from './components/BodyFontManager';
import Script from 'next/script';

export const metadata = layoutMetadata;

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-outfit',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const useThemeFlag = process.env.NEXT_PUBLIC_USE_THEME === 'true';

  const bodyClassName = `
  ${inter.variable} 
  ${outfit.variable} 
  ${poppins.variable}
  antialiased -webkit-font-smoothing
  antialiased${useThemeFlag ? '' : ' background'}
  `;

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={bodyClassName}>
          {/* umami analytics */}
          <Script
            src="https://analytics.gargofx.com/script.js"
            data-website-id="5ee64313-9ea0-421e-9cf5-44936d0ef79e"
            strategy="afterInteractive"
            defer
          />

          <BodyFontManager />
          <ReduxProvider>
            <ThemeComponent>
              <div className="flex min-h-screen flex-col">
                <Suspense fallback={<div>Loading...</div>}>
                  <Header />
                </Suspense>
                <NavigationLoader />
                <PageViewTracker />
                <GA />
                <CookieBannerToggle />
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

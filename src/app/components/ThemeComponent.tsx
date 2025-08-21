'use client';

import { ThemeProvider, useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const useThemeFlag = process.env.NEXT_PUBLIC_USE_THEME === 'true';

function ThemeContent({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <div
      className={`min-h-screen ${theme === 'dark'
        ? 'bg-gray-900 text-gray-200'
        : 'bg-white text-gray-700'
        }`}
    >
      {children}
    </div>
  );
}

// todo: add light mode settings

export default function ThemeComponent({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  const themingEnabled = useThemeFlag || isDashboard;

  useEffect(() => { setMounted(true); }, []);

  // case 1: theming is disabled globally and we are NOT in dashboard → force defined theme
  if (!themingEnabled) {
    return <div className="theme min-h-screen bg-black text-opacity-95">{children}</div>;
  }

  // wait until mounted to avoid hydration mismatches
  if (!mounted) return <div className="opacity-0">{children}</div>;

  // case 2: theming is enabled (env or dashboard) → ThemeProvider active
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <ThemeContent>{children}</ThemeContent>
    </ThemeProvider>
  );
}
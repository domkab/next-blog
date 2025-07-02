'use client';

import { ThemeProvider, useTheme } from "next-themes";
import { useEffect, useState } from "react";

const useThemeFlag = process.env.NEXT_PUBLIC_USE_THEME === 'true';

export default function ThemeComponent({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!useThemeFlag) {
    // Theme is disabled, no need for FOUC fix
    return <>{children}</>;
  }

  if (!mounted) {
    // Theme is enabled, apply FOUC protection
    return <div className="opacity-0">{children}</div>;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ThemeContent>{children}</ThemeContent>
    </ThemeProvider>
  );
}

function ThemeContent({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <div className={theme}>
      <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-gray-900 min-h-screen">
        {children}
      </div>
    </div>
  );
}
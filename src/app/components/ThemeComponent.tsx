"use client";

import { ThemeProvider, useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeComponent({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="opacity-0">{children}</div>; // Prevents Flash of Unstyled Content (FOUC)

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

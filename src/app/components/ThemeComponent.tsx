'use client';

import { ThemeProvider, useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const useThemeFlag = process.env.NEXT_PUBLIC_USE_THEME === 'true';

function ThemeContent({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-transparent text-gray-700'
        }`}
    >
      {children}
    </div>
  );
}

export default function ThemeComponent({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  const themingEnabled = useThemeFlag || isDashboard;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!themingEnabled) return <>{children}</>;
  if (!mounted) return <div className="opacity-0">{children}</div>;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ThemeContent>{children}</ThemeContent>
    </ThemeProvider>
  );
}


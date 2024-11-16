"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";

export default function ClientThemeProvider({ children }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? (
    <ThemeProvider attribute="class" defaultTheme="dark">
      {children}
    </ThemeProvider>
  ) : (
    <>{children}</>
  );
}

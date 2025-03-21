"use client";

import { useAtomValue } from "jotai";
import Header from "./components/header/header";
import { themeAtom } from "@/util/atoms";
import { useState, useEffect } from "react";
import { NavTabs } from "./components/tabs/nav-tabs";
import { Footer } from "./components/footer";

export default function LayoutClientReskin({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);
  const theme = useAtomValue(themeAtom);
  if (!loaded) return null;

  return (
    <div className={theme}>
      <main className="flex flex-col items-center bg-white text-black dark:bg-reskin-dark-gray dark:text-white">
        <div className="flex flex-col w-full h-screen">
          <Header />
          <NavTabs />
          {/* leave a space for the bottom nav tabs in mobile */}
          <div className="mb-20 md:mb-0 h-full flex flex-col">{children}</div>
          <Footer />
        </div>
      </main>
    </div>
  );
}

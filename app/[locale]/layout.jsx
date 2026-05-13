"use client";
import {GoogleAnalytics} from "@next/third-parties/google";
import dynamic from "next/dynamic";
import {usePathname, useParams} from "next/navigation";
import ReduxProvider from "@/components/ReduxProvider";
import NextTopLoader from "nextjs-toploader";
// import Search from "@/components/Search";
import "../../styles/globals.css";

import {SearchProvider} from "@/contexts/SearchContext";

const Navigation = dynamic(() => import("@/components/Navigation"));
const Footer = dynamic(() => import("@/components/Footer"));
const SearchComponent = dynamic(() => import("@/components/Search"));

export default function Layout({children}) {
  const pathname = usePathname();
  const params = useParams();
  const locale = params?.locale || "en";
  const isRTL = locale === "ar";
  const isVizEmbed = pathname.includes("/explore/viz/embed");
  const bodyContent = (
    <body className={isVizEmbed ? "embed" : undefined}>
      {isVizEmbed ? null : <NextTopLoader color="#363636" />}
      {isVizEmbed ? null : <SearchComponent />}
      {isVizEmbed ? null : <Navigation />}
      <main>
        <ReduxProvider>{children}</ReduxProvider>
      </main>
      {isVizEmbed ? null : <Footer />}
    </body>
  );
  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"}>
      <head>
        <link
          data-rh="true"
          rel="icon"
          href="/images/favicon.ico"
          type="image/x-icon"
        />
      </head>
      {isVizEmbed ? bodyContent : <SearchProvider>{bodyContent}</SearchProvider>}
      <GoogleAnalytics gaId="G-56HH4RQ1J2" />
    </html>
  );
}

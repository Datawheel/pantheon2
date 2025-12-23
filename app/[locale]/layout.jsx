"use client";
import {GoogleAnalytics} from "@next/third-parties/google";
import {D3plusContext} from "d3plus-react";
import dynamic from "next/dynamic";
import {usePathname} from "next/navigation";
import {useD3plusConfig} from "/themes/useD3plusConfig";
import ReduxProvider from "/components/ReduxProvider";
import NextTopLoader from "nextjs-toploader";
// import Search from "/components/Search";
import "/styles/globals.css";

import {SearchProvider} from "/contexts/SearchContext";

const Navigation = dynamic(() => import("/components/Navigation"));
const Footer = dynamic(() => import("/components/Footer"));
const SearchComponent = dynamic(() => import("/components/Search"));

export default function Layout({children}) {
  const config = useD3plusConfig();
  const pathname = usePathname();
  const isVizEmbed = pathname.includes("/explore/viz/embed");
  const bodyContent = (
    <body className={isVizEmbed ? "embed" : undefined}>
      {isVizEmbed ? null : <NextTopLoader color="#363636" />}
      {isVizEmbed ? null : <SearchComponent />}
      {isVizEmbed ? null : <Navigation />}
      <main>
        <D3plusContext.Provider value={config}>
          <ReduxProvider>{children}</ReduxProvider>
        </D3plusContext.Provider>
      </main>
      {isVizEmbed ? null : <Footer />}
    </body>
  );
  return (
    <html lang="en">
      <head>
        <link
          data-rh="true"
          rel="icon"
          href="/images/favicon.ico"
          type="image/x-icon"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Marcellus&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiko&display=swap"
          rel="stylesheet"
        />
      </head>
      {isVizEmbed ? bodyContent : <SearchProvider>{bodyContent}</SearchProvider>}
      <GoogleAnalytics gaId="G-56HH4RQ1J2" />
    </html>
  );
}

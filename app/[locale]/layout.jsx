"use client";
import {GoogleAnalytics} from "@next/third-parties/google";
import {D3plusContext} from "d3plus-react";
import {useD3plusConfig} from "/themes/useD3plusConfig";
import ReduxProvider from "/components/ReduxProvider";
import Navigation from "/components/Navigation";
import Footer from "/components/Footer";
// import Search from "/components/Search";
import "/styles/globals.css";

import {SearchProvider} from "/contexts/SearchContext";
import SearchComponent from "/components/Search";

export default function Layout({children}) {
  const config = useD3plusConfig();
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
      <SearchProvider>
        <body>
          <SearchComponent />
          <Navigation />
          <main>
            <D3plusContext.Provider value={config}>
              <ReduxProvider>{children}</ReduxProvider>
            </D3plusContext.Provider>
          </main>
          <Footer />
        </body>
      </SearchProvider>
      <GoogleAnalytics gaId="G-56HH4RQ1J2" />
    </html>
  );
}

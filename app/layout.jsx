"use client";
import { D3plusContext } from "d3plus-react";
import { useD3plusConfig } from "../themes/useD3plusConfig";
import ReduxProvider from "/components/ReduxProvider";
import Navigation from "/components/Navigation";
import Footer from "/components/Footer";
// import Search from "/components/Search";
import "../styles/globals.css";

export default function Layout({ children }) {
  const config = useD3plusConfig();
  return (
    <html lang="en">
      <head>
        <title>Pantheon</title>
      </head>
      <body>
        <Navigation />
        <main>
          <D3plusContext.Provider value={config}>
            <ReduxProvider>{children}</ReduxProvider>
          </D3plusContext.Provider>
        </main>
        <Footer />
      </body>
    </html>
  );
}

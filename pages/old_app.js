import React from "react";
import Layout from "/components/Layout";

import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "./app.css";

import { useState } from "react";

export default function App(props) {
  // const { children } = props;
  const { Component, pageProps, session } = props;

  const [searchActive, setSearchActive] = useState(false);

  return (
    <div id="App" className="container">
      {/* <GameAlert />
      {searchActive ? <Search activateSearch={this.activateSearch} /> : null}
      <Navigation />
      <div>{children}</div>
      <Footer /> */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}

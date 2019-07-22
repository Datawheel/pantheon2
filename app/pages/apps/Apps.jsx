import React from "react";
import Helmet from "react-helmet";

const Apps = ({children}) =>
  <div className="apps-page">
    <Helmet title="Apps - Pantheon" />
    <div>{children}</div>
  </div>;

export default Apps;

import React from "react";
import {Helmet} from "react-helmet-async";

const Apps = ({children}) =>
  <div className="apps-page">
    <Helmet title="Apps - Pantheon" />
    <div>{children}</div>
  </div>;

export default Apps;

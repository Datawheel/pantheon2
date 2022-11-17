import React from "react";
import { Helmet } from "react-helmet-async";

const Apps = ({ children }) => {
  return (
    <div className="apps-page">
      <Helmet title="Apps - Pantheon" />
      <div>{children}</div>
    </div>
  );
};
export default Apps;

import React from "react";
// import Link from "next/link";
import { Helmet } from "react-helmet-async";
// import styles from "css/components/miscpage";

const Data = ({ children }) => (
  <div className="data-page">
    <Helmet title="Data - Pantheon" />
    <div>{children}</div>
  </div>
);

export default Data;
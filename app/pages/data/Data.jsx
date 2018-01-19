import React from "react";
// import {Link} from "react-router";
import Helmet from "react-helmet";
// import styles from "css/components/miscpage";

const Data = ({children}) => {
  return (
    <div className="data">
      <Helmet title="Data - Pantheon" />
      {children}
    </div>
  );
};

export default Data;

import React from "react";
import { Link } from "react-router";
import Helmet from "react-helmet";

const Data = ({children}) => {
  return (
    <div className='data'>
      <Helmet title="Data" />
      <h1 className='header'>Data</h1>
      <nav className='subNav' role="navigation">
        <Link to="/data/datasets" className='item' activeClassName='active'>Datasets</Link>
        <Link to="/data/api" className='item' activeClassName='active'>API</Link>
        <Link to="/data/permissions" className='item' activeClassName='active'>Permissions</Link>
        <Link to="/data/faq" className='item' activeClassName='active'>FAQ</Link>
      </nav>

      {children}
    </div>
  );
};

export default Data;

import React, { Component, PropTypes } from 'react';
import {connect} from "react-redux";
import classNames from 'classnames/bind';
import styles from 'css/components/about';
import Header from 'pages/profile/domain/Header';
import ProfileNav from 'components/profile/Nav';
import Intro from 'pages/profile/domain/Intro';
// import Section from 'components/profile/Section';
//
// import Ranking from 'pages/profile/place/Ranking';
// import Occupations from 'pages/profile/place/Occupations';
// import LivingPeople from 'pages/profile/place/LivingPeople';

import { fetchDomain } from 'actions/domain';

const cx = classNames.bind(styles);

class Domain extends Component {

  constructor(props) {
    super(props);
  }

  static need = [
    fetchDomain,
  ]

  render() {
    const {domainProfile} = this.props;

    // return (<div>testing domain...</div>)
    return (
      <div>
        <Header domain={domainProfile.domain} />
        <ProfileNav sections={this.sections} />
        <Intro domain={domainProfile.domain} />
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    domainProfile: state.domainProfile
  };
}

export default connect(mapStateToProps)(Domain);

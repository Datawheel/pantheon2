import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Header from "pages/profile/domain/Header";
import ProfileNav from "components/profile/Nav";
import Intro from "pages/profile/domain/Intro";
// import Section from "components/profile/Section";
import { fetchDomain } from "actions/domain";

class Domain extends Component {

  constructor(props) {
    super(props);
  }

  static need = [
    fetchDomain,
  ]

  render() {
    const {domainProfile} = this.props;
    const {domain} = domainProfile;

    const sections = [
      {title: "Memorability Metrics", slug: "metrics"},
    ];

    // return (<div>testing domain...</div>)
    return (
      <div>
        <Helmet title={domain.name} meta={[ {property: 'og:title', content: domain.name}, ]} />
        <Header domain={domain} />
        <ProfileNav sections={sections} />
        <Intro domain={domain} />
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

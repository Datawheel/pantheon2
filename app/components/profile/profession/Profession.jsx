import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Header from "components/profile/profession/Header";
import ProfileNav from "components/profile/Nav";
import Intro from "components/profile/profession/Intro";
// import Section from "components/profile/Section";
import { fetchProfession } from "actions/profession";

class Profession extends Component {

  constructor(props) {
    super(props);
  }

  static need = [
    fetchProfession,
  ]

  render() {
    const {professionProfile} = this.props;
    const {profession} = professionProfile;

    const sections = [
      {title: "Memorability Metrics", slug: "metrics"},
    ];

    // return (<div>testing profession...</div>)
    return (
      <div>
        <Helmet title={profession.name} meta={[ {property: 'og:title', content: profession.name}, ]} />
        <Header domain={profession} />
        <ProfileNav sections={sections} />
        <Intro profession={profession} />
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    professionProfile: state.professionProfile
  };
}

export default connect(mapStateToProps)(Profession);

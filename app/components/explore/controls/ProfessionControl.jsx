import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { changeProfessions } from "actions/explorer";

const OCCUPATION_DEPTH = "OCCUPATION";
const INDUSTRY_DEPTH = "INDUSTRY";
const DOMAIN_DEPTH = "DOMAIN";

class ProfessionControl extends Component {

  constructor(props) {
    super(props);
    this.state = {
      professionDepth: OCCUPATION_DEPTH
    }
  }

  professionDepthChange(e) {
    e.preventDefault();
    const professionDepth = e.target.dataset.depth;
    this.setState({ professionDepth });
  }

  render() {
    const {selectedProfessionSlug, domains, industries, occupations} = this.props.explorer.profession;
    const depthChange = this.professionDepthChange.bind(this);
    const changeProfessions = this.props.changeProfessions.bind(this);
    const professionDepth = this.state.professionDepth;
    let professions = occupations;
    switch (professionDepth) {
      case INDUSTRY_DEPTH:
        professions = industries;
        break;
      case DOMAIN_DEPTH:
        professions = domains;
        break;
      default:
        professions = occupations;
    }

    return (
      <div className="filter">
        <h3>Professions:</h3>

        <h4>Within:</h4>
        <div>
          <a href="#" data-depth={OCCUPATION_DEPTH} onClick={depthChange}>Occupations</a> | <a href="#" data-depth={INDUSTRY_DEPTH} onClick={depthChange}>Industries</a> | <a href="#" data-depth={DOMAIN_DEPTH} onClick={depthChange}>Domains</a>
        </div>

        <select value={selectedProfessionSlug} onChange={changeProfessions}>
          <option value="all">All</option>
          {professions.map(p =>
            <option key={p.slug} value={p.slug} data-professions={p.professions}>
              {p.name}
            </option>
          )}
        </select>
      </div>
    );
  }
};


function mapStateToProps(state) {
  return {
    explorer: state.explorer,
  };
}

export default connect(mapStateToProps, { changeProfessions })(ProfessionControl);

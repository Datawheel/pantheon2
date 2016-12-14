import React, { Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { changeProfessions, changeProfessionDepth } from "actions/explorer";
import { OCCUPATION_DEPTH, INDUSTRY_DEPTH, DOMAIN_DEPTH } from 'types';

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
    const {selectedDepth, selectedProfessionSlug, domains, industries, occupations} = this.props.explorer.profession;
    const depthChange = this.professionDepthChange.bind(this);
    const changeProfessions = this.props.actions.changeProfessions.bind(this);
    const changeProfessionDepth = this.props.actions.changeProfessionDepth.bind(this);

    let professions = occupations;
    switch (selectedDepth) {
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
          <a href="#" data-depth={OCCUPATION_DEPTH} onClick={changeProfessionDepth}>Occupations</a> | <a href="#" data-depth={INDUSTRY_DEPTH} onClick={changeProfessionDepth}>Industries</a> | <a href="#" data-depth={DOMAIN_DEPTH} onClick={changeProfessionDepth}>Domains</a>
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

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({changeProfessions, changeProfessionDepth}, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfessionControl);

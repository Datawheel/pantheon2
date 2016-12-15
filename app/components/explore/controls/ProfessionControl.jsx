import React, { Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { changeProfessions, changeProfessionDepth } from "actions/explorer";
import { OCCUPATION_DEPTH, INDUSTRY_DEPTH, DOMAIN_DEPTH } from 'types';

class ProfessionControl extends Component {

  constructor(props) {
    super(props);
  }

  professionDepthClick(e) {
    e.preventDefault();
    this.props.actions.changeProfessionDepth(e.target.dataset.depth);
  }

  render() {
    const {selectedDepth, selectedProfessionSlug, domains, industries, occupations} = this.props.explorer.profession;
    const changeProfessions = this.props.actions.changeProfessions.bind(this);
    const professionDepthClick = this.professionDepthClick.bind(this);

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
          <a href="#" data-depth={OCCUPATION_DEPTH} onClick={professionDepthClick}>Occupations</a> | <a href="#" data-depth={INDUSTRY_DEPTH} onClick={professionDepthClick}>Industries</a> | <a href="#" data-depth={DOMAIN_DEPTH} onClick={professionDepthClick}>Domains</a>
        </div>

        <select value={selectedProfessionSlug} onChange={changeProfessions}>
          <option value="all" data-professions="all">All</option>
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

import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {changeOccupations, changeOccupationDepth} from "actions/explorer";
import {OCCUPATION_DEPTH, INDUSTRY_DEPTH, DOMAIN_DEPTH} from "types";

class OccupationControl extends Component {

  constructor(props) {
    super(props);
  }

  occupationDepthClick(e) {
    e.preventDefault();
    this.props.actions.changeOccupationDepth(e.target.dataset.depth);
  }

  render() {
    const {selectedDepth, selectedOccupationSlug, domains, industries, occupations} = this.props.explorer.occupation;
    const changeOccupations = this.props.actions.changeOccupations.bind(this);
    const occupationDepthClick = this.occupationDepthClick.bind(this);

    let occupationsDepth = occupations;
    switch (selectedDepth) {
      case INDUSTRY_DEPTH:
        occupationsDepth = industries;
        break;
      case DOMAIN_DEPTH:
        occupationsDepth = domains;
        break;
      default:
        occupationsDepth = occupations;
    }

    return (
      <div className="filter prof-control">
        <div className="flat-options-w-title">
          <h3>Prof:</h3>
          <ul className="options flat-options">
            <li><a href="#" className={selectedDepth === DOMAIN_DEPTH ? "active" : ""} data-depth={DOMAIN_DEPTH} onClick={occupationDepthClick}>Domain</a></li>
            <li><a href="#" className={selectedDepth === OCCUPATION_DEPTH ? "active" : ""} data-depth={OCCUPATION_DEPTH} onClick={occupationDepthClick}>Occupation</a></li>
          </ul>
        </div>

        { selectedDepth === OCCUPATION_DEPTH
        ? <div>
            <select value={selectedOccupationSlug} onChange={changeOccupations}>
              <option value="all" data-occupations="all">All Occupations</option>
              {occupationsDepth.map(p =>
                <option key={p.slug} value={p.slug} data-occupations={p.occupations}>
                  {p.name}
                </option>
              )}
            </select>
          </div>
        : <div>
            <select value={selectedOccupationSlug} onChange={changeOccupations}>
              <option value="all" data-occupations="all">All Domains</option>
              {occupationsDepth.map(p =>
                <option key={p.slug} value={p.slug} data-occupations={p.occupations}>
                  {p.name}
                </option>
              )}
            </select>
          </div>
        }
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    explorer: state.explorer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({changeOccupations, changeOccupationDepth}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OccupationControl);
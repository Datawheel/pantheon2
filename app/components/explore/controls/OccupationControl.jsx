import React, {Component} from "react";
import {connect} from "react-redux";
import {changeOccupations, changeOccupationDepth} from "actions/explore";
import {OCCUPATION_DEPTH, INDUSTRY_DEPTH, DOMAIN_DEPTH} from "types";

class OccupationControl extends Component {

  constructor(props) {
    super(props);
  }

  occupationDepthClick(e) {
    e.preventDefault();
    this.props.changeOccupationDepth(e.target.dataset.depth);
  }

  render() {
    const {selectedDepth, selectedOccupationSlug, domains, industries, occupations} = this.props.explore.occupation;
    const changeOccupations = this.props.changeOccupations.bind(this);
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
        <div className="">
          <h3>Working in</h3>
          <ul className="items options flat-options">
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
    explore: state.explore
  };
}

const mapDispatchToProps = dispatch => ({
  changeOccupations: (eventOrOccupationName, occupationId) => {
    const selectedOccupation = eventOrOccupationName.target ? eventOrOccupationName.target.value : eventOrOccupationName;
    const occupationList = occupationId || eventOrOccupationName.target.options[eventOrOccupationName.target.selectedIndex].dataset.occupations;
    dispatch(changeOccupations(selectedOccupation, occupationList, true));
  },
  changeOccupationDepth: depth => {
    dispatch(changeOccupationDepth(depth));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(OccupationControl);

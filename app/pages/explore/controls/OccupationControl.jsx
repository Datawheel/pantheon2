import React, {Component} from "react";
import {connect} from "react-redux";

class OccupationControl extends Component {

  constructor(props) {
    super(props);
  }

  changeOccupation = e => {
    e.preventDefault();
    this.props.changeOccupation("occupation", e.target.value);
  }

  render() {
    const {occupation, nestedOccupations} = this.props;

    return (
      <div className="filter prof-control">
        <div className="">
          <h3>Working in</h3>
        </div>

        <div>
          <select value={occupation} onChange={this.changeOccupation}>
            <option value="all" data-occupations="all">All Occupations</option>
            {nestedOccupations
              ? nestedOccupations.map(domain =>
                <optgroup key={domain.domain.slug} label={domain.domain.name}>
                  <option value={domain.domain.id} data-occupations={domain.domain.occupations}>
                    All {domain.domain.name} occupations
                  </option>
                  {domain.occupations.map(occ =>
                    <option key={occ.occupation_slug} value={occ.id} data-occupations={occ.id}>
                      {occ.occupation}
                    </option>
                  )}
                </optgroup>
              )
              : null}
          </select>
        </div>
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
  // changeOccupations: (eventOrOccupationName, occupationId) => {
  //   const selectedOccupation = eventOrOccupationName.target ? eventOrOccupationName.target.value : eventOrOccupationName;
  //   const occupationList = occupationId || eventOrOccupationName.target.options[eventOrOccupationName.target.selectedIndex].dataset.occupations;
  //   dispatch(changeOccupations(selectedOccupation, occupationList, true));
  // },
  // changeOccupationDepth: depth => {
  //   dispatch(changeOccupationDepth(depth));
  // }
});

export default connect(mapStateToProps, mapDispatchToProps)(OccupationControl);

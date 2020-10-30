import React from "react";
import {connect} from "react-redux";
import {updateOccupation} from "actions/vb";

const OccupationControl = ({occupation, updateOccupation, nestedOccupations}) =>
  <div className="filter prof-control">
    <div className="">
      <h3>Working in</h3>
    </div>

    <div>
      <select value={occupation} onChange={e => updateOccupation(e.target.value)}>
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
  </div>;

const mapDispatchToProps = {updateOccupation};

const mapStateToProps = state => ({
  occupation: state.vb.occupation
});

export default connect(mapStateToProps, mapDispatchToProps)(OccupationControl);

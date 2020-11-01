import React from "react";
import {connect} from "react-redux";
import {updateShowDepth, updateShowType} from "actions/vb";

const rankingTypes = [
  {id: "people", name: "People"},
  {id: "places", name: "Places"},
  {id: "occupations", name: "Occupations"}
];

const ShowControl = ({page, updateShowDepth, show}) => {
  let pageRankingTypes = rankingTypes;

  if (page === "viz") {
    pageRankingTypes = pageRankingTypes.slice(1, pageRankingTypes.length);
  }
  const {type: showType, depth: showDepth} = show;
  console.log("showType", showType);
  console.log("show", show);

  return (
    <div className="filter">
      <h3>Group People by</h3>
      <ul className="items filter options viztype-options">
        {pageRankingTypes.map(rt =>
          <li key={rt.id} value={rt.id}>
            <h4>
              <a
                href="#"
                data-id={rt.id}
                onClick={updateShowType}
                className={`${rt.id} ${!showType || showType === rt.id  ? "active" : null}`}>
                {rt.name}
              </a>
            </h4>
          </li>
        )}
      </ul>
      { showType === "occupations" && page === "rankings"
        ? <div className="options filter">
          <h3>Data Depth</h3>
          <ul className="items options viztype-options">
            <li><h4><a href="#" id="occupations" onClick={updateShowDepth} className={`d-3 ${!showDepth || showDepth === "occupations"  ? "active" : null}`}>Occupation</a></h4></li>
            <li><h4><a href="#" id="industries" onClick={updateShowDepth} className={`d-2 ${showDepth === "industries" ? "active" : null}`}>Industry</a></h4></li>
            <li><h4><a href="#" id="domains" onClick={updateShowDepth} className={`d-1 ${showDepth === "domains" ? "active" : null}`}>Domain</a></h4></li>
          </ul>
        </div>
        : null}
      { showType === "places" && page === "rankings"
        ? <div className="options filter">
          <h3>Data Depth</h3>
          <ul className="items options viztype-options">
            <li><h4><a href="#" id="places" onClick={updateShowDepth} className={`d-2 ${!showDepth || showDepth === "places" ? "active" : null}`}>City</a></h4></li>
            <li><h4><a href="#" id="countries" onClick={updateShowDepth} className={`d-1 ${showDepth === "countries" ? "active" : null}`}>Country</a></h4></li>
          </ul>
        </div>
        : null}
    </div>
  );
};

const mapDispatchToProps = {updateShowDepth, updateShowType};

const mapStateToProps = state => ({
  page: state.vb.page,
  show: state.vb.show
});

export default connect(mapStateToProps, mapDispatchToProps)(ShowControl);

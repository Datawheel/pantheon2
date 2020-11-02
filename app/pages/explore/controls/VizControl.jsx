import React from "react";
import {connect} from "react-redux";
import {updateViz} from "actions/vb";

const getClasName = (viz, currentViz, loading) => {
  if (viz === currentViz) {
    if (loading) {
      return `active disabled ${viz}`;
    }
    return `active ${viz}`;
  }
  else if (loading) {
    return `disabled ${viz}`;
  }
  else {
    return viz;
  }
};

const VizControl = ({loading, viz, updateViz}) => {

  const allVizTypes = [
    {id: "Treemap", name: "Tree Map"},
    {id: "StackedArea", name: "Stacked"},
    {id: "LineChart", name: "Line Chart"},
    {id: "Map", name: "Map"}
  ];

  return (
    <div className="filter">
      <h3>Make a</h3>
      <ul className="items options viztype-options">
        {allVizTypes.map(v =>
          <li key={v.id}>
            <h4>
              <a
                href="#"
                data-viz={v.id.toLowerCase()}
                className={getClasName(v.id.toLowerCase(), viz, loading)}
                onClick={e => loading ? e.preventDefault() : (e.preventDefault(), updateViz(v.id.toLowerCase()))}>
                {v.name}
              </a>
            </h4>
          </li>
        )}
      </ul>
    </div>
  );
};


const mapDispatchToProps = {updateViz};

const mapStateToProps = state => ({
  viz: state.vb.viz,
  loading: state.vb.data.loading
});

export default connect(mapStateToProps, mapDispatchToProps)(VizControl);

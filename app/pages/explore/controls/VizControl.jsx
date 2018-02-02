import React, {Component} from "react";

class VizControl extends Component {

  constructor(props) {
    super(props);
  }

  changeVizClick = e => {
    e.preventDefault();
    this.props.changeViz("viz", e.target.dataset.viz);
  }

  render() {
    // const {type} = this.props.explore.viz;
    const {viz} = this.props;
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
                  className={viz === v.id.toLowerCase() ? `active ${v.id.toLowerCase()}` : v.id.toLowerCase()}
                  onClick={this.changeVizClick}>
                  {v.name}
                </a>
              </h4>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default VizControl;

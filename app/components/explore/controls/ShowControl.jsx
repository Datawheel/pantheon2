import React, {Component} from "react";
import {connect} from "react-redux";
import {changeShowType, changeShowDepth, changeViz} from "actions/explore";

class ShowControl extends Component {

  constructor(props) {
    super(props);
    this.rankingTypes = [
      {id: "people", name: "People"},
      {id: "occupations", name: "Occupations"},
      {id: "places", name: "Places"}
    ];
    this.changeShowType = this.props.changeShowType.bind(this);
    this.changeShowDepth = this.props.changeShowDepth.bind(this);
  }

  render() {
    const {explore, page} = this.props;
    const {type, depth} = explore.show;
    let rankingTypes = this.rankingTypes;
    if (page === "viz") {
      rankingTypes = this.rankingTypes.slice(1, this.rankingTypes.length);
    }
    return (
      <section className="control-group key-group">
        <h3>Show Top Ranked</h3>
        <select value={type || ""} onChange={this.changeShowType}>
          {rankingTypes.map(rt =>
            <option key={rt.id} value={rt.id}>
              {rt.name}
            </option>
          )}
        </select>
        { type === "occupations" && page === "rankings" ?
        <div className="flat-options-w-title">
          <h3>Level:</h3>
          <ul className="options flat-options">
            <li><a href="#" id="occupations" onClick={this.changeShowDepth} className={!depth || depth === "occupations"  ? "active" : null}>Occ</a></li>
            <li><a href="#" id="industries" onClick={this.changeShowDepth} className={depth === "industries" ? "active" : null}>Ind</a></li>
            <li><a href="#" id="domains" onClick={this.changeShowDepth} className={depth === "domains" ? "active" : null}>Dom</a></li>
          </ul>
        </div>
        : null}
        { type === "places" && page === "rankings" ?
        <div className="flat-options-w-title">
          <h3>Level:</h3>
          <ul className="options flat-options">
            <li><a href="#" id="places" onClick={this.changeShowDepth} className={!depth || depth === "places" ? "active" : null}>Cities</a></li>
            <li><a href="#" id="countries" onClick={this.changeShowDepth} className={depth === "countries" ? "active" : null}>Countries</a></li>
          </ul>
        </div>
        : null}
      </section>
    );
  }
}


function mapStateToProps(state) {
  return {
    explore: state.explore
  };
}

const mapDispatchToProps = dispatch => ({
  changeShowType: e => {
    const showType = e.target.value;
    dispatch(changeShowType(showType));
    dispatch(changeViz(null, false));
  },
  changeShowDepth: e => {
    e.preventDefault();
    const showDepth = e.target.id;
    dispatch(changeShowDepth(showDepth));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ShowControl);

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
      <div className="filter">
        <h3>Of People grouped by</h3>
        <ul className="items options flat-options">
          {rankingTypes.map(rt =>
            <li key={rt.id} value={rt.id}>
              <a href="#" data-id={rt.id} onClick={this.changeShowType} className={!type || type === rt.id  ? "active" : null}>{rt.name}</a>
            </li>
          )}
        </ul>
        { type === "occupations" && page === "rankings"
        ? <div className="options subfilter flat-options-w-title">
          <ul className="items options flat-options">
            <li><a href="#" id="occupations" onClick={this.changeShowDepth} className={!depth || depth === "occupations"  ? "active" : null}>Occu</a></li>
            <li><a href="#" id="industries" onClick={this.changeShowDepth} className={depth === "industries" ? "active" : null}>Industry</a></li>
            <li><a href="#" id="domains" onClick={this.changeShowDepth} className={depth === "domains" ? "active" : null}>Domain</a></li>
          </ul>
        </div>
        : null}
        { type === "places" && page === "rankings"
        ? <div className="options subfilter flat-options-w-title">
          <ul className="items options flat-options">
            <li><a href="#" id="places" onClick={this.changeShowDepth} className={!depth || depth === "places" ? "active" : null}>City</a></li>
            <li><a href="#" id="countries" onClick={this.changeShowDepth} className={depth === "countries" ? "active" : null}>Country</a></li>
          </ul>
        </div>
        : null}
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
  changeShowType: e => {
    const showType = e.target.dataset.id;
    e.preventDefault();
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

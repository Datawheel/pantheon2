import React, {Component} from "react";

class ShowControl extends Component {

  constructor(props) {
    super(props);
    this.rankingTypes = [
      {id: "people", name: "People"},
      {id: "places", name: "Places"},
      {id: "occupations", name: "Occupations"}
    ];
    // this.changeShowType = this.props.changeShowType.bind(this);
    // this.changeShowDepth = this.props.changeShowDepth.bind(this);
  }

  changeShowType = e => {
    e.preventDefault();
    const {update, updateManyAndFetchData} = this.props;
    const newShowType = e.target.dataset.id;

    // if we're switching to show people we want to remove x constraints
    if (newShowType === "people") {
      return update("show", newShowType);
    }
    // if we're switching to show occupations we want to remove any occupation constraints
    else if (newShowType === "occupations") {
      return updateManyAndFetchData({occupation: "all", show: newShowType});
    }
    // if we're switching to show people we want to remove any location constraints
    else if (newShowType === "places") {
      return updateManyAndFetchData({city: "all", country: "all", show: newShowType});
    }
  }

  render() {
    const {page, show} = this.props;
    let rankingTypes = this.rankingTypes;
    // const {type, depth} = explore.show;
    const type = "people";
    const depth = "people";

    if (page === "viz") {
      rankingTypes = this.rankingTypes.slice(1, this.rankingTypes.length);
    }

    return (
      <div className="filter">
        <h3>Group People by</h3>
        <ul className="items filter options viztype-options">
          {rankingTypes.map(rt =>
            <li key={rt.id} value={rt.id}>
              <h4>
                <a
                  href="#"
                  data-id={rt.id}
                  onClick={this.changeShowType}
                  className={`${rt.id} ${!show || show === rt.id  ? "active" : null}`}>
                  {rt.name}
                </a>
              </h4>
            </li>
          )}
        </ul>
        { type === "occupations" && page === "rankings"
          ? <div className="options filter">
            <h3>Data Depth</h3>
            <ul className="items options viztype-options">
              <li><h4><a href="#" id="occupations" onClick={this.changeShowDepth} className={`d-3 ${!depth || depth === "occupations"  ? "active" : null}`}>Occupation</a></h4></li>
              <li><h4><a href="#" id="industries" onClick={this.changeShowDepth} className={`d-2 ${depth === "industries" ? "active" : null}`}>Industry</a></h4></li>
              <li><h4><a href="#" id="domains" onClick={this.changeShowDepth} className={`d-1 ${depth === "domains" ? "active" : null}`}>Domain</a></h4></li>
            </ul>
          </div>
          : null}
        { type === "places" && page === "rankings"
          ? <div className="options filter">
            <h3>Data Depth</h3>
            <ul className="items options viztype-options">
              <li><h4><a href="#" id="places" onClick={this.changeShowDepth} className={`d-2 ${!depth || depth === "places" ? "active" : null}`}>City</a></h4></li>
              <li><h4><a href="#" id="countries" onClick={this.changeShowDepth} className={`d-1 ${depth === "countries" ? "active" : null}`}>Country</a></h4></li>
            </ul>
          </div>
          : null}
      </div>
    );
  }

  render2() {
    const {explore, page} = this.props;
    const {type, depth} = explore.show;
    let rankingTypes = this.rankingTypes;
    if (page === "viz") {
      rankingTypes = this.rankingTypes.slice(1, this.rankingTypes.length);
    }
    return (
      <div className="filter">
        <h3>Group People by</h3>
        <ul className="items filter options viztype-options">
          {rankingTypes.map(rt =>
            <li key={rt.id} value={rt.id}>
              <h4><a href="#" data-id={rt.id} onClick={this.changeShowType} className={`${rt.id} ${!type || type === rt.id  ? "active" : null}`}>{rt.name}</a></h4>
            </li>
          )}
        </ul>
        { type === "occupations" && page === "rankings"
          ? <div className="options filter">
            <h3>Data Depth</h3>
            <ul className="items options viztype-options">
              <li><h4><a href="#" id="occupations" onClick={this.changeShowDepth} className={`d-3 ${!depth || depth === "occupations"  ? "active" : null}`}>Occupation</a></h4></li>
              <li><h4><a href="#" id="industries" onClick={this.changeShowDepth} className={`d-2 ${depth === "industries" ? "active" : null}`}>Industry</a></h4></li>
              <li><h4><a href="#" id="domains" onClick={this.changeShowDepth} className={`d-1 ${depth === "domains" ? "active" : null}`}>Domain</a></h4></li>
            </ul>
          </div>
          : null}
        { type === "places" && page === "rankings"
          ? <div className="options filter">
            <h3>Data Depth</h3>
            <ul className="items options viztype-options">
              <li><h4><a href="#" id="places" onClick={this.changeShowDepth} className={`d-2 ${!depth || depth === "places" ? "active" : null}`}>City</a></h4></li>
              <li><h4><a href="#" id="countries" onClick={this.changeShowDepth} className={`d-1 ${depth === "countries" ? "active" : null}`}>Country</a></h4></li>
            </ul>
          </div>
          : null}
      </div>
    );
  }
}

export default ShowControl;

import React, {Component} from "react";
import {Helmet} from "react-helmet-async";

class Explore extends Component {

  constructor(props) {
    super(props);
  }

  sanitizeQueryType(typeStr) {
    if (!typeStr || !typeStr.includes("|")) return ["person", "person"];
    let [type, typeNesting] = typeStr.split("|");
    type = ["person", "occupation", "place", "era"].includes(type) ? type : "person";
    typeNesting = ["person", "occupation", "industry", "domain", "place", "country"].includes(typeNesting) ? typeNesting : "person";
    return [type, typeNesting];
  }

  sanitizeQueryCountry(countryStr) {
    if (!countryStr || !countryStr.includes("|")) return null;
    return countryStr.split("|");
  }

  sanitizeQueryCity(cityStr) {
    if (!cityStr) return null;
    return cityStr;
  }

  sanitizeQueryOccupation(occupationStr) {
    if (!occupationStr || !occupationStr.includes("|")) return null;
    return occupationStr.split("|");
  }

  componentDidUpdate(prevProps) {
    console.log("\n\n---------explore comp did update!!!\n---------------\n\n\n");
  }

  render() {
    const {children} = this.props;
    return (
      <div className="explore-container">
        <Helmet title="Explore Pantheon" />
        {children ? !<h1 className="header">Explore</h1> : null }
        <div>{children}</div>
      </div>
    );
  }
}

export default Explore;

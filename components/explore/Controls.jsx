"use client";
import { useSelector } from "react-redux";
import VizControl from "./VizControl";
import ShowControl from "./ShowControl";
import GenderControl from "./GenderControl";
import YearControl from "./YearControl";
import PlaceControl from "./PlaceControl";
import OccupationControl from "./OccupationControl";

const toggleSidePanel = () => {
  console.log("toggle side panel!");
};

export default function Controls({ places, nestedOccupations }) {
  const {
    city,
    country,
    gender,
    occupation,
    page,
    placeType,
    show,
    viz,
    yearType,
  } = useSelector((state) => state.explore);

  return (
    <div className="explore-controls viz-explorer" id="side-panel">
      {/* desktop title*/}
      <div className="control-header desktop">
        <h2 className="viz-explorer">Visualizations</h2>
      </div>
      {/* mobile toggle */}
      <button className="control-header mobile" onClick={toggleSidePanel}>
        <h2 className="viz-explorer">
          <span className="helper-text">Open </span>
          {page === "rankings" ? "Rankings" : "Visualizations"}
          <span className="helper-text"> Panel</span>
        </h2>
        <i className="control-icon" />
      </button>

      <section className="control-group main-selector">
        {page === "viz" ? <VizControl /> : null}
        <ShowControl />
      </section>

      <section className="control-group">
        <GenderControl />
        {/* <YearControl years={years} changeYears={this.updateAndFetchData} yearType={yearType} /> */}
        <YearControl />
        {show.type !== "places" ? <PlaceControl places={places} /> : null}
        <OccupationControl nestedOccupations={nestedOccupations} />
      </section>
    </div>
  );
}

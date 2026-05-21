"use client";
import {useState} from "react";
import {useSelector} from "react-redux";
import VizControl from "./VizControl";
import StackedControl from "./StackedControl";
import ShowControl from "./ShowControl";
import GenderControl from "./GenderControl";
import YearControl from "./YearControl";
import BirthdayControl from "./BirthdayControl";
import PlaceControl from "./PlaceControl";
import OccupationControl from "./OccupationControl";
import MetricCutoffControl from "./MetricCutoffControl";
import OnlyShowNewControl from "./OnlyShowNewControl";

export default function Controls({places, nestedOccupations}) {
  const {page, show, viz} = useSelector(state => state.explore);
  const isTimeSeries = viz === "stackedarea" || viz === "linechart";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidePanel = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div
      className={`explore-controls viz-explorer ${
        isMobileMenuOpen ? "mobile-show" : ""
      }`}
      id="side-panel"
    >
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

      {page === "viz" && isTimeSeries ? (
        <section className="control-group stacked-options">
          <StackedControl />
        </section>
      ) : null}

      <section className="control-group">
        <GenderControl />
        {/* <YearControl years={years} changeYears={this.updateAndFetchData} yearType={yearType} /> */}
        <YearControl />
        <BirthdayControl />
        {show.type !== "places" ? <PlaceControl places={places} /> : null}
        <OccupationControl nestedOccupations={nestedOccupations} />
      </section>

      <section className="control-group advanced-group">
        <h3>Advanced Options</h3>
        <MetricCutoffControl />
        <OnlyShowNewControl />
      </section>
    </div>
  );
}

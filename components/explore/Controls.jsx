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
import {getExploreTranslations} from "@/app/exploreTranslations";

export default function Controls({places, nestedOccupations, locale, pageType}) {
  const t = getExploreTranslations(locale);
  const {show, viz} = useSelector(state => state.explore);
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
        <h2 className="viz-explorer">
          {pageType === "rankings" ? t("rankings") : t("visualizations")}
        </h2>
      </div>
      {/* mobile toggle */}
      <button className="control-header mobile" onClick={toggleSidePanel}>
        <h2 className="viz-explorer">
          <span className="helper-text">{t("open")} </span>
          {pageType === "rankings" ? t("rankings") : t("visualizations")}
          <span className="helper-text"> {t("panel")}</span>
        </h2>
        <i className="control-icon" />
      </button>

      <section className="control-group main-selector">
        {pageType === "viz" ? <VizControl locale={locale} /> : null}
        <ShowControl locale={locale} pageType={pageType} />
      </section>

      {pageType === "viz" && isTimeSeries ? (
        <section className="control-group stacked-options">
          <StackedControl locale={locale} />
        </section>
      ) : null}

      <section className="control-group">
        <GenderControl locale={locale} />
        {/* <YearControl years={years} changeYears={this.updateAndFetchData} yearType={yearType} /> */}
        <YearControl locale={locale} />
        <BirthdayControl locale={locale} />
        {show.type !== "places" ? <PlaceControl places={places} locale={locale} /> : null}
        <OccupationControl nestedOccupations={nestedOccupations} locale={locale} />
      </section>

      <section className="control-group advanced-group">
        <h3>{t("advancedOptions")}</h3>
        <MetricCutoffControl />
        <OnlyShowNewControl locale={locale} />
      </section>
    </div>
  );
}

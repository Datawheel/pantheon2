"use client";

import {COLORS_DOMAIN, FORMATTERS} from "../utils/consts";
import SectionLayout from "../common/SectionLayout";
import "./MemMetrics.css";
import {useEffect, useState} from "react";
import {BASE_API} from "@/app/constants";
import MemMetricsBullet from "./MemMetricsBullet";

export default function MemMetrics({person, personRanks, slug, title}) {
  const [loading, setLoading] = useState(true);
  const [occupationData, setOccupationData] = useState(null);
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Calculate date one year ago
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        // Make API calls concurrently
        const [occupationResponse, totalViewsResponse] = await Promise.all([
          fetch(
            `${BASE_API}/pageviews_occupation?occupation=eq.${person.occupation?.id}`
          ),
          fetch(`${BASE_API}/pageviews_rolling_12mo?wp_id=eq.${person.id}`),
        ]);

        const [occupationData, totalViewsData] = await Promise.all([
          occupationResponse.json(),
          totalViewsResponse.json(),
        ]);

        setOccupationData(occupationData[0] || null);
        setTotalViews(totalViewsData[0]?.total_views || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [person.id, person.occupation?.id]);

  if (loading) {
    return (
      <SectionLayout slug={slug} title={title}>
        <div>Loading...</div>
      </SectionLayout>
    );
  }

  return (
    <SectionLayout slug={slug} title={title}>
      <div className="metrics-container">
        <div className="metric-vid">
          {person?.youtube ? (
            <iframe
              src={`https://www.youtube.com/embed/${person?.youtube}`}
              max-width="560"
              width="100%"
              height="100%"
              allowFullScreen
            />
          ) : (
            <button
              className="press-play"
              aria-label="Press to play video"
              disabled
              tabIndex="-1"
            >
              <i />
            </button>
          )}
        </div>
        <div className="stats-list">
          {totalViews > 0 && occupationData ? (
            <div className="stat-container">
              <div className="stat-title">
                <h4>{FORMATTERS.bigNum(totalViews || 0)}</h4>
                <p className="stat-title-text">Page Views</p>
                <p className="stat-title-desc">Past 12 months</p>
              </div>
              <div className="stat-bullet">
                <MemMetricsBullet
                  value={totalViews}
                  compareValue={occupationData.pageviews_avg}
                  compareValueTitle={person.occupation?.id}
                />
              </div>
            </div>
          ) : null}
          {totalViews > 0 && occupationData ? (
            <div className="stat-container">
              <div className="stat-title">
                <h4>{FORMATTERS.decimal(personRanks.hpi)}</h4>
                <p className="stat-title-text">HPI</p>
                <p className="stat-title-desc">Historical Popularity Index</p>
              </div>
              <div className="stat-bullet">
                <MemMetricsBullet
                  value={personRanks.hpi}
                  compareValue={person.occupation?.hpi_avg || 0}
                  compareValueTitle={person.occupation?.id}
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* <ul className="metrics-list">
          <li className="metric">
            <h4>{FORMATTERS.bigNum(totalViews || 0)}</h4>
            <p>Page Views (PV) - past year</p>
          </li>
          <li className="metric">
            <h4>{FORMATTERS.bigNum(occupationData || 0)}</h4>
            <p>OccupationPage Views (PV) - past year</p>
          </li>
          <li className="metric">
            <h4>{FORMATTERS.decimal(person.hpi)}</h4>
            <p>Historical Popularity Index (HPI)</p>
          </li>
          <li className="metric">
            <h4>{person.l}</h4>
            <p>Languages Editions (L)</p>
          </li>
          <li className="metric">
            <h4>{FORMATTERS.decimal(person.l_)}</h4>
            <p>Effective Languages (L*)</p>
          </li>
          <li className="metric">
            <h4>{FORMATTERS.decimal(person.coefficient_of_variation)}</h4>
            <p>Coefficient of Variation (CV)</p>
          </li>
        </ul> */}
      </div>
    </SectionLayout>
  );
}

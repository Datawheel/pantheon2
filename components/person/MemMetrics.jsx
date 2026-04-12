"use client";

import {FORMATTERS} from "../utils/consts";
import SectionLayout from "../common/SectionLayout";
import "./MemMetrics.css";
import {useCallback, useState} from "react";
import MemMetricsBullet from "./MemMetricsBullet";

function YouTubeFacade({videoId}) {
  const [play, setPlay] = useState(false);
  const handlePlay = useCallback(() => setPlay(true), []);

  if (play) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        width="100%"
        height="100%"
        allowFullScreen
        allow="autoplay"
      />
    );
  }

  return (
    <button className="yt-facade" onClick={handlePlay} aria-label="Play video">
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt="Video thumbnail"
        loading="lazy"
      />
      <span className="yt-play-btn" />
    </button>
  );
}

export default function MemMetrics({person, personRanks, occupationData, totalViews = 0, slug, title}) {
  return (
    <SectionLayout slug={slug} title={title}>
      <div className="metrics-container">
        <div className="metric-vid">
          {person?.youtube ? (
            <YouTubeFacade videoId={person.youtube} />
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
      </div>
    </SectionLayout>
  );
}

import {micromark} from "micromark";
import "./TrendingBanner.css";

export default function TrendingBanner({trendScore, reason, clicks, impressions}) {
  const reasonHtml = reason ? micromark(reason) : "";

  return (
    <div className="trending-banner">
      <div className="trending-banner-container">
        <div className="trending-banner-header">
          <span className="trending-banner-icon">🔥</span>
          <h2 className="trending-banner-title">Trending This Week</h2>
          {trendScore && (
            <span className="trending-banner-score">
              Trend Score: {Math.round(trendScore)}
            </span>
          )}
        </div>

        {reason && (
          <div className="trending-banner-reason">
            <h3 className="trending-reason-heading">Why is this trending?</h3>
            <div
              className="trending-reason-content"
              dangerouslySetInnerHTML={{__html: reasonHtml}}
            />
          </div>
        )}

        <div className="trending-banner-stats">
          {clicks && (
            <div className="trending-stat">
              <span className="trending-stat-value">{clicks.toLocaleString()}</span>
              <span className="trending-stat-label">Clicks this week</span>
            </div>
          )}
          {impressions && (
            <div className="trending-stat">
              <span className="trending-stat-value">{impressions.toLocaleString()}</span>
              <span className="trending-stat-label">Impressions this week</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

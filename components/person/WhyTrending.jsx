import {micromark} from "micromark";
import Link from "next/link";
import {getTranslations} from "/app/translations";
import "./WhyTrending.css";

export default function WhyTrending({
  person,
  trendingData,
  currentLang = "en",
}) {
  const t = getTranslations(currentLang);
  const reason = trendingData?.trendingReason;
  const citations = trendingData?.llmMetadata?.citations || [];

  // Convert markdown to HTML using micromark
  let reasonHtml = "";
  if (reason) {
    reasonHtml = micromark(reason);
    // Format citations as superscripts
    const regex = /(\[\d+\])+/g;
    reasonHtml = reasonHtml.replace(regex, match => {
      const numbers = match.match(/\d+/g);
      return `<sup>${numbers.join(",")}</sup>`;
    });
  }

  // Get today's date for the news link
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}`;

  return (
    <div className="why-trending-container">
      <h2>{t.trending.isTrendingToday.replace("{name}", person.name)}</h2>
      {reason ? (
        <div className="reason-container">
          <h3>{t.trending.whyTrending.replace("{name}", person.name)}</h3>
          <p dangerouslySetInnerHTML={{__html: reasonHtml}} />
          {citations.length > 0 && (
            <div className="citations-container">
              <h4>{t.trending.references}</h4>
              <ol>
                {citations.map((citation, index) => (
                  <li key={index}>
                    <a
                      href={citation}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {citation}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      ) : (
        <div className="no-reason-container">
          <p>
            {person.name} is trending today across multiple Wikipedia language
            editions. Check back later for a detailed summary.
          </p>
        </div>
      )}
      <Link
        href={`/${currentLang}/news?date=${today}`}
        className="view-news-button"
      >
        {t.trending.viewMoreTrending} →
      </Link>
    </div>
  );
}

"use client";

import {useState} from "react";
import Spinner from "/components/Spinner";
import {micromark} from "micromark";
import "./WhyTrending.css";

export default function WhyTrending({person, isTrending, slug, title}) {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState(null);
  const [reasonHtml, setReasonHtml] = useState(null);
  const [error, setError] = useState(null);

  const handleWhyTrending = async () => {
    setLoading(true);
    setReason(null);
    setError(null);

    try {
      const response = await fetch(`/api/whyTrending?slug=${person.slug}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("WhyTrending API error:", errorData);
        throw new Error("Unable to load the trending reason right now.");
      }

      const data = await response.json();

      if (data.isTrending) {
        // setReason(data.reason);
        setReason(data.reason);
        let htmlReason = micromark(data.reason.choices[0].message.content);
        // Define the regex pattern
        const regex = /(\[\d+\])+/g;

        // Perform the replacement
        htmlReason = htmlReason.replace(regex, match => {
          const numbers = match.match(/\d+/g);
          const formattedNumbers = numbers.join(",");
          return `<sup>${formattedNumbers}</sup>`;
        });
        setReasonHtml(htmlReason);
      } else {
        setError(data.message || "The person is not trending.");
      }
    } catch (err) {
      console.error("WhyTrending error:", err);
      setError(
        "Unable to load trending data right now. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="why-trending-container">
      <h2>{person.name} is trending today!</h2>
      {isTrending && !reason && (
        <button
          onClick={handleWhyTrending}
          disabled={loading}
          className="why-trending-button"
        >
          Find out why {person.name} is trending
          <img
            src="https://static.pantheon.world/icons/icon-spark-pen.png"
            alt="Spark pen icon"
            style={{
              width: "20px",
              height: "20px",
              marginLeft: "8px",
              verticalAlign: "middle",
            }}
          />
        </button>
      )}

      {loading && (
        <div className="loader-container">
          <Spinner />
        </div>
      )}

      {reason && (
        <div className="reason-container">
          <h3>Reason for Trending:</h3>
          <p dangerouslySetInnerHTML={{__html: reasonHtml}} />
          {reason.citations && reason.citations.length > 0 && (
            <div className="citations-container">
              <h4>References:</h4>
              <ol>
                {reason.citations.map((citation, index) => (
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
      )}

      {error && (
        <div className="error-container">
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
}

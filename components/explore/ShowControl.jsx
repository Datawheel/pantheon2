"use client";
import { useSelector } from "react-redux";

const rankingTypes = [
  { id: "people", name: "People" },
  { id: "places", name: "Places" },
  { id: "occupations", name: "Occupations" },
];

export default function ShowControl() {
  const loading = false;
  const { page, show } = useSelector((state) => state.explore);
  let pageRankingTypes = rankingTypes;

  if (page === "viz") {
    pageRankingTypes = pageRankingTypes.slice(1, pageRankingTypes.length);
  }

  const { type: showType, depth: showDepth } = show;

  return (
    <div className="filter">
      <h3>Group People by</h3>
      <ul className="items filter options viztype-options">
        {pageRankingTypes.map((rt) => (
          <li key={rt.id} value={rt.id}>
            <h4>
              <a
                href="#"
                data-id={rt.id}
                onClick={(e) =>
                  loading
                    ? e.preventDefault()
                    : (e.preventDefault(),
                      updateShowType(rt.id.toLowerCase(), page))
                }
                className={`${rt.id} ${loading ? "disabled" : null} ${
                  !showType || showType === rt.id ? "active" : ""
                }`}
              >
                {rt.name}
              </a>
            </h4>
          </li>
        ))}
      </ul>
      {showType === "occupations" && page === "rankings" ? (
        <div className="options filter">
          <h3>Data Depth</h3>
          <ul className="items options viztype-options">
            <li>
              <h4>
                <a
                  href="#"
                  id="occupations"
                  onClick={(e) =>
                    loading
                      ? e.preventDefault()
                      : (e.preventDefault(),
                        updateShowDepth("occupations", page))
                  }
                  className={`d-3 ${
                    !showDepth || showDepth === "occupations" ? "active" : ""
                  }`}
                >
                  Occupation
                </a>
              </h4>
            </li>
            <li>
              <h4>
                <a
                  href="#"
                  id="industries"
                  onClick={(e) =>
                    loading
                      ? e.preventDefault()
                      : (e.preventDefault(),
                        updateShowDepth("industries", page))
                  }
                  className={`d-2 ${
                    showDepth === "industries" ? "active" : ""
                  }`}
                >
                  Industry
                </a>
              </h4>
            </li>
            <li>
              <h4>
                <a
                  href="#"
                  id="domains"
                  onClick={(e) =>
                    loading
                      ? e.preventDefault()
                      : (e.preventDefault(), updateShowDepth("domains", page))
                  }
                  className={`d-1 ${showDepth === "domains" ? "active" : ""}`}
                >
                  Domain
                </a>
              </h4>
            </li>
          </ul>
        </div>
      ) : null}
      {showType === "places" && page === "rankings" ? (
        <div className="options filter">
          <h3>Data Depth</h3>
          <ul className="items options viztype-options">
            <li>
              <h4>
                <a
                  href="#"
                  id="places"
                  onClick={(e) =>
                    loading
                      ? e.preventDefault()
                      : (e.preventDefault(), updateShowDepth("places", page))
                  }
                  className={`d-2 ${
                    !showDepth || showDepth === "places" ? "active" : ""
                  }`}
                >
                  City
                </a>
              </h4>
            </li>
            <li>
              <h4>
                <a
                  href="#"
                  id="countries"
                  onClick={(e) =>
                    loading
                      ? e.preventDefault()
                      : (e.preventDefault(), updateShowDepth("countries", page))
                  }
                  className={`d-1 ${showDepth === "countries" ? "active" : ""}`}
                >
                  Country
                </a>
              </h4>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}

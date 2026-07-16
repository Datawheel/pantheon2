"use client";
import {useDispatch, useSelector} from "react-redux";
import {updateShowDepth, updateShowType} from "../../features/exploreSlice";
import {getExploreTranslations} from "@/app/exploreTranslations";

const rankingTypes = [
  {id: "people", key: "people"},
  {id: "places", key: "places"},
  {id: "occupations", key: "occupations"},
];

export default function ShowControl({locale, pageType}) {
  const t = getExploreTranslations(locale);
  const loading = false;
  const dispatch = useDispatch();
  const {show} = useSelector(state => state.explore);
  const page = pageType;
  let pageRankingTypes = rankingTypes;

  if (page === "viz") {
    pageRankingTypes = pageRankingTypes.slice(1, pageRankingTypes.length);
  }

  const {type: showType, depth: showDepth} = show;

  return (
    <div className="filter">
      <h3>{t("groupPeopleBy")}</h3>
      <ul className="items filter options viztype-options">
        {pageRankingTypes.map(rt => (
          <li key={rt.id} value={rt.id}>
            <h4>
              <a
                href="#"
                data-id={rt.id}
                onClick={e =>
                  loading
                    ? e.preventDefault()
                    : (e.preventDefault(),
                      dispatch(
                        updateShowType({showType: rt.id.toLowerCase(), page})
                      ))
                }
                className={`${rt.id} ${loading ? "disabled" : null} ${
                  !showType || showType === rt.id ? "active" : ""
                }`}
              >
                {t(rt.key)}
              </a>
            </h4>
          </li>
        ))}
      </ul>
      {showType === "occupations" && page === "rankings" ? (
        <div className="options filter">
          <h3>{t("dataDepth")}</h3>
          <ul className="items options viztype-options">
            <li>
              <h4>
                <a
                  href="#"
                  id="occupations"
                  onClick={e =>
                    loading
                      ? e.preventDefault()
                      : (e.preventDefault(),
                        dispatch(
                          updateShowDepth({
                            showType,
                            showDepth: "occupations",
                            page,
                          })
                        ))
                  }
                  className={`d-3 ${
                    !showDepth || showDepth === "occupations" ? "active" : ""
                  }`}
                >
                  {t("occupation")}
                </a>
              </h4>
            </li>
            <li>
              <h4>
                <a
                  href="#"
                  id="industries"
                  onClick={e =>
                    loading
                      ? e.preventDefault()
                      : (e.preventDefault(),
                        dispatch(
                          updateShowDepth({
                            showType,
                            showDepth: "industries",
                            page,
                          })
                        ))
                  }
                  className={`d-2 ${
                    showDepth === "industries" ? "active" : ""
                  }`}
                >
                  {t("industry")}
                </a>
              </h4>
            </li>
            <li>
              <h4>
                <a
                  href="#"
                  id="domains"
                  onClick={e =>
                    loading
                      ? e.preventDefault()
                      : (e.preventDefault(),
                        dispatch(
                          updateShowDepth({
                            showType,
                            showDepth: "domains",
                            page,
                          })
                        ))
                  }
                  className={`d-1 ${showDepth === "domains" ? "active" : ""}`}
                >
                  {t("domain")}
                </a>
              </h4>
            </li>
          </ul>
        </div>
      ) : null}
      {showType === "places" && page === "rankings" ? (
        <div className="options filter">
          <h3>{t("dataDepth")}</h3>
          <ul className="items options viztype-options">
            <li>
              <h4>
                <a
                  href="#"
                  id="places"
                  onClick={e =>
                    loading
                      ? e.preventDefault()
                      : (e.preventDefault(),
                        dispatch(
                          updateShowDepth({
                            showType,
                            showDepth: "places",
                            page,
                          })
                        ))
                  }
                  className={`d-2 ${
                    !showDepth || showDepth === "places" ? "active" : ""
                  }`}
                >
                  {t("city")}
                </a>
              </h4>
            </li>
            <li>
              <h4>
                <a
                  href="#"
                  id="countries"
                  onClick={e =>
                    loading
                      ? e.preventDefault()
                      : (e.preventDefault(),
                        dispatch(
                          updateShowDepth({
                            showType,
                            showDepth: "countries",
                            page,
                          })
                        ))
                  }
                  className={`d-1 ${showDepth === "countries" ? "active" : ""}`}
                >
                  {t("country")}
                </a>
              </h4>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/* eslint react/display-name: 0 */
import React from "react";
import {Info} from "lucide-react";
import SimpleTooltip from "../../common/SimpleTooltip";
import AnchorList from "../../utils/AnchorList";
import PersonImage from "../../utils/PersonImage";
import {FORMATTERS} from "../../utils/consts";

const genderOrder = ["M", null, "F", "Non-binary"];

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const formatBirthday = (birthyear, birthmonth, birthday) => {
  if (!birthyear) return "Unknown";
  if (!birthmonth || !birthday) return FORMATTERS.year(birthyear);
  const monthName = MONTH_NAMES[birthmonth - 1] || "";
  return `${monthName} ${birthday}, ${FORMATTERS.year(birthyear)}`;
};

const getColumns = (show, nesting, countOffset, options = {}) => {
  const {hasBirthdayFilter = false} = options;
  const COLUMNS = {
    people: {
      people: [
        {
          header: "Info",
          columns: [
            {
              enableSorting: false,
              header: "#",
              id: "row",
              accessorFn: options.nameSearch
                ? (d) => d.rank
                : (_d, i) => i + 1 + countOffset,
              maxSize: 45,
            },
            {
              enableSorting: false,
              header: "",
              accessorKey: "id",
              cell: info => (
                <PersonImage
                  className="ranking-thumbnail"
                  src={`/profile/people/${info.getValue()}.jpg`}
                  fallbackSrc="https://static.pantheon.world/icons/icon-person.svg"
                />
              ),
              maxSize: 70,
            },
            {
              header: "Name",
              accessorKey: "name",
              style: {whiteSpace: "unset"},
              cell: info => (
                <a href={`/profile/person/${info.row.original.slug}`}>{info.getValue()}</a>
              ),
            },
            {
              id: "occupation_id",
              header: "Occupation",
              accessorFn: d => (d.occupation ? d.occupation.occupation : null),
              cell: info => {
                const value = info.getValue();
                const original = info.row.original;
                return value ? (
                  <a href={`/profile/occupation/${original.occupation.occupation_slug}`}>
                    {value}
                  </a>
                ) : (
                  <span>-</span>
                );
              },
            },
            {
              header: "Birth",
              accessorKey: "birthyear",
              cell: info => {
                const value = info.getValue();
                const original = info.row.original;
                return hasBirthdayFilter ? (
                  <span>{formatBirthday(value, original.birthmonth, original.birthday)}</span>
                ) : value ? (
                  <span>{FORMATTERS.year(value)}</span>
                ) : (
                  <span>{"Unknown"}</span>
                );
              },
              minSize: hasBirthdayFilter ? 90 : 50,
            },
            {
              header: "Death",
              accessorKey: "deathyear",
              cell: info => {
                const value = info.getValue();
                return value ? (
                  <span>{FORMATTERS.year(value)}</span>
                ) : (
                  <span>{"-"}</span>
                );
              },
              minSize: 45,
            },
            {
              header: "Gender",
              accessorKey: "gender",
              cell: info => {
                const value = info.getValue();
                return (
                  <span>
                    {value === "M"
                      ? "Male"
                      : value === "F"
                      ? "Female"
                      : "Non-binary"}
                  </span>
                );
              },
              minSize: 65,
              sortingFn: (rowA, rowB, columnId) => {
                const a = rowA.getValue(columnId);
                const b = rowB.getValue(columnId);
                const aIndex = genderOrder.indexOf(a);
                const bIndex = genderOrder.indexOf(b);
                return bIndex < aIndex ? -1 : bIndex > aIndex ? 1 : 0;
              },
            },
          ],
        },
        {
          header: "Birthplace",
          columns: [
            {
              id: "bplace_geonameid",
              header: "City",
              style: {whiteSpace: "unset"},
              accessorFn: d =>
                d.bplace_geonameid ? d.bplace_geonameid.place : null,
              cell: info => {
                const value = info.getValue();
                const original = info.row.original;
                return value ? (
                  <a href={`/profile/place/${original.bplace_geonameid.slug}`}>
                    {value}
                  </a>
                ) : (
                  <span>-</span>
                );
              },
            },
            {
              id: "bplace_country",
              header: "Country",
              style: {whiteSpace: "unset"},
              accessorFn: d =>
                d.bplace_country ? d.bplace_country.country : null,
              cell: info => {
                const value = info.getValue();
                const original = info.row.original;
                return value ? (
                  <a href={`/profile/country/${original.bplace_country.slug}`}>
                    {value}
                  </a>
                ) : (
                  <span>-</span>
                );
              },
            },
          ],
        },
        {
          header: "Deathplace",
          columns: [
            {
              id: "dplace_geonameid",
              header: "City",
              style: {whiteSpace: "unset"},
              accessorFn: d =>
                d.dplace_geonameid ? d.dplace_geonameid.place : null,
              cell: info => {
                const value = info.getValue();
                const original = info.row.original;
                return value ? (
                  <a href={`/profile/place/${original.dplace_geonameid.slug}`}>
                    {value}
                  </a>
                ) : (
                  <span>-</span>
                );
              },
            },
            {
              id: "dplace_country",
              header: "Country",
              style: {whiteSpace: "unset"},
              accessorFn: d =>
                d.dplace_country ? d.dplace_country.country : null,
              cell: info => {
                const value = info.getValue();
                const original = info.row.original;
                return value ? (
                  <a href={`/profile/country/${original.dplace_country.slug}`}>
                    {value}
                  </a>
                ) : (
                  <span>-</span>
                );
              },
            },
          ],
        },
        {
          header: "Stats",
          columns: [
            {
              header: () => (
                <SimpleTooltip
                  className="table-tooltip-trigger"
                  content={"Wikipedia language editions"}
                >
                  <div>
                    L <Info size={10} />
                  </div>
                </SimpleTooltip>
              ),
              accessorKey: "l",
              minSize: 105,
              className: "cell_numeric",
              headerClassName: "nowrap",
              sortDescFirst: true,
            },
            {
              header: () => (
                <SimpleTooltip
                  className="table-tooltip-trigger"
                  content={"Effective Wikipedia language editions"}
                >
                  <div>
                    L* <Info size={10} />
                  </div>
                </SimpleTooltip>
              ),
              accessorKey: "l_",
              cell: info => FORMATTERS.decimal(info.getValue()),
              minSize: 105,
              className: "cell_numeric",
              headerClassName: "nowrap",
              sortDescFirst: true,
            },
            {
              header: () => (
                <SimpleTooltip
                  className="table-tooltip-trigger"
                  content={
                    "Non-english Wikipedia pageviews in the past 6 months"
                  }
                >
                  <div>
                    PVne <Info size={10} />
                  </div>
                </SimpleTooltip>
              ),
              accessorKey: "non_en_page_views",
              cell: info => FORMATTERS.bigNum(info.getValue()),
              size: 105,
              headerClassName: "nowrap",
              sortDescFirst: true,
            },
            {
              header: () => (
                <SimpleTooltip
                  className="table-tooltip-trigger"
                  content={
                    "Coefficient of variation in Wikipedia Pageviews: to discount characters that have short periods of popularity"
                  }
                >
                  <div>
                    CV <Info size={10} />
                  </div>
                </SimpleTooltip>
              ),
              accessorKey: "coefficient_of_variation",
              cell: info => FORMATTERS.decimal(info.getValue()),
              minSize: 105,
              className: "cell_numeric",
              headerClassName: "nowrap",
              sortDescFirst: true,
            },
            {
              header: () => (
                <SimpleTooltip
                  className="table-tooltip-trigger"
                  content={"Historical Popularity Index"}
                >
                  <div>
                    HPI 2025 <Info size={10} />
                  </div>
                </SimpleTooltip>
              ),
              accessorKey: "hpi",
              cell: info => FORMATTERS.decimal(info.getValue()),
              minSize: 105,
              className: "cell_numeric",
              sortDescFirst: true,
            },
            {
              header: () => (
                <SimpleTooltip
                  className="table-tooltip-trigger"
                  content={"Historical Popularity Index"}
                >
                  <div>
                    HPI 2024 <Info size={10} />
                  </div>
                </SimpleTooltip>
              ),
              accessorKey: "hpi_prev",
              cell: info => {
                const value = info.getValue();
                return value ? FORMATTERS.decimal(value) : "-";
              },
              minSize: 105,
              className: "cell_numeric",
              sortDescFirst: true,
            },
            {
              header: "Rank 2025",
              accessorKey: "rank",
              minSize: 45,
              className: "cell_numeric",
            },
            {
              header: "Rank 2024",
              accessorKey: "rank_prev",
              minSize: 45,
              className: "cell_numeric",
            },
            {
              header: "∆",
              accessorKey: "rank_delta",
              minSize: 45,
              className: "cell_numeric",
              cell: info => {
                const value = info.getValue();
                return value ? (
                  value > 0 ? (
                    <span className="u-positive-text u-positive-arrow">{`+${value}`}</span>
                  ) : (
                    <span className="u-negative-text u-negative-arrow">
                      {value}
                    </span>
                  )
                ) : (
                  "-"
                );
              },
            },
          ],
        },
      ],
    },
    occupations: {
      occupations: [
        {
          enableSorting: false,
          header: "#",
          id: "row",
          accessorFn: (_d, i) => i + 1 + countOffset,
          maxSize: 45,
        },
        {
          header: "Occupation",
          accessorKey: "name",
          style: {whiteSpace: "unset"},
          cell: info => (
            <a href={`/profile/occupation/${info.row.original.slug}`}>{info.getValue()}</a>
          ),
        },
        {
          header: "Industry",
          accessorKey: "industry",
        },
        {
          header: "Domain",
          accessorKey: "domain",
        },
        {
          header: "People",
          accessorKey: "count",
          minSize: 60,
          className: "cell_numeric",
        },
        {
          header: () => (
            <SimpleTooltip
              className="table-tooltip-trigger"
              content={"Historical Popularity Index"}
            >
              <div>
                HPI 2022 <Info size={10} />
              </div>
            </SimpleTooltip>
          ),
          accessorKey: "hpi",
          cell: info => FORMATTERS.bigNum(info.getValue()),
          minSize: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          header: () => (
            <SimpleTooltip
              className="table-tooltip-trigger"
              content={"Average Historical Popularity Index"}
            >
              <div>
                Avg HPI <Info size={10} />
              </div>
            </SimpleTooltip>
          ),
          accessorKey: "avg_hpi",
          cell: info => FORMATTERS.decimal(info.getValue()),
          minSize: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          header: () => (
            <SimpleTooltip
              className="table-tooltip-trigger"
              content={"Count of Wikipedia Language Editions"}
            >
              <div>
                L <Info size={10} />
              </div>
            </SimpleTooltip>
          ),
          accessorKey: "langs",
          cell: info => FORMATTERS.commas(info.getValue()),
          minSize: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          header: () => (
            <SimpleTooltip
              className="table-tooltip-trigger"
              content={"Average Count of Wikipedia Language Editions"}
            >
              <div>
                Avg L <Info size={10} />
              </div>
            </SimpleTooltip>
          ),
          accessorKey: "avg_langs",
          cell: info => FORMATTERS.decimal(info.getValue()),
          minSize: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          header: "Top 3",
          accessorKey: "top_ranked",
          cell: info => (
            <AnchorList
              items={info.getValue()}
              name={d => d.name}
              url={d => `/profile/person/${d.slug}/`}
              noAnd
            />
          ),
        },
      ],
      industries: [
        {
          enableSorting: false,
          header: "#",
          id: "row",
          accessorFn: (_d, i) => i + 1 + countOffset,
          maxSize: 45,
        },
        {
          header: "Industry",
          accessorKey: "industry",
        },
        {
          header: "Domain",
          accessorKey: "domain",
        },
        {
          header: "People",
          accessorKey: "count",
          minSize: 60,
          className: "cell_numeric",
        },
        {
          header: () => (
            <SimpleTooltip
              className="table-tooltip-trigger"
              content={"Historical Popularity Index"}
            >
              <div>
                HPI 2022 <Info size={10} />
              </div>
            </SimpleTooltip>
          ),
          accessorKey: "hpi",
          cell: info => FORMATTERS.bigNum(info.getValue()),
          minSize: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          header: () => (
            <SimpleTooltip
              className="table-tooltip-trigger"
              content={"Average Historical Popularity Index"}
            >
              <div>
                Avg HPI <Info size={10} />
              </div>
            </SimpleTooltip>
          ),
          accessorKey: "avg_hpi",
          cell: info => FORMATTERS.decimal(info.getValue()),
          minSize: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          header: () => (
            <SimpleTooltip
              className="table-tooltip-trigger"
              content={"Count of Wikipedia Language Editions"}
            >
              <div>
                L <Info size={10} />
              </div>
            </SimpleTooltip>
          ),
          accessorKey: "langs",
          cell: info => FORMATTERS.commas(info.getValue()),
          minSize: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          header: () => (
            <SimpleTooltip
              className="table-tooltip-trigger"
              content={"Average Count of Wikipedia Language Editions"}
            >
              <div>
                Avg L <Info size={10} />
              </div>
            </SimpleTooltip>
          ),
          accessorKey: "avg_langs",
          cell: info => FORMATTERS.decimal(info.getValue()),
          minSize: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          header: "Top 3",
          accessorKey: "top_ranked",
          cell: info => (
            <AnchorList
              items={info.getValue()}
              name={d => d.name}
              url={d => `/profile/person/${d.slug}/`}
              noAnd
            />
          ),
        },
      ],
      domains: [
        {
          enableSorting: false,
          header: "#",
          id: "row",
          accessorFn: (_d, i) => i + 1 + countOffset,
          maxSize: 45,
        },
        {
          header: "Domain",
          accessorKey: "domain",
        },
        {
          header: "People",
          accessorKey: "count",
          minSize: 60,
          className: "cell_numeric",
        },
        {
          header: () => (
            <SimpleTooltip
              className="table-tooltip-trigger"
              content={"Historical Popularity Index"}
            >
              <div>
                HPI 2022 <Info size={10} />
              </div>
            </SimpleTooltip>
          ),
          accessorKey: "hpi",
          cell: info => FORMATTERS.bigNum(info.getValue()),
          minSize: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          header: () => (
            <SimpleTooltip
              className="table-tooltip-trigger"
              content={"Average Historical Popularity Index"}
            >
              <div>
                Avg HPI <Info size={10} />
              </div>
            </SimpleTooltip>
          ),
          accessorKey: "avg_hpi",
          cell: info => FORMATTERS.decimal(info.getValue()),
          minSize: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          header: () => (
            <SimpleTooltip
              className="table-tooltip-trigger"
              content={"Count of Wikipedia Language Editions"}
            >
              <div>
                L <Info size={10} />
              </div>
            </SimpleTooltip>
          ),
          accessorKey: "langs",
          cell: info => FORMATTERS.commas(info.getValue()),
          minSize: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          header: () => (
            <SimpleTooltip
              className="table-tooltip-trigger"
              content={"Average Count of Wikipedia Language Editions"}
            >
              <div>
                Avg L <Info size={10} />
              </div>
            </SimpleTooltip>
          ),
          accessorKey: "avg_langs",
          cell: info => FORMATTERS.decimal(info.getValue()),
          minSize: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          header: "Top 3",
          accessorKey: "top_ranked",
          cell: info => (
            <AnchorList
              items={info.getValue()}
              name={d => d.name}
              url={d => `/profile/person/${d.slug}/`}
              noAnd
            />
          ),
        },
      ],
    },
    places: {
      countries: [
        {
          enableSorting: false,
          header: "#",
          id: "row",
          accessorFn: (_d, i) => i + 1 + countOffset,
          maxSize: 45,
        },
        {
          header: "Country",
          accessorKey: "country_name",
          style: {whiteSpace: "unset"},
          cell: info => (
            <a href={`/profile/country/${info.row.original.country_slug}`}>{info.getValue()}</a>
          ),
        },
        {
          header: "People",
          accessorKey: "count",
          minSize: 60,
          className: "cell_numeric",
        },
        {
          header: () => (
            <SimpleTooltip
              className="table-tooltip-trigger"
              content={"Historical Popularity Index"}
            >
              <div>
                HPI 2022 <Info size={10} />
              </div>
            </SimpleTooltip>
          ),
          accessorKey: "hpi",
          cell: info => FORMATTERS.bigNum(info.getValue()),
          minSize: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          header: () => (
            <SimpleTooltip
              className="table-tooltip-trigger"
              content={"Average Historical Popularity Index"}
            >
              <div>
                Avg HPI <Info size={10} />
              </div>
            </SimpleTooltip>
          ),
          accessorKey: "avg_hpi",
          cell: info => FORMATTERS.decimal(info.getValue()),
          minSize: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          header: () => (
            <SimpleTooltip
              className="table-tooltip-trigger"
              content={"Count of Wikipedia Language Editions"}
            >
              <div>
                L <Info size={10} />
              </div>
            </SimpleTooltip>
          ),
          accessorKey: "langs",
          cell: info => FORMATTERS.commas(info.getValue()),
          minSize: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          header: () => (
            <SimpleTooltip
              className="table-tooltip-trigger"
              content={"Average Count of Wikipedia Language Editions"}
            >
              <div>
                Avg L <Info size={10} />
              </div>
            </SimpleTooltip>
          ),
          accessorKey: "avg_langs",
          cell: info => FORMATTERS.decimal(info.getValue()),
          minSize: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          header: "Top 3",
          accessorKey: "top_ranked",
          cell: info => (
            <AnchorList
              items={info.getValue()}
              name={d => d.name}
              url={d => `/profile/person/${d.slug}/`}
              noAnd
            />
          ),
        },
      ],
      places: [
        {
          enableSorting: false,
          header: "#",
          id: "row",
          accessorFn: (_d, i) => i + 1 + countOffset,
          maxSize: 45,
        },
        {
          header: "City",
          accessorKey: "name",
          style: {whiteSpace: "unset"},
          cell: info => {
            const value = info.getValue();
            const original = info.row.original;
            return original.count > 15 ? (
              <a href={`/profile/place/${original.slug}`}>{value}</a>
            ) : (
              value
            );
          },
        },
        {
          header: "Country",
          accessorKey: "country_name",
          style: {whiteSpace: "unset"},
          cell: info => (
            <a href={`/profile/country/${info.row.original.country_slug}`}>{info.getValue()}</a>
          ),
        },
        {
          header: "People",
          accessorKey: "count",
          minSize: 60,
          className: "cell_numeric",
        },
        {
          header: () => (
            <SimpleTooltip
              className="table-tooltip-trigger"
              content={"Historical Popularity Index"}
            >
              <div>
                HPI 2022 <Info size={10} />
              </div>
            </SimpleTooltip>
          ),
          accessorKey: "hpi",
          cell: info => FORMATTERS.bigNum(info.getValue()),
          minSize: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          header: () => (
            <SimpleTooltip
              className="table-tooltip-trigger"
              content={"Average Historical Popularity Index"}
            >
              <div>
                Avg HPI <Info size={10} />
              </div>
            </SimpleTooltip>
          ),
          accessorKey: "avg_hpi",
          cell: info => FORMATTERS.decimal(info.getValue()),
          minSize: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          header: () => (
            <SimpleTooltip
              className="table-tooltip-trigger"
              content={"Count of Wikipedia Language Editions"}
            >
              <div>
                L <Info size={10} />
              </div>
            </SimpleTooltip>
          ),
          accessorKey: "langs",
          cell: info => FORMATTERS.commas(info.getValue()),
          minSize: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          header: () => (
            <SimpleTooltip
              className="table-tooltip-trigger"
              content={"Average Count of Wikipedia Language Editions"}
            >
              <div>
                Avg L <Info size={10} />
              </div>
            </SimpleTooltip>
          ),
          accessorKey: "avg_langs",
          cell: info => FORMATTERS.decimal(info.getValue()),
          minSize: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          header: "Top 3",
          accessorKey: "top_ranked",
          cell: info => (
            <AnchorList
              items={info.getValue()}
              name={d => d.name}
              url={d => `/profile/person/${d.slug}/`}
              noAnd
            />
          ),
        },
      ],
    },
  };

  const initialColumns = COLUMNS[show][nesting];

  if (show === "people") {
    // enrich columns with proper ranks
  }

  return initialColumns;
};

export default getColumns;

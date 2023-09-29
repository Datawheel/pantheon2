/* eslint react/display-name: 0 */
import React from "react";
import { Icon, Tooltip } from "@blueprintjs/core";
import AnchorList from "../../utils/AnchorList";
import PersonImage from "../../utils/PersonImage";
import { FORMATTERS } from "../../utils/consts";

const genderOrder = ["M", null, "F", "Non-binary"];

const getColumns = (show, nesting, countOffset) => {
  const COLUMNS = {
    people: {
      people: [
        {
          Header: "Info",
          columns: [
            {
              disableSortBy: true,
              Header: "#",
              id: "row",
              accessor: (_d, i) => i + 1 + countOffset,
              // accessor: (_d, i) => i + 1,
              maxWidth: 45,
            },
            {
              disableSortBy: true,
              Header: "",
              accessor: "id",
              Cell: ({ value }) => (
                <PersonImage
                  className="ranking-thumbnail"
                  src={`/images/profile/people/${value}.jpg`}
                  fallbackSrc="/images/icons/icon-person.svg"
                />
              ),
              maxWidth: 70,
            },
            {
              Header: "Name",
              accessor: "name",
              style: { whiteSpace: "unset" },
              Cell: ({ value, row: { original } }) => (
                <a href={`/profile/person/${original.slug}`}>{value}</a>
              ),
            },
            {
              id: "occupation_id",
              Header: "Occupation",
              accessor: (d) => (d.occupation ? d.occupation.occupation : null),
              Cell: ({ value, row: { original } }) =>
                value ? (
                  <a
                    href={`/profile/occupation/${original.occupation.occupation_slug}`}
                  >
                    {value}
                  </a>
                ) : (
                  <span>-</span>
                ),
            },
            {
              Header: "Birth",
              accessor: "birthyear",
              Cell: ({ value }) =>
                value ? (
                  <span>{FORMATTERS.year(value)}</span>
                ) : (
                  <span>{"Unknown"}</span>
                ),
              minWidth: 50,
            },
            {
              Header: "Death",
              accessor: "deathyear",
              Cell: ({ value }) =>
                value ? (
                  <span>{FORMATTERS.year(value)}</span>
                ) : (
                  <span>{"-"}</span>
                ),
              minWidth: 45,
            },
            {
              Header: "Gender",
              accessor: "gender",
              Cell: ({ value }) => (
                <span>
                  {value === "M"
                    ? "Male"
                    : value === "F"
                    ? "Female"
                    : "Non-binary"}
                </span>
              ),
              minWidth: 65,
              sortMethod: (a, b) => {
                const aIndex = genderOrder.indexOf(a);
                const bIndex = genderOrder.indexOf(b);
                return bIndex < aIndex ? -1 : bIndex > aIndex ? 1 : 0;
              },
            },
          ],
        },
        {
          Header: "Birthplace",
          columns: [
            {
              id: "bplace_geonameid",
              Header: "City",
              style: { whiteSpace: "unset" },
              accessor: (d) =>
                d.bplace_geonameid ? d.bplace_geonameid.place : null,
              Cell: ({ value, row: { original } }) =>
                value ? (
                  <a href={`/profile/place/${original.bplace_geonameid.slug}`}>
                    {value}
                  </a>
                ) : (
                  <span>-</span>
                ),
            },
            {
              id: "bplace_country",
              Header: "Country",
              style: { whiteSpace: "unset" },
              accessor: (d) =>
                d.bplace_country ? d.bplace_country.country : null,
              Cell: ({ value, row: { original } }) =>
                value ? (
                  <a href={`/profile/country/${original.bplace_country.slug}`}>
                    {value}
                  </a>
                ) : (
                  <span>-</span>
                ),
            },
          ],
        },
        {
          Header: "Deathplace",
          columns: [
            {
              id: "dplace_geonameid",
              Header: "City",
              style: { whiteSpace: "unset" },
              accessor: (d) =>
                d.dplace_geonameid ? d.dplace_geonameid.place : null,
              Cell: ({ value, row: { original } }) =>
                value ? (
                  <a href={`/profile/place/${original.dplace_geonameid.slug}`}>
                    {value}
                  </a>
                ) : (
                  <span>-</span>
                ),
            },
            {
              id: "dplace_country",
              Header: "Country",
              style: { whiteSpace: "unset" },
              accessor: (d) =>
                d.dplace_country ? d.dplace_country.country : null,
              Cell: ({ value, row: { original } }) =>
                value ? (
                  <a href={`/profile/country/${original.dplace_country.slug}`}>
                    {value}
                  </a>
                ) : (
                  <span>-</span>
                ),
            },
          ],
        },
        {
          Header: "Stats",
          columns: [
            {
              Header: () => (
                <Tooltip
                  className="table-tooltip-trigger"
                  content={"Wikipedia language editions"}
                >
                  <div>
                    L <Icon icon="info-sign" iconSize={10} />
                  </div>
                </Tooltip>
              ),
              accessor: "l",
              minWidth: 105,
              className: "cell_numeric",
              headerClassName: "nowrap",
              sortDescFirst: true,
            },
            {
              Header: () => (
                <Tooltip
                  className="table-tooltip-trigger"
                  content={"Effective Wikipedia language editions"}
                >
                  <div>
                    L* <Icon icon="info-sign" iconSize={10} />
                  </div>
                </Tooltip>
              ),
              accessor: "l_",
              Cell: ({ value }) => FORMATTERS.decimal(value),
              minWidth: 105,
              className: "cell_numeric",
              headerClassName: "nowrap",
              sortDescFirst: true,
            },
            {
              Header: () => (
                <Tooltip
                  className="table-tooltip-trigger"
                  content={
                    "Non-english Wikipedia pageviews in the past 6 months"
                  }
                >
                  <div>
                    PVne <Icon icon="info-sign" iconSize={10} />
                  </div>
                </Tooltip>
              ),
              accessor: "non_en_page_views",
              Cell: ({ value }) => FORMATTERS.bigNum(value),
              width: 105,
              headerClassName: "nowrap",
              sortDescFirst: true,
            },
            {
              Header: () => (
                <Tooltip
                  className="table-tooltip-trigger"
                  content={
                    "Coefficient of variation in Wikipedia Pageviews: to discount characters that have short periods of popularity"
                  }
                >
                  <div>
                    CV <Icon icon="info-sign" iconSize={10} />
                  </div>
                </Tooltip>
              ),
              accessor: "coefficient_of_variation",
              Cell: ({ value }) => FORMATTERS.decimal(value),
              minWidth: 105,
              className: "cell_numeric",
              headerClassName: "nowrap",
              sortDescFirst: true,
            },
            {
              Header: () => (
                <Tooltip
                  className="table-tooltip-trigger"
                  content={"Historical Popularity Index"}
                >
                  <div>
                    HPI 2022 <Icon icon="info-sign" iconSize={10} />
                  </div>
                </Tooltip>
              ),
              accessor: "hpi",
              Cell: ({ value }) => FORMATTERS.decimal(value),
              defaultSorted: true,
              minWidth: 105,
              className: "cell_numeric",
              sortDescFirst: true,
            },
            {
              Header: () => (
                <Tooltip
                  className="table-tooltip-trigger"
                  content={"Historical Popularity Index"}
                >
                  <div>
                    HPI 2020 <Icon icon="info-sign" iconSize={10} />
                  </div>
                </Tooltip>
              ),
              accessor: "hpi_prev",
              Cell: ({ value }) => (value ? FORMATTERS.decimal(value) : "-"),
              defaultSorted: true,
              minWidth: 105,
              className: "cell_numeric",
              sortDescFirst: true,
            },
            {
              Header: "Rank 2022",
              accessor: "rank",
              minWidth: 45,
              className: "cell_numeric",
            },
            {
              Header: "Rank 2020",
              accessor: "rank_prev",
              minWidth: 45,
              className: "cell_numeric",
            },
            {
              Header: "∆",
              accessor: "rank_delta",
              minWidth: 45,
              className: "cell_numeric",
              Cell: ({ value }) =>
                value ? (
                  value > 0 ? (
                    <span className="u-positive-text u-positive-arrow">{`+${value}`}</span>
                  ) : (
                    <span className="u-negative-text u-negative-arrow">
                      {value}
                    </span>
                  )
                ) : (
                  "-"
                ),
            },
          ],
        },
        // {
        //   Header: "Occupation Ranking",
        //   columns: [
        //     {
        //       Header: "2022",
        //       accessor: "occupation_rank",
        //       minWidth: 45,
        //       className: "cell_numeric"
        //     },
        //     {
        //       Header: "2019",
        //       accessor: "occupation_rank_prev",
        //       minWidth: 45,
        //       className: "cell_numeric"
        //     },
        //     {
        //       Header: "∆",
        //       accessor: "occupation_rank_delta",
        //       minWidth: 45,
        //       className: "cell_numeric",
        //       Cell: ({value}) => value ? value > 0 ? <span className="u-positive-text u-positive-arrow">{`+${value}`}</span> : <span className="u-negative-text u-negative-arrow">{value}</span> : "-"
        //     }
        //   ]
        // },
        // {
        //   Header: "Birth Country Ranking",
        //   columns: [
        //     {
        //       Header: "2022",
        //       accessor: "bplace_country_rank",
        //       minWidth: 45,
        //       className: "cell_numeric"
        //     },
        //     {
        //       Header: "2019",
        //       accessor: "bplace_country_rank_prev",
        //       minWidth: 45,
        //       className: "cell_numeric"
        //     },
        //     {
        //       Header: "∆",
        //       accessor: "bplace_country_rank_delta",
        //       minWidth: 85,
        //       className: "cell_numeric",
        //       Cell: ({value}) => value ? value > 0 ? <span className="u-positive-text u-positive-arrow">{`+${value}`}</span> : <span className="u-negative-text u-negative-arrow">{value}</span> : "-"
        //     }
        //   ]
        // }
      ],
    },
    occupations: {
      occupations: [
        {
          disableSortBy: true,
          Header: "#",
          id: "row",
          accessor: (_d, i) => i + 1 + countOffset,
          maxWidth: 45,
        },
        {
          Header: "Occupation",
          accessor: "name",
          style: { whiteSpace: "unset" },
          Cell: ({ value, row: { original } }) => (
            <a href={`/profile/occupation/${original.slug}`}>{value}</a>
          ),
        },
        {
          Header: "Industry",
          accessor: "industry",
        },
        {
          Header: "Domain",
          accessor: "domain",
        },
        {
          Header: "People",
          accessor: "count",
          minWidth: 60,
          className: "cell_numeric",
        },
        {
          Header: () => (
            <Tooltip
              className="table-tooltip-trigger"
              content={"Historical Popularity Index"}
            >
              <div>
                HPI 2022 <Icon icon="info-sign" iconSize={10} />
              </div>
            </Tooltip>
          ),
          accessor: "hpi",
          Cell: ({ value }) => FORMATTERS.bigNum(value),
          defaultSorted: true,
          minWidth: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          Header: () => (
            <Tooltip
              className="table-tooltip-trigger"
              content={"Average Historical Popularity Index"}
            >
              <div>
                Avg HPI <Icon icon="info-sign" iconSize={10} />
              </div>
            </Tooltip>
          ),
          accessor: "avg_hpi",
          Cell: ({ value }) => FORMATTERS.decimal(value),
          minWidth: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          Header: () => (
            <Tooltip
              className="table-tooltip-trigger"
              content={"Count of Wikipedia Language Editions"}
            >
              <div>
                L <Icon icon="info-sign" iconSize={10} />
              </div>
            </Tooltip>
          ),
          accessor: "langs",
          Cell: ({ value }) => FORMATTERS.commas(value),
          minWidth: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          Header: () => (
            <Tooltip
              className="table-tooltip-trigger"
              content={"Average Count of Wikipedia Language Editions"}
            >
              <div>
                Avg L <Icon icon="info-sign" iconSize={10} />
              </div>
            </Tooltip>
          ),
          accessor: "avg_langs",
          Cell: ({ value }) => FORMATTERS.decimal(value),
          minWidth: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          Header: "Top 3",
          accessor: "top_ranked",
          Cell: ({ value }) => (
            <AnchorList
              items={value}
              name={(d) => d.name}
              url={(d) => `/profile/person/${d.slug}/`}
              noAnd
            />
          ),
        },
      ],
      industries: [
        {
          disableSortBy: true,
          Header: "#",
          id: "row",
          accessor: (_d, i) => i + 1 + countOffset,
          maxWidth: 45,
        },
        {
          Header: "Industry",
          accessor: "industry",
        },
        {
          Header: "Domain",
          accessor: "domain",
        },
        {
          Header: "People",
          accessor: "count",
          minWidth: 60,
          className: "cell_numeric",
        },
        {
          Header: () => (
            <Tooltip
              className="table-tooltip-trigger"
              content={"Historical Popularity Index"}
            >
              <div>
                HPI 2022 <Icon icon="info-sign" iconSize={10} />
              </div>
            </Tooltip>
          ),
          accessor: "hpi",
          Cell: ({ value }) => FORMATTERS.bigNum(value),
          defaultSorted: true,
          minWidth: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          Header: () => (
            <Tooltip
              className="table-tooltip-trigger"
              content={"Average Historical Popularity Index"}
            >
              <div>
                Avg HPI <Icon icon="info-sign" iconSize={10} />
              </div>
            </Tooltip>
          ),
          accessor: "avg_hpi",
          Cell: ({ value }) => FORMATTERS.decimal(value),
          minWidth: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          Header: () => (
            <Tooltip
              className="table-tooltip-trigger"
              content={"Count of Wikipedia Language Editions"}
            >
              <div>
                L <Icon icon="info-sign" iconSize={10} />
              </div>
            </Tooltip>
          ),
          accessor: "langs",
          Cell: ({ value }) => FORMATTERS.commas(value),
          minWidth: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          Header: () => (
            <Tooltip
              className="table-tooltip-trigger"
              content={"Average Count of Wikipedia Language Editions"}
            >
              <div>
                Avg L <Icon icon="info-sign" iconSize={10} />
              </div>
            </Tooltip>
          ),
          accessor: "avg_langs",
          Cell: ({ value }) => FORMATTERS.decimal(value),
          minWidth: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          Header: "Top 3",
          accessor: "top_ranked",
          Cell: ({ value }) => (
            <AnchorList
              items={value}
              name={(d) => d.name}
              url={(d) => `/profile/person/${d.slug}/`}
              noAnd
            />
          ),
        },
      ],
      domains: [
        {
          disableSortBy: true,
          Header: "#",
          id: "row",
          accessor: (_d, i) => i + 1 + countOffset,
          maxWidth: 45,
        },
        {
          Header: "Domain",
          accessor: "domain",
        },
        {
          Header: "People",
          accessor: "count",
          minWidth: 60,
          className: "cell_numeric",
        },
        {
          Header: () => (
            <Tooltip
              className="table-tooltip-trigger"
              content={"Historical Popularity Index"}
            >
              <div>
                HPI 2022 <Icon icon="info-sign" iconSize={10} />
              </div>
            </Tooltip>
          ),
          accessor: "hpi",
          Cell: ({ value }) => FORMATTERS.bigNum(value),
          defaultSorted: true,
          minWidth: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          Header: () => (
            <Tooltip
              className="table-tooltip-trigger"
              content={"Average Historical Popularity Index"}
            >
              <div>
                Avg HPI <Icon icon="info-sign" iconSize={10} />
              </div>
            </Tooltip>
          ),
          accessor: "avg_hpi",
          Cell: ({ value }) => FORMATTERS.decimal(value),
          minWidth: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          Header: () => (
            <Tooltip
              className="table-tooltip-trigger"
              content={"Count of Wikipedia Language Editions"}
            >
              <div>
                L <Icon icon="info-sign" iconSize={10} />
              </div>
            </Tooltip>
          ),
          accessor: "langs",
          Cell: ({ value }) => FORMATTERS.commas(value),
          minWidth: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          Header: () => (
            <Tooltip
              className="table-tooltip-trigger"
              content={"Average Count of Wikipedia Language Editions"}
            >
              <div>
                Avg L <Icon icon="info-sign" iconSize={10} />
              </div>
            </Tooltip>
          ),
          accessor: "avg_langs",
          Cell: ({ value }) => FORMATTERS.decimal(value),
          minWidth: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          Header: "Top 3",
          accessor: "top_ranked",
          Cell: ({ value }) => (
            <AnchorList
              items={value}
              name={(d) => d.name}
              url={(d) => `/profile/person/${d.slug}/`}
              noAnd
            />
          ),
        },
      ],
    },
    // occupations: {
    //   occupations: [
    //     {
    //       Header: "",
    //       id: "row",
    //       maxWidth: 45,
    //       filterable: false,
    //       Cell: row => <div>{row.viewIndex + 1 + row.pageSize * row.page}</div>
    //     },
    //     {
    //       Header: "",
    //       accessor: "slug",
    //       Cell: ({value}) => <div className="ranking-thumbnail" style={{backgroundImage: `url('/images/profile/occupation/${value}.jpg')`}}></div>,
    //       maxWidth: 70
    //     },
    //     {
    //       Header: "Occupation",
    //       accessor: "name",
    //       Cell: ({value, original}) => <a href={`/profile/occupation/${original.slug}`}>{value}</a>
    //     },
    //     {
    //       Header: "Industry",
    //       accessor: "id",
    //       Cell: ({value}) => {
    //         const occ = occupations.find(o => o.id === value);
    //         return <span>{occ.industry}</span>;
    //       }
    //     },
    //     {
    //       Header: "Domain",
    //       accessor: "id",
    //       Cell: ({value}) => {
    //         const occ = occupations.find(o => o.id === value);
    //         return <span>{occ.domain}</span>;
    //       }
    //     },
    //     {
    //       Header: "People",
    //       accessor: "count",
    //       defaultSorted: true,
    //       minWidth: 55
    //     },
    //     {
    //       Header: "HPI",
    //       accessor: "hpi",
    //       Cell: ({value}) => <span>{FORMATTERS.bigNum(value)}</span>,
    //       minWidth: 55
    //     },
    //     {
    //       Header: "Avg. HPI",
    //       accessor: "avg_hpi",
    //       Cell: ({value}) => <span>{FORMATTERS.decimal(value)}</span>,
    //       minWidth: 55
    //     },
    //     {
    //       Header: "L",
    //       accessor: "langs",
    //       Cell: ({value}) => <span>{FORMATTERS.commas(value)}</span>,
    //       minWidth: 55
    //     },
    //     {
    //       Header: "Avg. L",
    //       accessor: "avg_langs",
    //       Cell: ({value}) => <span>{FORMATTERS.decimal(value)}</span>,
    //       minWidth: 55
    //     },
    //     {
    //       Header: "Top 3",
    //       accessor: "top_ranked",
    //       style: {whiteSpace: "unset"},
    //       Cell: ({value}) => <AnchorList items={value} name={d => d.name} url={d => `/profile/person/${d.slug}/`} noAnd />
    //     }
    //     // {
    //     //   header: "% Women",
    //     //   accessor: "num_born_women",
    //     //   minWidth: 72,
    //     //   render: ({value, row}) => <span>{value ? FORMATTERS.shareWhole(value/row["num_born"]) : "0%"}</span>
    //     // }
    //   ],
    //   industries: [
    //     {
    //       header: "#",
    //       accessor: "num_born",
    //       minWidth: 30,
    //       render: ({index}) => <span>{index + 1}</span>
    //     },
    //     {
    //       header: "Industry",
    //       accessor: "occupation",
    //       render: ({value}) => <span>{value.industry}</span>
    //     },
    //     {
    //       header: "Domain",
    //       accessor: "occupation",
    //       render: ({value}) => <span>{value.domain}</span>
    //     },
    //     {
    //       header: "People",
    //       accessor: "num_born",
    //       sort: "desc"
    //     }
    //     // {
    //     //   header: "% Women",
    //     //   accessor: "num_born_women",
    //     //   minWidth: 72,
    //     //   render: ({value, row}) => <span>{value ? FORMATTERS.shareWhole(value/row["num_born"]) : "0%"}</span>
    //     // }
    //   ],
    //   domains: [
    //     {
    //       header: "#",
    //       accessor: "num_born",
    //       render: ({index}) => <span>{index + 1}</span>
    //     },
    //     {
    //       header: "Domain",
    //       accessor: "occupation",
    //       render: ({value}) => <span>{value.domain}</span>
    //     },
    //     {
    //       header: "People",
    //       accessor: "num_born",
    //       sort: "desc"
    //     }
    //     // {
    //     //   header: "% Women",
    //     //   accessor: "num_born_women",
    //     //   minWidth: 72,
    //     //   render: ({value, row}) => <span>{value ? FORMATTERS.shareWhole(value/row["num_born"]) : "0%"}</span>
    //     // }
    //   ]
    // },
    places: {
      countries: [
        {
          disableSortBy: true,
          Header: "#",
          id: "row",
          accessor: (_d, i) => i + 1 + countOffset,
          maxWidth: 45,
        },
        {
          Header: "Country",
          accessor: "country_name",
          style: { whiteSpace: "unset" },
          Cell: ({ value, row: { original } }) => (
            <a href={`/profile/country/${original.country_slug}`}>{value}</a>
          ),
        },
        {
          Header: "People",
          accessor: "count",
          minWidth: 60,
          className: "cell_numeric",
        },
        {
          Header: () => (
            <Tooltip
              className="table-tooltip-trigger"
              content={"Historical Popularity Index"}
            >
              <div>
                HPI 2022 <Icon icon="info-sign" iconSize={10} />
              </div>
            </Tooltip>
          ),
          accessor: "hpi",
          Cell: ({ value }) => FORMATTERS.bigNum(value),
          defaultSorted: true,
          minWidth: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          Header: () => (
            <Tooltip
              className="table-tooltip-trigger"
              content={"Average Historical Popularity Index"}
            >
              <div>
                Avg HPI <Icon icon="info-sign" iconSize={10} />
              </div>
            </Tooltip>
          ),
          accessor: "avg_hpi",
          Cell: ({ value }) => FORMATTERS.decimal(value),
          minWidth: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          Header: () => (
            <Tooltip
              className="table-tooltip-trigger"
              content={"Count of Wikipedia Language Editions"}
            >
              <div>
                L <Icon icon="info-sign" iconSize={10} />
              </div>
            </Tooltip>
          ),
          accessor: "langs",
          Cell: ({ value }) => FORMATTERS.commas(value),
          minWidth: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          Header: () => (
            <Tooltip
              className="table-tooltip-trigger"
              content={"Average Count of Wikipedia Language Editions"}
            >
              <div>
                Avg L <Icon icon="info-sign" iconSize={10} />
              </div>
            </Tooltip>
          ),
          accessor: "avg_langs",
          Cell: ({ value }) => FORMATTERS.decimal(value),
          minWidth: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          Header: "Top 3",
          accessor: "top_ranked",
          Cell: ({ value }) => (
            <AnchorList
              items={value}
              name={(d) => d.name}
              url={(d) => `/profile/person/${d.slug}/`}
              noAnd
            />
          ),
        },
        // {
        //   header: "Region",
        //   accessor: "country",
        //   render: ({value}) => <span>{value.region}</span>
        // },
        // {
        //   header: "Continent",
        //   accessor: "country",
        //   render: ({value}) => <span>{value.continent}</span>
        // },
        // {
        //   header: "Births",
        //   accessor: "num_born",
        //   minWidth: 60
        // },
        // {
        //   header: "Deaths",
        //   accessor: "num_died",
        //   minWidth: 60
        // }
      ],
      places: [
        {
          disableSortBy: true,
          Header: "#",
          id: "row",
          accessor: (_d, i) => i + 1 + countOffset,
          maxWidth: 45,
        },
        {
          Header: "City",
          accessor: "name",
          style: { whiteSpace: "unset" },
          Cell: ({ value, row: { original } }) =>
            original.count > 15 ? (
              <a href={`/profile/place/${original.slug}`}>{value}</a>
            ) : (
              value
            ),
        },
        {
          Header: "Country",
          accessor: "country_name",
          style: { whiteSpace: "unset" },
          Cell: ({ value, row: { original } }) => (
            <a href={`/profile/country/${original.country_slug}`}>{value}</a>
          ),
        },
        {
          Header: "People",
          accessor: "count",
          minWidth: 60,
          className: "cell_numeric",
        },
        {
          Header: () => (
            <Tooltip
              className="table-tooltip-trigger"
              content={"Historical Popularity Index"}
            >
              <div>
                HPI 2022 <Icon icon="info-sign" iconSize={10} />
              </div>
            </Tooltip>
          ),
          accessor: "hpi",
          Cell: ({ value }) => FORMATTERS.bigNum(value),
          defaultSorted: true,
          minWidth: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          Header: () => (
            <Tooltip
              className="table-tooltip-trigger"
              content={"Average Historical Popularity Index"}
            >
              <div>
                Avg HPI <Icon icon="info-sign" iconSize={10} />
              </div>
            </Tooltip>
          ),
          accessor: "avg_hpi",
          Cell: ({ value }) => FORMATTERS.decimal(value),
          minWidth: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          Header: () => (
            <Tooltip
              className="table-tooltip-trigger"
              content={"Count of Wikipedia Language Editions"}
            >
              <div>
                L <Icon icon="info-sign" iconSize={10} />
              </div>
            </Tooltip>
          ),
          accessor: "langs",
          Cell: ({ value }) => FORMATTERS.commas(value),
          minWidth: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          Header: () => (
            <Tooltip
              className="table-tooltip-trigger"
              content={"Average Count of Wikipedia Language Editions"}
            >
              <div>
                Avg L <Icon icon="info-sign" iconSize={10} />
              </div>
            </Tooltip>
          ),
          accessor: "avg_langs",
          Cell: ({ value }) => FORMATTERS.decimal(value),
          minWidth: 55,
          className: "cell_numeric",
          sortDescFirst: true,
        },
        {
          Header: "Top 3",
          accessor: "top_ranked",
          Cell: ({ value }) => (
            <AnchorList
              items={value}
              name={(d) => d.name}
              url={(d) => `/profile/person/${d.slug}/`}
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

/* eslint react/display-name: 0 */
import React from "react";
import AnchorList from "components/utils/AnchorList";
import {FORMATTERS} from "types";
import {Icon, Tooltip} from "@blueprintjs/core";

const genderOrder = ["M", null, "F"];

const getColumns = (show, nesting, occupations, places) => {
  const COLUMNS = {
    people: {
      people: [
        {
          Header: "#",
          accessor: "rank",
          // sortable: false,
          Cell: ({value}) => <span>{value}</span>,
          minWidth: 45
        },
        {
          Header: "",
          accessor: "id",
          Cell: ({value}) => <div className="ranking-thumbnail" style={{backgroundImage: `url('/images/profile/people/${value}.jpg')`}}></div>,
          maxWidth: 70
        },
        {
          Header: "Name",
          accessor: "name",
          style: {whiteSpace: "unset"},
          Cell: ({value, original}) => <a href={`/profile/person/${original.slug}`}>{value}</a>
        },
        {
          id: "occupation_id",
          Header: "Occupation",
          accessor: "occupation_id",
          Cell: ({row}) => {
            const occ = row.occupation_id ? occupations.find(o => o.id === row.occupation_id) : null;
            return occ
              ? <a href={`/profile/occupation/${occ.occupation_slug}`}>{occ.occupation}</a>
              : " - ";
          }
        },
        {
          Header: "Birth",
          accessor: "birthyear",
          Cell: ({value}) => value ? <span>{FORMATTERS.year(value)}</span> : <span>{"Unknown"}</span>,
          minWidth: 50
        },
        {
          Header: "Death",
          accessor: "deathyear",
          Cell: ({value}) => value ? <span>{FORMATTERS.year(value)}</span> : <span>{"-"}</span>,
          minWidth: 45
        },
        {
          Header: "Gender",
          accessor: "gender",
          Cell: ({value}) => <span>{value === "M" ? "Male" : value === "F" ? "Female" : "-"}</span>,
          minWidth: 65,
          sortMethod: (a, b) => {
            const aIndex = genderOrder.indexOf(a);
            const bIndex = genderOrder.indexOf(b);
            return bIndex < aIndex ? -1 : bIndex > aIndex ? 1 : 0;
          }
        },
        {
          Header: "Birthplace",
          columns: [
            {
              id: "bplace_geonameid",
              Header: "City",
              style: {whiteSpace: "unset"},
              accessor: d => d.bplace_geonameid ? d.bplace_geonameid.place : null,
              Cell: ({value, original}) => value ? <a href={`/profile/place/${original.bplace_geonameid.slug}`}>{value}</a> : <span>-</span>
            },
            {
              id: "bplace_country",
              Header: "Country",
              style: {whiteSpace: "unset"},
              accessor: d => d.bplace_country ? d.bplace_country.country : null,
              Cell: ({value, original}) => value ? <a href={`/profile/country/${original.bplace_country.slug}`}>{value}</a> : <span>-</span>
            }
          ]
        },
        {
          Header: "Deathplace",
          columns: [
            {
              id: "dplace_geonameid",
              Header: "City",
              style: {whiteSpace: "unset"},
              accessor: d => d.dplace_geonameid ? d.dplace_geonameid.place : null,
              Cell: ({value, original}) => value ? <a href={`/profile/place/${original.dplace_geonameid.slug}`}>{value}</a> : <span>-</span>
            },
            {
              id: "dplace_country",
              Header: "Country",
              style: {whiteSpace: "unset"},
              accessor: d => d.dplace_country ? d.dplace_country.country : null,
              Cell: ({value, original}) => value ? <a href={`/profile/country/${original.dplace_country.slug}`}>{value}</a> : <span>-</span>
            }
          ]
        },
        {
          Header: () => <Tooltip className="table-tooltip-trigger" content={"Wikipedia language editions"}>
            <div>L <Icon icon="info-sign" iconSize={10} /></div>
          </Tooltip>,
          accessor: "l",
          minWidth: 45
        },
        {
          Header: () => <Tooltip className="table-tooltip-trigger" content={"Effective Wikipedia language editions"}>
            <div>L* <Icon icon="info-sign" iconSize={10} /></div>
          </Tooltip>,
          accessor: "l_",
          Cell: ({value}) => FORMATTERS.decimal(value),
          minWidth: 50
        },
        {
          Header: () => <Tooltip className="table-tooltip-trigger" content={"Non-english Wikipedia pageviews in the past 6 months"}>
            <div>PVne <Icon icon="info-sign" iconSize={10} /></div>
          </Tooltip>,
          accessor: "non_en_page_views",
          Cell: ({value}) => FORMATTERS.bigNum(value),
          minWidth: 50
        },
        {
          Header: () => <Tooltip className="table-tooltip-trigger" content={"Coefficient of variation in Wikipedia Pageviews: to discount characters that have short periods of popularity"}>
            <div>CV <Icon icon="info-sign" iconSize={10} /></div>
          </Tooltip>,
          accessor: "coefficient_of_variation",
          Cell: ({value}) => FORMATTERS.decimal(value),
          minWidth: 50
        },
        {
          Header: () => <Tooltip className="table-tooltip-trigger" content={"Historical Popularity Index"}>
            <div>HPI <Icon icon="info-sign" iconSize={10} /></div>
          </Tooltip>,
          accessor: "hpi",
          Cell: ({value}) => FORMATTERS.decimal(value),
          defaultSorted: true,
          maxWidth: 80
        }
      ]
    },
    occupations: {
      occupations: [
        {
          Header: "",
          id: "row",
          maxWidth: 45,
          filterable: false,
          Cell: row => <div>{row.viewIndex + 1 + row.pageSize * row.page}</div>
        },
        {
          Header: "",
          accessor: "slug",
          Cell: ({value}) => <div className="ranking-thumbnail" style={{backgroundImage: `url('/images/profile/occupation/${value}.jpg')`}}></div>,
          maxWidth: 70
        },
        {
          Header: "Occupation",
          accessor: "name",
          Cell: ({value, original}) => <a href={`/profile/occupation/${original.slug}`}>{value}</a>
        },
        {
          Header: "Industry",
          accessor: "id",
          Cell: ({value}) => {
            const occ = occupations.find(o => o.id === value);
            return <span>{occ.industry}</span>;
          }
        },
        {
          Header: "Domain",
          accessor: "id",
          Cell: ({value}) => {
            const occ = occupations.find(o => o.id === value);
            return <span>{occ.domain}</span>;
          }
        },
        {
          Header: "People",
          accessor: "count",
          defaultSorted: true,
          minWidth: 55
        },
        {
          Header: "HPI",
          accessor: "hpi",
          Cell: ({value}) => <span>{FORMATTERS.bigNum(value)}</span>,
          minWidth: 55
        },
        {
          Header: "Avg. HPI",
          accessor: "avg_hpi",
          Cell: ({value}) => <span>{FORMATTERS.decimal(value)}</span>,
          minWidth: 55
        },
        {
          Header: "L",
          accessor: "langs",
          Cell: ({value}) => <span>{FORMATTERS.commas(value)}</span>,
          minWidth: 55
        },
        {
          Header: "Avg. L",
          accessor: "avg_langs",
          Cell: ({value}) => <span>{FORMATTERS.decimal(value)}</span>,
          minWidth: 55
        },
        {
          Header: "Top 3",
          accessor: "top_ranked",
          style: {whiteSpace: "unset"},
          Cell: ({value}) => <AnchorList items={value} name={d => d.name} url={d => `/profile/person/${d.slug}/`} noAnd />
        }
        // {
        //   header: "% Women",
        //   accessor: "num_born_women",
        //   minWidth: 72,
        //   render: ({value, row}) => <span>{value ? FORMATTERS.shareWhole(value/row["num_born"]) : "0%"}</span>
        // }
      ],
      industries: [
        {
          header: "#",
          accessor: "num_born",
          minWidth: 30,
          render: ({index}) => <span>{index + 1}</span>
        },
        {
          header: "Industry",
          accessor: "occupation",
          render: ({value}) => <span>{value.industry}</span>
        },
        {
          header: "Domain",
          accessor: "occupation",
          render: ({value}) => <span>{value.domain}</span>
        },
        {
          header: "People",
          accessor: "num_born",
          sort: "desc"
        }
        // {
        //   header: "% Women",
        //   accessor: "num_born_women",
        //   minWidth: 72,
        //   render: ({value, row}) => <span>{value ? FORMATTERS.shareWhole(value/row["num_born"]) : "0%"}</span>
        // }
      ],
      domains: [
        {
          header: "#",
          accessor: "num_born",
          render: ({index}) => <span>{index + 1}</span>
        },
        {
          header: "Domain",
          accessor: "occupation",
          render: ({value}) => <span>{value.domain}</span>
        },
        {
          header: "People",
          accessor: "num_born",
          sort: "desc"
        }
        // {
        //   header: "% Women",
        //   accessor: "num_born_women",
        //   minWidth: 72,
        //   render: ({value, row}) => <span>{value ? FORMATTERS.shareWhole(value/row["num_born"]) : "0%"}</span>
        // }
      ]
    },
    places: {
      countries: [
        {
          header: "#",
          accessor: "born_rank_unique",
          render: ({value, index}) => <span>{value ? value : index + 1}</span>
        },
        {
          header: "Country",
          accessor: "country",
          render: ({value}) => <a href={`/profile/place/${value.slug}`}>{value.name}</a>
        },
        {
          header: "Region",
          accessor: "country",
          render: ({value}) => <span>{value.region}</span>
        },
        {
          header: "Continent",
          accessor: "country",
          render: ({value}) => <span>{value.continent}</span>
        },
        {
          header: "Births",
          accessor: "num_born",
          minWidth: 60
        },
        {
          header: "Deaths",
          accessor: "num_died",
          minWidth: 60
        }
      ],
      places: [
        {
          Header: "City",
          accessor: "name",
          Cell: ({value, original}) => original.count > 15 ? <a href={`/profile/place/${original.slug}`}>{value}</a> : value
        },
        {
          Header: "Country",
          accessor: "country_name",
          Cell: ({value, original}) => <a href={`/profile/country/${original.country_slug}`}>{value}</a>
        },
        {
          Header: "People",
          accessor: "count",
          minWidth: 60
        },
        {
          Header: "HPI",
          accessor: "hpi",
          Cell: ({value}) => <span>{FORMATTERS.bigNum(value)}</span>,
          minWidth: 55,
          defaultSorted: true
        },
        {
          Header: "Avg. HPI",
          accessor: "avg_hpi",
          Cell: ({value}) => <span>{FORMATTERS.decimal(value)}</span>,
          minWidth: 55
        },
        {
          Header: "L",
          accessor: "langs",
          Cell: ({value}) => <span>{FORMATTERS.commas(value)}</span>,
          minWidth: 55
        },
        {
          Header: "Avg. L",
          accessor: "avg_langs",
          Cell: ({value}) => <span>{FORMATTERS.decimal(value)}</span>,
          minWidth: 55
        },
        {
          Header: "Top 3",
          accessor: "top_ranked",
          Cell: ({value}) => <AnchorList items={value} name={d => d.name} url={d => `/profile/person/${d.slug}/`} noAnd />
        }
        // {
        //   header: "Deaths",
        //   accessor: "num_died",
        //   minWidth: 60
        // }
      ]
    }
  };

  return COLUMNS[show][nesting];
};

export default getColumns;

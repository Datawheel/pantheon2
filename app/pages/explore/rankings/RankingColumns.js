/* eslint react/display-name: 0 */
import React from "react";
import AnchorList from "components/utils/AnchorList";
import {FORMATTERS} from "types";

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
          Header: "Name",
          accessor: "name",
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
          minWidth: 80
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
          Cell: ({value}) => <span>{value ? "Male" : "Female"}</span>,
          minWidth: 80
        },
        {
          id: "birthplace",
          Header: "Birth Place",
          accessor: d => d.birthplace ? d.birthplace.name : null,
          Cell: ({value, row}) => value ? <a href={`/profile/place/${row.birthplace.slug}`}>{value}</a> : <span>-</span>
        },
        {
          id: "deathplace",
          Header: "Death Place",
          accessor: d => d.deathplace ? d.deathplace.name : null,
          Cell: ({value, row}) => value ? <a href={`/profile/place/${row.deathplace.slug}`}>{value}</a> : <span>-</span>
        },
        {Header: "L", accessor: "langs", minWidth: 35},
        {Header: "HPI", accessor: "hpi", defaultSorted: true, maxWidth: 80}
      ]
    },
    occupations: {
      occupations: [
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
          Header: "Avg. HPI",
          accessor: "avg_hpi",
          Cell: ({value}) => <span>{FORMATTERS.decimal(value)}</span>,
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
          render: ({index}) => <span>{index+1}</span>
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
        },
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
        },
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
          render: ({value, index}) => <span>{value ? value : index+1}</span>
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
          Cell: ({value, original}) => <a href={`/profile/place/${original.slug}`}>{value}</a>
        },
        {
          Header: "Country",
          accessor: "country_name",
          Cell: ({value}) => <a href={`/profile/place/${value}`}>{value}</a>
        },
        {
          Header: "People",
          accessor: "count",
          defaultSorted: true,
          minWidth: 60
        },
        {
          Header: "Avg. HPI",
          accessor: "avg_hpi",
          Cell: ({value}) => <span>{FORMATTERS.decimal(value)}</span>,
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

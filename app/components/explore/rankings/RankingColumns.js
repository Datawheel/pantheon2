import React from "react";
import {FORMATTERS} from "types";

export const COLUMNS = {
  people: {
    people: [
      {
        header: "#",
        accessor: "rank",
        sortable: false,
        render: ({index}) => <span>{index + 1}</span>,
        minWidth: 30
      },
      {
        header: "Name",
        accessor: "name",
        render: ({value, row}) => <a href={`/profile/person/${row["slug"]}`}>{value}</a>
      },
      {
        id: "occupation.occupation",
        header: "Occupation",
        accessor: d => d.occupation ? d.occupation.occupation : null,
        render: ({value, row}) => <a href={`/profile/occupation/${row.occupation.occupation_slug}`}>{value}</a>
      },
      {
        header: "Birth",
        accessor: "birthyear",
        render: ({value, row}) => value ? <span>{FORMATTERS.year(value)}</span> : <span>{"Unknown"}</span>,
        minWidth: 45
      },
      {
        header: "Death",
        accessor: "deathyear",
        render: ({value, row}) => value ? <span>{FORMATTERS.year(value)}</span> : <span>{"--"}</span>,
        minWidth: 45
      },
      {
        header: "Gender",
        accessor: "gender",
        render: ({value}) => <span>{value ? "Male" : "Female"}</span>,
        minWidth: 50
      },
      {
        id: "birthplace.name",
        header: "Birth Place",
        accessor: d => d.birthplace ? d.birthplace.name : null,
        render: ({value, row}) => value ? <a href={`/profile/place/${row.birthplace.slug}`}>{value}</a> : <span>{"Unknown"}</span>
      },
      {
        id: "deathplace.name",
        header: "Death Place",
        accessor: d => d.deathplace ? d.deathplace.name : null,
        render: ({value, row}) => value ? <a href={`/profile/place/${row.deathplace.slug}`}>{value}</a> : <span></span>
      },
      {header: "L", accessor: "langs", minWidth: 35},
      {header: "HPI", accessor: "hpi", sort: "desc", maxWidth: 80}
    ]
  },
  occupations: {
    occupations: [
      {
        header: "#",
        accessor: "num_born",
        render: ({index}) => <span>{index+1}</span>,
        minWidth: 30
      },
      {
        header: "Occupation",
        accessor: "occupation",
        render: ({value, row}) => <a href={`/profile/occupation/${row["occupation_slug"]}`}>{value}</a>
      },
      {
        header: "Industry",
        accessor: "industry"
      },
      {
        header: "Domain",
        accessor: "domain"
      },
      {
        header: "People",
        accessor: "num_born",
        sort: "desc",
        minWidth: 55
      },
      {
        header: "% Women",
        accessor: "num_born_women",
        minWidth: 72,
        render: ({value, row}) => <span>{value ? FORMATTERS.shareWhole(value/row["num_born"]) : "0%"}</span>
      }
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
        accessor: "industry"
      },
      {
        header: "Domain",
        accessor: "domain"
      },
      {
        header: "People",
        accessor: "num_born",
        sort: "desc"
      },
      {
        header: "% Women",
        accessor: "num_born_women",
        minWidth: 72,
        render: ({value, row}) => <span>{value ? FORMATTERS.shareWhole(value/row["num_born"]) : "0%"}</span>
      }
    ],
    domains: [
      {
        header: "#",
        accessor: "num_born",
        render: ({index}) => <span>{index + 1}</span>
      },
      {
        header: "Domain",
        accessor: "domain"
      },
      {
        header: "People",
        accessor: "num_born",
        sort: "desc"
      },
      {
        header: "% Women",
        accessor: "num_born_women",
        minWidth: 72,
        render: ({value, row}) => <span>{value ? FORMATTERS.shareWhole(value/row["num_born"]) : "0%"}</span>
      }
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
        accessor: "name",
        render: ({value, row}) => <a href={`/profile/place/${row["slug"]}`}>{value}</a>
      },
      {
        header: "Continent",
        accessor: "continent"
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
        header: "#",
        accessor: "born_rank_unique",
        minWidth: 35,
        render: ({value, index}) => <span>{value ? value : index+1}</span>
      },
      {
        header: "City",
        accessor: "name",
        render: ({value, row}) => <a href={`/profile/place/${row["slug"]}`}>{value}</a>
      },
      {
        header: "Country",
        accessor: "country_name"
      },
      {
        header: "Region",
        accessor: "region"
      },
      {
        header: "Births",
        accessor: "num_born",
        minWidth: 60,
        sort: "desc"
      },
      {
        header: "Deaths",
        accessor: "num_died",
        minWidth: 60
      }
    ]
  }
};

import React from "react";
import {FORMATTERS} from "types";

export const COLUMNS = {
  person: {
    person: [
      {
        header: "#",
        accessor: "rank",
        sortable: false,
        render: ({index}) => <span>{index + 1}</span>
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
        header: "Born",
        accessor: "birthyear",
        render: ({value, row}) => value ? <span>{FORMATTERS.year(value)}</span> : null
      },
      {
        header: "Died",
        accessor: "deathyear",
        render: ({value, row}) => value ? <span>{FORMATTERS.year(value)}</span> : null
      },
      {
        header: "Gender",
        accessor: "gender",
        render: ({value}) => <span>{value ? "Female" : "Male"}</span>
      },
      {
        id: "birthplace.name",
        header: "Birth Place",
        accessor: d => d.birthplace ? d.birthplace.name : null,
        render: ({value, row}) => value ? <a href={`/profile/place/${row.birthplace.slug}`}>{value}</a> : null
      },
      {header: "L", accessor: "langs", sort: "desc"}
    ]
  },
  occupation: {
    occupation: [
      {
        header: "#",
        accessor: "num_born",
        render: ({index}) => <span>{index+1}</span>
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
        sort: "desc"
      },
      {
        header: "Women",
        accessor: "num_born_women",
        render: ({value, row}) => <span>{value ? FORMATTERS.shareWhole(value/row["num_born"]) : "0%"}</span>
      }
    ],
    industry: [
      {
        header: "#",
        accessor: "num_born",
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
        header: "Women",
        accessor: "num_born_women",
        render: ({value, row}) => <span>{value ? FORMATTERS.shareWhole(value/row["num_born"]) : "0%"}</span>
      }
    ],
    domain: [
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
        header: "Women",
        accessor: "num_born_women",
        render: ({value, row}) => <span>{value ? FORMATTERS.shareWhole(value/row["num_born"]) : "0%"}</span>
      }
    ]
  },
  place: {
    country: [
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
        header: "Born",
        accessor: "num_born"
      },
      {
        header: "Died",
        accessor: "num_died"
      }
    ],
    place: [
      {
        header: "#",
        accessor: "born_rank_unique",
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
        header: "Born",
        accessor: "num_born"
      },
      {
        header: "Died",
        accessor: "num_died",
      }
    ]
  }
};

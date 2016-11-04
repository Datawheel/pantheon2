import React, { Component, PropTypes } from "react";
import {connect} from "react-redux";
import Helmet from "react-helmet";
import config from "helmconfig.js";
import ReactTable from "react-table";
import styles from "css/components/explore/rankings";
import { polyfill } from "es6-promise";
import axios from "axios";
import { FORMATTERS } from "types";
import RankingControls from "components/explore/rankings/RankingControls";

polyfill();

class Rankings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pages: null,
      loading: true
    }
  }

  render() {
    const resultsPerPage = 20;
    const columns = [
    {
      header:'#',
      accessor:'rank',
      sortable: false
    },
    {
      header:'Name',
      accessor:'name',
      render: ({value, row}) => <a href={`/profile/person/${row["slug"]}`}>{value}</a>
    },
    {
      id: "profession.name",
      header: "Profession",
      accessor: d => d.profession ? d.profession.name : null,
      render: ({value, row}) => <a href={`/profile/profession/${row.profession.slug}`}>{value}</a>
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
    {header:'L', accessor:'langs'}];

    return (
      <div className='rankings'>
        <Helmet
          htmlAttributes={{"lang": "en", "amp": undefined}}
          title="Rankings"
          meta={config.meta}
          link={config.link}
        />
        <h1 className='header'>Rankings</h1>
        <RankingControls />
        <ReactTable
          columns={columns}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          pageSize={resultsPerPage}
          data={this.state.data} // Set the rows to be displayed
          pages={this.state.pages} // Display the total number of pages
          loading={this.state.loading} // Display the loading overlay when we need it
          onChange={(instance) => {
            const offset = instance.page * resultsPerPage;
            console.log(instance.sorting)

            let sort = '';
            if(instance.sorting.length){
              sort = instance.sorting[0].id;
              let orderKey = "order";
              if(sort.includes('.')){
                let [sortForeignKey, sortForeignCol] = sort.split('.');
                sortForeignCol = sortForeignCol === "name" ? "slug" : sortForeignCol;
                orderKey = `${sortForeignKey}.order`;
                sort = sortForeignCol;
              }
              const sortDirection = instance.sorting[0].asc ? "asc" : "desc";
              sort = `${orderKey}=${sort}.${sortDirection}.nullslast`;
            }

            // axios.get('http://localhost:3100/person?limit=20&select=langs,name,birthplace{*},profession{*},gender,birthyear,deathyear&offset=0&birthplace.order=slug.asc&order=birthyear.desc.nullslast')
            axios.get(`http://localhost:3100/person?limit=${resultsPerPage}&select=langs,name,slug,birthplace{*},profession{*},gender,birthyear,deathyear&offset=${offset}&${sort}`)
              .then((res) => {
                const contentRange = res.headers["content-range"];
                const totalResults = parseInt(contentRange.split("/")[1]);
                const totalPages = Math.ceil(totalResults / resultsPerPage);
                const rows = res.data.map((d, i) => {
                  d.rank = (i + 1) + offset;
                  return d;
                })
                // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
                this.setState({
                  data: rows,
                  pages: totalPages,
                  loading: false
                })
              })
          }}
        />
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    rankingControls: state.rankingControls
  };
}

export default connect(mapStateToProps)(Rankings);

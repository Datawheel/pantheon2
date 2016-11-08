import React, { Component, PropTypes } from "react";
import {connect} from "react-redux";
import Helmet from "react-helmet";
import config from "helmconfig.js";
import ReactTable from "react-table";
import styles from "css/components/explore/rankings";
import { FORMATTERS, RANKINGS_RESULTS_PER_PAGE } from "types";
import RankingControls from "components/explore/rankings/RankingControls";
import { updateRankingsTable } from "actions/rankings";

class RankingTable extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {results} = this.props.rankings;
    const {updateRankingsTable} = this.props;
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
      <div className="ranking-table">
        <h2>Most Globally Remembered People</h2>
        <h3>4000 BC - 2013</h3>
        <ReactTable
          columns={columns}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          pageSize={RANKINGS_RESULTS_PER_PAGE}
          data={results.data}
          pages={results.pages}
          onChange={updateRankingsTable}
        />
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    rankings: state.rankings
  };
}

export default connect(mapStateToProps, {updateRankingsTable})(RankingTable);

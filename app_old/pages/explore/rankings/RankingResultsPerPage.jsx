import React, {Component} from "react";

class RankingResultsPerPage extends Component {

  constructor(props) {
    super(props);
    this.pageSizes = [20, 50, 100, 200];
    this.state = {
      pageSize: 50
    };
  }

  changePageSize = e => {
    this.setState({pageSize: e.target.value});
    this.props.changePageSize({pageSize: e.target.value});
  }

  render() {
    const {pageSize} = this.state;

    return (
      <div className="ranking-result-count">
        Results:
        <select value={pageSize} onChange={this.changePageSize}>
          {this.pageSizes.map(size =>
            <option key={size} value={size}>{size}</option>
          )}
        </select>
      </div>
    );
  }
}

export default RankingResultsPerPage;

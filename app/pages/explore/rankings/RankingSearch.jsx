import React, {Component} from "react";

class RankingPagination extends Component {

  constructor(props) {
    super(props);
    // this.changeSearch = this.props.changeSearch.bind(this);
    this.state = {
      searchTerm: ""
    };
  }

  changeSearch = e => {
    const searchTerm = e.target.value;
    this.props.search(searchTerm);
    this.setState({searchTerm});
  }

  render() {
    const {searchTerm} = this.state;
    // const {search} = this.props;

    return (
      <div className="ranking-search">
        <input
          type="text"
          value={searchTerm}
          onChange={this.changeSearch}
          onKeyPress={e => e.key === "Enter" ? this.props.search(searchTerm) : null}
        />
        <button onClick={this.changeSearch}>Search</button>
      </div>
    );
  }
}

export default RankingPagination;

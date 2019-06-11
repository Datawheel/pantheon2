import React, {Component} from "react";
import {strip} from "d3plus-text";
import api from "apiConfig";
import "components/Search.css";

class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      results: []
    };
  }

  onChange(e) {
    const userQuery = e.target.value;
    if (userQuery.length < 3) return;
    if (userQuery.length === 0) this.setState({professionResults: [], placeResults: [], personResults: []});

    let userQueryCleaned = userQuery.split(" ");
    userQueryCleaned = userQueryCleaned.map(strip);
    const lastItem = userQueryCleaned[userQueryCleaned.length - 1];
    userQueryCleaned[userQueryCleaned.length - 1] = `${lastItem}:*`;
    userQueryCleaned = userQueryCleaned.join("%26");

    api.get(`/search?document=fts.${userQueryCleaned}&order=weight.desc.nullslast&limit=100`)
      .then(queryResults => {
        const results = queryResults.data;
        if (results) {
          this.setState({results});
        }
      });
  }

  handleKeyDown(e) {
    const DOWN_ARROW = 40;
    const UP_ARROW = 38;
    const ENTER = 13;
    const highlighted = document.querySelector(".highlighted");

    if (e.keyCode === ENTER) {
      if (highlighted) {
        window.location = highlighted.querySelector("a").href;
      }
    }

    if (e.keyCode === DOWN_ARROW || e.keyCode === UP_ARROW) {
      if (!highlighted) {
        if (e.keyCode === DOWN_ARROW) {
          document.querySelector(".results-list > li:first-child").classList.add("highlighted");
        }
      }
      else {
        const currentIndex = [].indexOf.call(document.querySelectorAll(".results-list > li"), highlighted);
        if (e.keyCode === DOWN_ARROW && currentIndex < document.querySelectorAll(".results-list > li").length - 1) {
          document.querySelectorAll(".results-list > li")[currentIndex + 1].classList.add("highlighted");
          highlighted.classList.remove("highlighted");
        }
        else if (e.keyCode === UP_ARROW) {
          if (currentIndex > 0) {
            document.querySelectorAll(".results-list > li")[currentIndex - 1].classList.add("highlighted");
          }
          highlighted.classList.remove("highlighted");
        }
      }
    }
  }

  componentDidMount() {
    this._searchInput.focus();
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  render() {
    const {activateSearch} = this.props;

    return (
      <div className="search">
        <button className="search-close" onClick={activateSearch}>
          <i>
            <span className="close-perimeter" />
            <span className="close-x close-back" />
            <span className="close-x close-for" />
          </i>
        </button>
        <div className="search-results">
          <label className="search-result-input">
            <div className="search-mg">
              <div className="search-mg-perimeter" />
              <div className="search-mg-handle" />
            </div>
            <input type="text" ref={el => this._searchInput = el} onChange={this.onChange.bind(this)} />
          </label>
          <ul className="results-list">
            {this.state.results.map(result =>
              <li key={`person_${result.slug}`} className={`result-${result.profile_type}`}>
                <a href={`/profile/${result.profile_type}/${result.slug}`}>{result.name}</a>
                <sub>
                  {result.primary_meta ? <span>{result.primary_meta}</span> : null}
                  {result.secondary_meta ? <span>{result.secondary_meta}</span> : null}
                </sub>
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}

export default Search;

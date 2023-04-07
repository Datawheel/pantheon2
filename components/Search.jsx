import React, { Component } from "react";
import { connect } from "react-redux";
import { strip, trim } from "d3plus-text";
import { Icon, NonIdealState } from "@blueprintjs/core";
import api from "./utils/apiConfig.js";
// import "components/Search.css";

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      query: null,
      showTrending: true,
    };
  }

  onChange(e) {
    const { env } = this.props;
    const userQuery = e.target.value;
    if (userQuery === "") {
      this.showTrending();
      return;
    }
    if (userQuery.length < 3) {
      this.setState({ results: null, showTrending: false });
      return;
    }

    let userQueryCleaned = trim(userQuery).split(" ");
    userQueryCleaned = userQueryCleaned.map(strip);
    const lastItem = userQueryCleaned[userQueryCleaned.length - 1];
    userQueryCleaned[userQueryCleaned.length - 1] = `${lastItem}:*`;
    userQueryCleaned = userQueryCleaned.join("%26");

    api(env)
      .get(
        `/search?document=fts.${userQueryCleaned}&order=weight.desc.nullslast&limit=100`
      )
      .then((queryResults) => {
        const results = queryResults.data;
        if (results.length) {
          this.setState({ results, query: userQuery, showTrending: false });
        } else {
          this.setState({ results: [], query: userQuery, showTrending: false });
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
          document
            .querySelector(".results-list > li:first-child")
            .classList.add("highlighted");
        }
      } else {
        const currentIndex = [].indexOf.call(
          document.querySelectorAll(".results-list > li"),
          highlighted
        );
        if (
          e.keyCode === DOWN_ARROW &&
          currentIndex <
            document.querySelectorAll(".results-list > li").length - 1
        ) {
          document
            .querySelectorAll(".results-list > li")
            [currentIndex + 1].classList.add("highlighted");
          highlighted.classList.remove("highlighted");
        } else if (e.keyCode === UP_ARROW) {
          if (currentIndex > 0) {
            document
              .querySelectorAll(".results-list > li")
              [currentIndex - 1].classList.add("highlighted");
          }
          highlighted.classList.remove("highlighted");
        }
      }
    }
  }

  showTrending = () => {
    const { env } = this.props;
    api(env)
      .get("https://pantheon.world/api/wikiTrends?lang=en&limit=12")
      .then((queryResults) => {
        const results = queryResults.data.map((d) => ({
          name: d.name,
          profile_type: "person",
          primary_meta: d.occupation,
          slug: d.slug,
        }));
        console.log("results", results);
        this.setState({ results, query: "", showTrending: true });
      });
  };

  componentDidMount() {
    this.showTrending();
    this._searchInput.focus();
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  render() {
    const { activateSearch } = this.props;
    const { query, results, showTrending } = this.state;

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
            <React.Fragment>
              <input
                type="text"
                ref={(el) => (this._searchInput = el)}
                onChange={this.onChange.bind(this)}
              />
            </React.Fragment>
          </label>
          {showTrending ? (
            <div className="trending-text">
              <Icon icon="trending-up" iconSize={20} /> Trending Searches...
            </div>
          ) : null}
          {results ? (
            results.length ? (
              <ul className="results-list">
                {results.map((result) => (
                  <li
                    key={`person_${result.slug}`}
                    className={`result-${result.profile_type}`}
                  >
                    <a href={`/profile/${result.profile_type}/${result.slug}`}>
                      {result.name}
                    </a>
                    <sub>
                      {result.primary_meta ? (
                        <span>{result.primary_meta}</span>
                      ) : null}
                      {result.secondary_meta ? (
                        <span>{result.secondary_meta}</span>
                      ) : null}
                    </sub>
                  </li>
                ))}
              </ul>
            ) : (
              <NonIdealState
                icon="search"
                title="No results found"
                description={
                  <div>
                    Unable to find results for &ldquo;<code>{query}</code>
                    &rdquo;.
                  </div>
                }
                action={undefined}
              />
            )
          ) : null}
        </div>
      </div>
    );
  }
}

export default connect((state) => ({ env: state.env }), {})(Search);

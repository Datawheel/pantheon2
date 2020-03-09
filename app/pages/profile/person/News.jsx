import React, {Component} from "react";
import {Icon} from "@blueprintjs/core";
import "pages/profile/person/News.css";

class News extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    const {person, newsArticles} = this.props;
    // console.log("newsArticles[0].results.articles!", newsArticles[0].results.articles, newsArticles[0].results.articles.length);

    return (
      <div className="news-container">
        {newsArticles[0].results.articles.length
          ? <div className="news-articles-list">
            {newsArticles[0].results.articles.map(article =>
              <a href={article.url} className="card" key={article.url} target="_blank" rel="noopener">
                <div className="thumb" style={article.urlToImage ? {backgroundImage: `url('${article.urlToImage}')`} : {}}>
                  {article.source
                    ? <div className="src">{article.source.name}</div>
                    : null}
                </div>
                <div className="info-group">
                  <div className="title">{article.title}</div>
                  <div className="description">{article.description}</div>
                </div>
                <div className="info-footer">
                  {article.author
                    ? <div className="author"><Icon icon="person" iconSize={12} /> {article.author}</div>
                    : null}
                  <div className="date"><Icon icon="calendar" iconSize={12} /> {new Date(article.publishedAt).toLocaleDateString("en-US", {weekday: "long", year: "numeric", month: "long", day: "numeric"})}</div>
                </div>
              </a>
            )}
          </div>
          : null}
      </div>
    );
  }
}

export default News;

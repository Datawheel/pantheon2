import React, {Component} from "react";
import axios from "axios";
import moment from "moment";
import {Icon} from "@blueprintjs/core";
import {formatAbbreviate} from "d3plus-format";
import "pages/profile/person/Twitter.css";
import "pages/profile/person/MemMetrics.css";

class Twitter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: null,
      timeline: []
    };
  }

  componentDidMount = () => {
    const {person} = this.props;
    axios.get(`/api/twit/${person.id}`)
      .then(res => {
        const {data} = res;
        this.setState(data);
      });
  }

  renderTweetDate = twDate => {
    const twMomentDate = moment(twDate, "ddd MMM DD HH:mm:ss Z YYYY");
    const now = new moment();
    const duration = moment.duration(now.diff(twMomentDate));
    return duration.asHours() < 24
      ? twMomentDate.fromNow()
      : twMomentDate.calendar();
  }

  render() {
    const {user, timeline} = this.state;

    return (
      <div>
        {timeline.length
          ? <div className="twitter-section">
            <div className="tw-banner" style={user.profile_banner_url
              ? {backgroundImage: `url('${user.profile_banner_url}')`}
              : {backgroundColor: "#9E978D", height: "100px"}}></div>
            <div className="tw-userinfo">
              <img src={user.profile_image_url} />
              <h3>{user.name} <a href={`https://twitter.com/${user.screen_name}`} target="_blank" rel="noopener noreferrer">@{user.screen_name}</a></h3>
            </div>
            <div className="tw-userstats">
              <ul className="metrics-list">
                <li className="metric"><h4>{formatAbbreviate(user.followers_count)}</h4><p>Followers</p></li>
                <li className="metric"><h4>{formatAbbreviate(user.friends_count)}</h4><p>Following</p></li>
                <li className="metric"><h4>{moment(user.created_at, "ddd MMM DD HH:mm:ss Z YYYY").fromNow()}</h4><p>User Since</p></li>
                <li className="metric"><h4>{formatAbbreviate(user.statuses_count)}</h4><p>Tweets</p></li>
              </ul>
            </div>
            <div className="tw-feed">
              {timeline.map(d =>
                <div className="tweet-outer" key={d.id}>
                  {d.retweeted ? <div className="retweeted"><Icon icon="refresh" iconSize={12} />&nbsp; Retweeted by {user.name}</div> : null}
                  <div className="tweet-body">
                    <img src={d.user.profile_image_url_https} alt="Logo" className="picture" />
                    <div className="body">
                      <div className="inner-body">
                        <div className="name">
                          {d.user.name}
                        </div>
                        <div className="handle">
                          @{d.user.screen_name}
                        </div>
                        <div className="time">
                          {this.renderTweetDate(d.created_at)}
                        </div>
                      </div>
                      <div className="tweet">
                        {d.text}
                      </div>
                      {d.quote
                        ? <div className="tweet-body">
                          <img src={d.quote.user.profile_image_url_https} alt="Logo" className="picture" />
                          <div className="body">
                            <div className="inner-body">
                              <div className="name">
                                {d.quote.user.name}
                              </div>
                              <div className="handle">
                              @{d.quote.user.screen_name}
                              </div>
                              <div className="time">
                                {this.renderTweetDate(d.quote.created_at)}
                              </div>
                            </div>
                            <div className="tweet">
                              {d.quote.text}
                            </div>
                          </div>
                        </div>
                        : null}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <a className="tw-link" href={`https://twitter.com/${user.screen_name}`} target="_blank" rel="noopener noreferrer">View more <Icon icon="share" iconSize={15} /></a>
          </div>
          : null}
      </div>
    );
  }
}

export default Twitter;

const axios = require("axios");
const Twitter = require("twitter-lite");
const twApiKey = process.env.TW_API_KEY;
const twApiSecret = process.env.TW_API_SECRET;

module.exports = function(app) {

  app.get("/api/twit/:uid", async(req, res) => {
    const {uid} = req.params;
    const pantheonData = await axios.get(`https://api.pantheon.world/person?id=eq.${uid}&select=twitter`)
      .then(resp =>
        resp.data.length ? resp.data[0] : []
      ).catch(errors => {
        console.log("ERRORS!", errors);
      });
    if (!pantheonData) {
      return res.json([]);
    }
    const twScreenName = pantheonData.twitter;

    const tw = new Twitter({
      consumer_key: twApiKey,
      consumer_secret: twApiSecret
    });

    const authResponse = await tw.getBearerToken();
    const app = new Twitter({
      bearer_token: authResponse.access_token
    });

    const timelineResp = await app.get("statuses/user_timeline", {
      screen_name: twScreenName,
      count: 5,
      tweet_mode: "extended"
    }).catch(errors => errors);
    if (timelineResp.errors) {
      console.log("[tw timeline api error] ", timelineResp.errors);
      return res.json([]);
    }
    // return res.json(timelineResp);

    const retTimeline = timelineResp.map(d => {
      let quote = false;
      if (d.is_quote_status) {
        quote = {
          retweeted: d.quoted_status.retweeted_status ? true : false,
          created_at: d.quoted_status.retweeted_status && d.quoted_status.retweeted_status.created_at ? d.quoted_status.retweeted_status.created_at : d.quoted_status.created_at,
          id: d.quoted_status.retweeted_status && d.quoted_status.retweeted_status.id ? d.quoted_status.retweeted_status.id : d.quoted_status.id,
          text: d.quoted_status.retweeted_status && d.quoted_status.retweeted_status.full_text ? d.quoted_status.retweeted_status.full_text : d.quoted_status.full_text,
          user: {
            name: d.quoted_status.retweeted_status && d.quoted_status.retweeted_status.user && d.quoted_status.retweeted_status.user.name ? d.quoted_status.retweeted_status.user.name : d.quoted_status.user.name,
            screen_name: d.quoted_status.retweeted_status && d.quoted_status.retweeted_status.user && d.quoted_status.retweeted_status.user.screen_name ? d.quoted_status.retweeted_status.user.screen_name : d.quoted_status.user.screen_name,
            profile_image_url_https: d.quoted_status.retweeted_status && d.quoted_status.retweeted_status.user && d.quoted_status.retweeted_status.user.profile_image_url_https ? d.retweeted_status.user.profile_image_url_https : d.quoted_status.user.profile_image_url_https
          }
        };
      }
      return {
        retweeted: d.retweeted_status ? true : false,
        created_at: d.retweeted_status && d.retweeted_status.created_at ? d.retweeted_status.created_at : d.created_at,
        id: d.retweeted_status && d.retweeted_status.id ? d.retweeted_status.id : d.id,
        text: d.retweeted_status && d.retweeted_status.full_text ? d.retweeted_status.full_text : d.full_text,
        user: {
          name: d.retweeted_status && d.retweeted_status.user && d.retweeted_status.user.name ? d.retweeted_status.user.name : d.user.name,
          screen_name: d.retweeted_status && d.retweeted_status.user && d.retweeted_status.user.screen_name ? d.retweeted_status.user.screen_name : d.user.screen_name,
          profile_image_url_https: d.retweeted_status && d.retweeted_status.user && d.retweeted_status.user.profile_image_url_https ? d.retweeted_status.user.profile_image_url_https : d.user.profile_image_url_https
        },
        quote
      };
    });

    const userResp = await app.get("users/show", {
      screen_name: twScreenName
    }).catch(errors => errors);
    if (userResp.errors) {
      console.log("[tw user api error] ", userResp.errors);
      return res.json([]);
    }

    const retUser = {
      id: userResp.id,
      name: userResp.name,
      screen_name: userResp.screen_name,
      location: userResp.location,
      description: userResp.description,
      url: userResp.url,
      followers_count: userResp.followers_count,
      friends_count: userResp.friends_count,
      listed_count: userResp.listed_count,
      statuses_count: userResp.statuses_count,
      created_at: userResp.created_at,
      favourites_count: userResp.favourites_count,
      profile_background_color: userResp.profile_background_color,
      profile_banner_url: userResp.profile_banner_url,
      profile_image_url: userResp.profile_image_url_https.replace("_normal", "_bigger")
    };

    return res.json({user: retUser, timeline: retTimeline});
  });

};

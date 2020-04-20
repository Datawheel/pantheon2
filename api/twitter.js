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
      count: 3
    }).catch(errors => errors);
    if (timelineResp.errors) {
      console.log("[tw timeline api error] ", timelineResp.errors);
      return res.json([]);
    }

    const retTimeline = timelineResp.map(d => ({
      created_at: d.created_at,
      id: d.id,
      text: d.text,
      user: {
        name: d.user.name,
        screen_name: d.user.screen_name,
        profile_image_url_https: d.user.profile_image_url_https
      }
    }));

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

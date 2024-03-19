const axios = require("axios");
const ytApiKey = process.env.YOUTUBE_API_KEY;

module.exports = function (app) {
  app.get("/api/youtube/:pid", async (req, res) => {
    const { pid } = req.params;
    let errorMsg = "error: unable to find person with this id";
    const pantheonData = await axios
      .get(
        `https://api-dev.pantheon.world/person?id=eq.${pid}&select=name,slug,occupation,youtube`,
        {
          headers: {
            Accept: "application/vnd.pgrst.object+json",
          },
        }
      )
      .then((resp) => resp.data)
      .catch((error) => {
        console.log("[pantheon API errors]", error.response.data);
        return null;
      });
    if (!pantheonData) {
      return res.json({ error: errorMsg });
    }
    if (pantheonData.youtube) {
      return res.json({ youtube: pantheonData.youtube });
    }

    // Note: this key is restricted to Pantheon domains, if you want to use this in your
    // codebase, please generate a key: https://developers.google.com/youtube/v3/docs/
    errorMsg = "error: unable to find youtube video for this person";
    const ytData = await axios
      .get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${pantheonData.name}&maxResults=1&type=video&videoEmbeddable=true&key=${ytApiKey}`
      )
      .then((res) => {
        const vid =
          res.data.items && res.data.items.length ? res.data.items[0] : null;
        return vid;
      })
      .catch((error) => {
        errorMsg =
          error.response &&
          error.response.data &&
          error.response.data.error &&
          error.response.data.error.errors &&
          error.response.data.error.errors.length &&
          error.response.data.error.errors[0].message
            ? error.response.data.error.errors[0].message
            : null;
        return null;
      });
    if (ytData && ytData.id && ytData.id.videoId) {
      const ytId = ytData.id.videoId;
      await axios.patch(
        `https://api-dev.pantheon.world/person?id=eq.${pid}`,
        { youtube: ytId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZGVwbG95In0.Es95xLgTB1583Sxh8MvamXIE-xEV0QsNFlRFVOq_we8",
          },
        }
      );
      return res.json({ youtube: ytId });
    }
    return res.json({ error: errorMsg });
  });
};

const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const Xvfb = require("xvfb");
const screenshot = require("electron-screenshot-service");

module.exports = function(app) {

  app.get("/api/screenshot/:profileType(person|place|occupation|era)/:slug", (req, res) => {
    // res.send(`path: ${req.query.path}`);
    // const url = `${req.headers.origin}${req.query.path}`;
    const {profileType, slug} = req.params;
    const url = `http://localhost:3300/profile/${profileType}/${slug}/screenshot`;
    const width = 1200;
    const height = 630;
    const page = true;
    const delay = 3000;
    // Give the React page time to load
    const xvfb = new Xvfb({timeout: 2000});
    // The ubuntu server requires the startSync command, but it breaks localhost
    const isLocal = ["localhost:3300", "localhost:3000"].includes(req.headers.host);
    if (!isLocal) xvfb.startSync();
    console.log("\n\n", url, "\n\n");
    screenshot({url, width, height, page, delay}).then(img => {
      // Save the image in static/cb_images/username/id_of_codeblock.png
      const folder = `/static/images/screenshots/${profileType}`;
      const folderPath = path.join(process.cwd(), folder);
      const imgPath = path.join(process.cwd(), folder, `${slug}.png`);
      mkdirp(folderPath, err => {
        console.log("mkdir err", err);
        fs.writeFile(imgPath, img.data, err => {
          console.log("fs err", err);
          if (!isLocal) xvfb.stopSync();
          res.sendFile(imgPath);
        });
      });
    });
  });
};

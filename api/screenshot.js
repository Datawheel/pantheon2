const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const Xvfb = require("xvfb");
const screenshot = require("electron-screenshot-service");
const sharp = require("sharp");

/**
 *
 * @param {Date} date1
 * @param {Date} date2
 * Once both Dates have been converted, subtracting the later one from the earlier
 * one returns the difference in milliseconds. The desired interval can then be
 * determined by dividing that number by the corresponding number of milliseconds.
 * For instance, to obtain the number of days for a given number of milliseconds,
 * we would divide by 86,400,000, the number of milliseconds in a day
 * (1000 x 60 seconds x 60 minutes x 24 hours):
 */
function daysBetween(date1, date2) {
  // Get 1 day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;

  // Convert both dates to milliseconds
  const date1Ms = date1.getTime();
  const date2Ms = date2.getTime();

  // Calculate the difference in milliseconds
  const differenceMs = date2Ms - date1Ms;

  // Convert back to days and return
  return Math.round(differenceMs / oneDay);
}

module.exports = function(app) {

  app.get("/api/screenshot/:profileType(person|country|place|occupation|era)/:slug", (req, res) => {
    // res.send(`path: ${req.query.path}`);
    // const url = `${req.headers.origin}${req.query.path}`;
    const {profileType, slug} = req.params;
    // const url = `http://localhost:3300/profile/${profileType}/${slug}/screenshot`;
    const url = `https://pantheon.world/profile/${profileType}/${slug}/screenshot`;
    console.log("[screenshot] ---");
    console.log("[screenshot] url:", url);
    const width = 1200;
    const height = 630;
    const page = true;
    const delay = 6000;
    // Give the React page time to load
    const xvfb = new Xvfb({timeout: delay});
    // The ubuntu server requires the startSync command, but it breaks localhost
    const isLocal = ["localhost:3300", "localhost:3000"].includes(req.headers.host);
    if (!isLocal) xvfb.startSync();

    const folder = `/static/images/screenshots/${profileType}`;
    const folderPath = path.join(process.cwd(), folder);
    const imgPath = path.join(process.cwd(), folder, `${slug}.jpg`);

    try {
      if (fs.existsSync(imgPath)) {
        console.log("[screenshot] file exists, checking if it's out of date...");
        const stats = fs.statSync(imgPath);
        // console.log("stats.mtime", stats.mtime);
        const daysSinceLastGenerated = daysBetween(stats.mtime, new Date());
        if (daysSinceLastGenerated < 30) {
          console.log(`[screenshot] ${daysSinceLastGenerated} days old NOT regenerating.`);
          return res.sendFile(imgPath);
        }
        else {
          console.log(`[screenshot] ${daysSinceLastGenerated} days old, need to regenerate.`);
          return res.status(200).send({msg: `[screenshot] ${daysSinceLastGenerated} days old, need to regenerate.`});
        }
      }
      screenshot({url, width, height, page, delay}).then(img => {
        mkdirp(folderPath, err => {
          if (err) {
            console.error(`mkdirp err: ${err}`);
            return res.status(500).send({error: `making directory err: ${err}`});
          }
          // fs.writeFile(imgPath, img.data, err => {
          //   if (err) {
          //     console.error(`fs.writeFile err: ${err}`);
          //     res.status(500).send({error: `file write err: ${err}`});
          //   }
          //   if (!isLocal) xvfb.stopSync();
          //   console.log(`[screenshot] new screenshot: ${imgPath}`);
          //   res.sendFile(imgPath);
          // });
          sharp(img.data)
          // .png({compressionLevel: 9, force: true, quality: 20})
            .jpeg({force: true, quality: 60})
            .withMetadata()
            .toFile(imgPath, err => {
              if (err) {
                console.error(`fs.writeFile err: ${err}`);
                return res.status(500).send({error: `file write err: ${err}`});
              }
              if (!isLocal) xvfb.stopSync();
              console.log(`[screenshot] new screenshot: ${imgPath}`);
              return res.sendFile(imgPath);
            });
          // .resize(320, 240)
          // .toFile('output.webp', (err, info) => { ... });
        });
      });
    }
    catch (err) {
      console.error(`check if file exists err: ${err}`);
      return res.status(500).send({error: `check if file exists err: ${err}`});
    }
  });
};

const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

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

/**
 * Test...
(async() => {
  const browser = await puppeteer.launch({args: ["--no-sandbox"], defaultViewport: {width: 1920, height: 1080}});
  const page = await browser.newPage();
  await page.goto("https://pantheon.world/profile/person/Leonidas_I/screenshot", {waitUntil: "domcontentloaded"});
  await page.screenshot({path: "Leonidas_I-example_local.png"});

  await browser.close();
})();
*/

module.exports = function(app) {

  app.get("/api/screenshot/:profileType(person|country|place|occupation|era)/:slug", async(req, res) => {
    // get vars from URL
    const {profileType, slug} = req.params;

    // url of screenshot for page being requested
    const url = `https://pantheon.world/profile/${profileType}/${slug}/screenshot`;

    // file path for image to be saved to
    const folder = `/static/images/screenshots/${profileType}`;
    const imgPath = path.join(process.cwd(), folder, `${slug}.jpg`);

    try {

      // this means the file exists so let's check how old it is
      if (fs.existsSync(imgPath)) {
        // fetch creation date from file metadata
        const stats = fs.statSync(imgPath);
        const daysSinceLastGenerated = daysBetween(stats.mtime, new Date());
        // if it's less than 30 days old, leave it be
        if (daysSinceLastGenerated < 30) {
          return res.sendFile(imgPath);
        }
      }

      // since the file doesn't exist OR it is older than 30 days
      // fetch the screenshot the save it to the file system
      const browser = await puppeteer.launch({args: ["--no-sandbox"], defaultViewport: {width: 960, height: 540, deviceScaleFactor: 2}});
      const page = await browser.newPage();
      await page.goto(url, {waitUntil: "networkidle0"});
      await page.screenshot({path: imgPath});
      await browser.close();
      return res.status(200).send({msg: "Screenshot complete."});
    }
    catch (err) {
      console.error(`check if file exists err: ${err}`);
      return res.status(500).send({error: `check if file exists err: ${err}`});
    }
  });

};

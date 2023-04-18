const axios = require("axios");
const CSV_URL = process.env.REACT_APP_GAME_CSV_URL;

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

function csvJSON(csv, delimiter = "\t") {
  const lines = csv.replace(/\r/g, "").split("\n");
  const result = [];
  const headers = lines[0].split(delimiter);

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i]) continue;
    const obj = {};
    const currentline = lines[i].split(delimiter);

    for (let j = 0; j < headers.length; j++)
      obj[headers[j]] = isNumeric(currentline[j])
        ? currentline[j] * 1
        : currentline[j];

    result.push(obj);
  }
  return result;
}

module.exports = function (app) {
  app.get("/api/indexes", async function (req, res, next) {
    const date = req.query.date;
    const data = await axios.get(CSV_URL).then((resp) => resp.data);

    let jsonData = csvJSON(data);

    if (date) {
      jsonData = jsonData.filter((el) => el["0"] === date)[0];
    }

    res.status(200).json(jsonData);
  });
};
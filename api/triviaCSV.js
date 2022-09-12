const axios = require("axios");
const REACT_APP_TRIVIA_GAME = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRHT1BETBC-ma5aSJiyQB3e1zORdHyIwbJfJqu5cRvjT3ACUspj47ktCtajiPPB9w/pub?gid=1095196046&single=true&output=tsv";

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

const shuffleArray = arr => arr
  .map(a => [Math.random(), a])
  .sort((a, b) => a[0] - b[0])
  .map(a => a[1]);

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
  app.get("/api/trivia/getQuestionsCSV", async function (req, res, next) {
    // const date = req.query.date;
    const currDate = new Date();
    const date = `${currDate.getFullYear()}-${currDate.getMonth() + 1}-${currDate.getDate()}`
    const data = await axios.get(REACT_APP_TRIVIA_GAME).then((resp) => resp.data);

    let jsonData = csvJSON(data);
    
    if (date) {
      jsonData = jsonData.filter((el) => el["date"] === date);
    }
    
    const questions = []
    const letters = ["a","b","c","d"];

    jsonData.forEach(function(obj, ind, arr) {
        const random_position = Math.floor(Math.random() * 4);
        const correct_answer_ = letters[random_position];
        const other_answers = [obj[0],obj[1],obj[2]]
        questions.push({
            question: obj.question,
            answer_a: correct_answer_==="a"? obj["correct_answer"] : other_answers.pop(),
            answer_b: correct_answer_==="b"? obj["correct_answer"] : other_answers.pop(),
            answer_c: correct_answer_==="c"? obj["correct_answer"] : other_answers.pop(),
            answer_d: correct_answer_==="d"? obj["correct_answer"] : other_answers.pop(),
            correct_answer: correct_answer_
          });
        
    });
    
    const shuffledQuestions = shuffleArray(questions).slice(0,16).map((q, i) => ({...q, id: i + 1}));
    console.log(shuffledQuestions);
    res.status(200).json(shuffledQuestions);
  });
};

const axios = require("axios");
const REACT_APP_TRIVIA_GAME = process.env.REACT_APP_TRIVIA_GAME;

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

const shuffleArray = arr =>
  arr
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

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = isNumeric(currentline[j])
        ? currentline[j] * 1
        : currentline[j];
    }

    result.push(obj);
  }
  return result;
}

function capitalizeFirstLetter(text) {
  return text[0].toUpperCase() + text.slice(1);
}

module.exports = function (app) {
  // const {db} = app.settings;

  app.get("/api/trivia/getQuestionsCSV", async (req, res) => {
    const currDate = new Date();
    const date = `${currDate.getFullYear()}-${
      currDate.getMonth() + 1
    }-${currDate.getDate()}`;
    const data = await axios.get(REACT_APP_TRIVIA_GAME).then(resp => resp.data);

    let jsonData = csvJSON(data);

    if (date) {
      jsonData = jsonData.filter(el => el.date === date);
    }

    const questions = [];
    const letters = ["a", "b", "c", "d"];

    jsonData.forEach(obj => {
      const random_position = Math.floor(Math.random() * 4);
      const correct_answer_ = letters[random_position];
      const other_answers = [
        capitalizeFirstLetter(obj[0]),
        capitalizeFirstLetter(obj[1]),
        capitalizeFirstLetter(obj[2]),
      ];
      questions.push({
        questionUid: obj.id,
        question: obj.question,
        answer_a:
          correct_answer_ === "a"
            ? capitalizeFirstLetter(obj.correct_answer)
            : other_answers.pop(),
        answer_b:
          correct_answer_ === "b"
            ? capitalizeFirstLetter(obj.correct_answer)
            : other_answers.pop(),
        answer_c:
          correct_answer_ === "c"
            ? capitalizeFirstLetter(obj.correct_answer)
            : other_answers.pop(),
        answer_d:
          correct_answer_ === "d"
            ? capitalizeFirstLetter(obj.correct_answer)
            : other_answers.pop(),
        correct_answer: correct_answer_,
      });
    });
    // str[0].toUpperCase() + str.slice(1)
    const shuffledQuestions = shuffleArray(questions)
      .slice(0, 10)
      .map((q, i) => ({...q, id: i + 1}));
    res.status(200).json(shuffledQuestions);
  });
};

import { Button } from "@blueprintjs/core";

function copyToClipboard(text) {
  let dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}

const Score = ({ answers, questions, gameIdShare }) => {
  // NEED TO SAVE GAME TO DB
  // saveGameDB();

  let resultToShare = "";
  const correctAnswers = answers.filter((answer) => {
    const question = questions.find((question) => question.id === answer.qid);

    if (question.correct_answer === answer.ao) {
      resultToShare = resultToShare + "🟩";
    }

    return question.correct_answer === answer.ao;
  });

  while (resultToShare.length !== 20) {
    resultToShare = resultToShare + "🟥";
  }

  return (
    <h2 key={"triviaResultsDivH2"}>
      Results:
      <span key={"renderScoreAnswers"}>
        {correctAnswers.length.toString()} / {answers.length.toString()} correct
        <br />
        <Button
          key={"buttonShareKey"}
          id="buttonShareKey"
          className="buttonShareKey"
          onClick={() => {
            copyToClipboard(
              "Pantheon Trivia " +
                gameIdShare +
                "\n" +
                resultToShare +
                correctAnswers.length +
                "0%" +
                "\nhttps://pantheon.world/app/trivia" +
                "\n#pantheon #trivia" +
                "\nWhat about you?"
            );
          }}
        >
          Share
        </Button>
      </span>
    </h2>
  );
};

export default Score;

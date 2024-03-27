import {I18nProviderClient} from "/locales/client";
import Trivia from "/components/games/trivia/Trivia";

async function getQuestions() {
  const res = await fetch("https://pantheon.world/api/trivia/getQuestionsCSV");
  return res.json();
}

export default async function Page() {
  const questions = await getQuestions();

  return (
    <I18nProviderClient locale={"en"}>
      <Trivia questions={questions} />
    </I18nProviderClient>
  );
}

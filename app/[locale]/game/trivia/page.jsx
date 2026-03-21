import {I18nProviderClient} from "/locales/client";
import Trivia from "/components/games/trivia/Trivia";

export default function Page() {
  return (
    <I18nProviderClient locale={"en"}>
      <Trivia />
    </I18nProviderClient>
  );
}

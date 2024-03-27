import {I18nProviderClient} from "/locales/client";
import Birthle from "/components/games/birthle/Birthle";

export default async function Page() {
  return (
    <I18nProviderClient locale={"en"}>
      <Birthle />
    </I18nProviderClient>
  );
}

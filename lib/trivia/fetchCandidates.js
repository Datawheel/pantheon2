import {safeFetchArray} from "@/app/utils/safeFetch";
import {isTriviaPersonEligible} from "./exclusions";

/**
 * All trivia person pools (subjects and distractors) must use this fetcher.
 * Filter before shuffling/slicing, including cached API responses, so excluded
 * people never enter selection. Books/movies identify their person with `pid`.
 * Country lookups and details of an already eligible subject can use safeFetchJson.
 */
export async function fetchTriviaCandidates(url, {personIdKey = "id"} = {}) {
  const rows = await safeFetchArray(url);
  return rows.filter((row) => isTriviaPersonEligible(row?.[personIdKey]));
}

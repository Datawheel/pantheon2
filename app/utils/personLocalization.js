import {DEFAULT_LOCALE} from "@/app/locales";
import {REVALIDATE_PERIODS} from "@/app/constants";
import {encodePostgrestList} from "@/app/utils/postgrest";
import {safeFetchJson} from "@/app/utils/safeFetch";

const PERSON_BATCH_SIZE = 100;

function getPersonId(person) {
  const id = person?.person_id ?? person?.id;
  return id === null || id === undefined ? null : `${id}`;
}

/**
 * Localize several groups of person records with one batched lookup. Keeping
 * the groups separate lets callers enrich independent UI sections without
 * mixing their ordering or other section-specific fields.
 */
export async function localizePersonGroups(
  groups,
  locale,
  {
    baseApi,
    revalidate = REVALIDATE_PERIODS.DEFAULT,
  } = {},
) {
  if (
    locale === DEFAULT_LOCALE
    || !baseApi
    || !Array.isArray(groups)
    || groups.every(group => !Array.isArray(group) || !group.length)
  ) {
    return groups;
  }

  const personIds = [...new Set(
    groups
      .flatMap(group => Array.isArray(group) ? group : [])
      .map(getPersonId)
      .filter(Boolean),
  )];

  if (!personIds.length) return groups;

  const localizedPeople = [];
  for (let index = 0; index < personIds.length; index += PERSON_BATCH_SIZE) {
    const batch = personIds.slice(index, index + PERSON_BATCH_SIZE);
    const url = `${baseApi}/person?id=in.(${encodePostgrestList(batch)})&select=id,localized_name:translations->>${locale}`;
    const records = await safeFetchJson(
      url,
      {next: {revalidate}},
      [],
    );
    if (Array.isArray(records)) localizedPeople.push(...records);
  }

  const localizedNameById = new Map(
    localizedPeople
      .filter(person => person.localized_name)
      .map(person => [`${person.id}`, person.localized_name]),
  );

  return groups.map(group => {
    if (!Array.isArray(group)) return group;
    return group.map(person => {
      const localizedName = localizedNameById.get(getPersonId(person));
      return localizedName
        ? {...person, name: localizedName}
        : person;
    });
  });
}

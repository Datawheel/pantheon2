import {PUBLIC_API} from "@/app/constants";

export default async function fetchPersons(slugs) {
  const wrappedAndEncodedSlugs = slugs.map(
    slug => `%22${encodeURIComponent(slug)}%22`
  );
  return fetch(
    `${PUBLIC_API}/person?slug=in.(${wrappedAndEncodedSlugs})`
  )
    .then(res => res.json())
    .then(data =>
      data.map(d => ({
        ...d,
        selected: false,
        imgURL: `https://static.pantheon.world/profile/people/${d.id}.jpg`,
      }))
    );
}

export default async function fetchPersons(slugs) {
  const wrappedAndEncodedSlugs = slugs.map(
    (slug) => `%22${encodeURIComponent(slug)}%22`
  );
  return fetch(
    `https://api.pantheon.world/person?slug=in.(${wrappedAndEncodedSlugs})`
  )
    .then((res) => res.json())
    .then((data) =>
      data.map((d) => ({
        ...d,
        selected: false,
        imgURL: `https://pantheon.world/images/profile/people/${d.id}.jpg`,
      }))
    );
}

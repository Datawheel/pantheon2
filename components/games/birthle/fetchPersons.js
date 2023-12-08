export default async function fetchPersons(slugs) {
  return fetch(`https://api.pantheon.world/person?slug=in.(${slugs})`)
    .then((res) => res.json())
    .then((data) =>
      data.map((d) => ({
        ...d,
        selected: false,
        imgURL: `https://pantheon.world/images/profile/people/${d.id}.jpg`,
      }))
    );
}

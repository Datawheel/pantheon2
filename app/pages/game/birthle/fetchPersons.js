export default async function fetchPersons(slugs) {
  return Promise.all(
    slugs.map((slug) => {
      return fetch(`https://api.pantheon.world/person?slug=eq.${slug}`)
        .then((res) => res.json())
        .then((data) => {
          return {
            id: data[0].id,
            name: data[0].name,
            slug: data[0].slug,
            birthdate: data[0].birthdate,
            birthyear: data[0].birthyear,
            imgURL: `https://pantheon.world/images/profile/people/${data[0].id}.jpg`,
            selected: false,
          };
        });
    })
  );
}

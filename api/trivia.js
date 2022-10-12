const axios = require("axios");
const plural = require("pluralize");

const shuffleArray = arr => arr
  .map(a => [Math.random(), a])
  .sort((a, b) => a[0] - b[0])
  .map(a => a[1]);

module.exports = function(app) {

  app.get("/api/trivia/getQuestions", async(req, res) => {
    const topBiosInOccupation = await axios.get("https://api.pantheon.world/person_ranks?occupation_rank=lt.7&select=id,name,occupation,birthyear,bplace_geonameid,bplace_country,deathyear,dplace_country").then(result => result.data).catch(e => (console.log("[trivia] Pantheon DB Error:", e), {data: []}));
    // return res.json(topBiosInOccupation);
    const ezOccupations = ["ACTOR", "SOCCER PLAYER", "FILM DIRECTOR", "EXPLORER", "COMPOSER", "ASTRONOMER", "COMIC ARTIST", "ARTIST", "MUSICIAN", "SINGER", "ASTRONAUT", "BUSINESSPERSON", "PHILOSOPHER", "INVENTOR"];
    const biosInEZOccupations = topBiosInOccupation.filter(bio => ezOccupations.includes(bio.occupation));
    const randomEZBioIndex = Math.floor(Math.random() * biosInEZOccupations.length);
    const randomEZBio = biosInEZOccupations.splice(randomEZBioIndex, 1)[0]; // Pop the item from the array
    const wrongCountries = [...new Set(biosInEZOccupations.map(d => d.bplace_country))].filter(d => Boolean(d) && d !== randomEZBio.bplace_country);
    const wrongCountry1 = wrongCountries[Math.floor(Math.random() * wrongCountries.length)];
    const wrongCountry2 = wrongCountries[Math.floor(Math.random() * wrongCountries.length)];
    const wrongCountry3 = wrongCountries[Math.floor(Math.random() * wrongCountries.length)];
    const q1 = {
      question: `Where was ${randomEZBio.occupation} ${randomEZBio.name} born?`,
      answer_a: wrongCountry1,
      answer_b: wrongCountry2,
      answer_c: randomEZBio.bplace_country,
      answer_d: wrongCountry3,
      correct_answer: "c"
    };

    // Question 2.
    // Template: Which of the following Musicians died in 1981?
    const kosherOccupations = ["ACTOR", "SOCCER PLAYER", "FILM DIRECTOR", "ARTIST", "MUSICIAN", "SINGER", "INVENTOR"];
    const deadBios = biosInEZOccupations.filter(d => d.deathyear && kosherOccupations.includes(d.occupation));
    let deadBiosInRandomBio2Occupation = [];
    let randomBio2;
    // in case an occupation comes up randomly that has less than 3
    // dead people
    while (deadBiosInRandomBio2Occupation < 3) {
      const randomIndex2 = Math.floor(Math.random() * deadBios.length);
      randomBio2 = deadBios.splice(randomIndex2, 1)[0]; // Pop the item from the array
      deadBiosInRandomBio2Occupation = deadBios.filter(d => d.occupation === randomBio2.occupation);
    }
    // console.log("\nDEAD BIOS:\n", deadBiosInRandomBio2Occupation);
    // console.log("\n----------- end DEAD BIOS\n");
    const q2 = {
      question: `Which of the following ${plural(randomBio2.occupation)} died in ${randomBio2.deathyear}?`,
      answer_a: deadBiosInRandomBio2Occupation[0].name,
      answer_b: deadBiosInRandomBio2Occupation[2].name,
      answer_c: randomBio2.name,
      answer_d: deadBiosInRandomBio2Occupation[1].name,
      correct_answer: "c"
    };

    // Question 3.
    // Template: Where was POLITICIAN Boris Johnson born?
    const biosWithBirthplace = topBiosInOccupation.filter(d => d.bplace_geonameid);
    const randomIndex3 = Math.floor(Math.random() * biosWithBirthplace.length);
    const randomBio3 = biosWithBirthplace.splice(randomIndex3, 1)[0]; // Pop the item from the array
    const randomBio3bplace = await axios.get(`https://api.pantheon.world/place?id=eq.${randomBio3.bplace_geonameid}&select=id,place,country`)
      .then(result => result.data[0])
      .catch(e => (console.log("[trivia] Pantheon DB Error:", e), {data: []}));
    const randomBio3bplaceFalse = await axios.get(`https://api.pantheon.world/place?and=(id.neq.${randomBio3.bplace_geonameid},country.eq.${randomBio3.bplace_country})&select=id,place,country&limit=3`)
      .then(result => result.data)
      .catch(e => (console.log("[trivia] Pantheon DB Error:", e), {data: []}));
    const q3 = {
      question: `Where was ${randomBio3.occupation} ${randomBio3.name} born?`,
      answer_a: `${randomBio3bplaceFalse[0].place}, ${randomBio3bplaceFalse[0].country}`,
      answer_b: `${randomBio3bplaceFalse[1].place}, ${randomBio3bplaceFalse[1].country}`,
      answer_c: `${randomBio3bplaceFalse[2].place}, ${randomBio3bplaceFalse[2].country}`,
      answer_d: `${randomBio3bplace.place}, ${randomBio3bplace.country}`,
      correct_answer: "d"
    };

    // Question 4.
    // Template: Which person of the following were NOT born in New York City?
    const topPlaces = await axios.get("https://api.pantheon.world/place?select=id,place,country&order=num_born.desc&limit=105")
      .then(result => result.data)
      .catch(e => (console.log("[trivia] Pantheon DB Error:", e), {data: []}));
    const randomPlaceIndex = Math.floor(Math.random() * topPlaces.length);
    const randomPlace = topPlaces.splice(randomPlaceIndex, 1)[0]; // Pop the item from the array
    const biosBornInPlace = await axios.get(`https://api.pantheon.world/person?bplace_geonameid=eq.${randomPlace.id}&select=name&order=hpi.desc&limit=3`, {headers: {Prefer: "params=single-object"}})
      .then(result => result.data)
      .catch(e => (console.log("[trivia] Pantheon DB Error:", e), {data: []}));
    const randomOthersNotBornInPlace = topBiosInOccupation.filter(d => d.bplace_geonameid !== randomPlace.id);
    const randomOthersNotBornInPlaceIndex = Math.floor(Math.random() * randomOthersNotBornInPlace.length);
    // return res.json(randomPlace);
    const q4 = {
      question: `Which person of the following were NOT born in ${randomPlace.place}, ${randomPlace.country}?`,
      answer_a: `${biosBornInPlace[0].name}`,
      answer_b: `${biosBornInPlace[1].name}`,
      answer_c: `${biosBornInPlace[2].name}`,
      answer_d: `${randomOthersNotBornInPlace[randomOthersNotBornInPlaceIndex].name}`,
      correct_answer: "d"
    };

    // Question 5.
    // Template: Which of the following Musicians were born in 1981?
    const aliveBios = topBiosInOccupation.filter(d => !d.deathyear);
    const randomIndex5 = Math.floor(Math.random() * aliveBios.length);
    const randomBio5 = aliveBios.splice(randomIndex5, 1)[0]; // Pop the item from the array
    const aliveBiosInRandomBio5Occupation = await axios.get(`https://api.pantheon.world/person?occupation=eq.${randomBio5.occupation}&alive=is.true&id=neq.${randomBio5.id}&select=name&order=hpi.desc&limit=3`)
      .then(result => result.data)
      .catch(e => (console.log("[trivia] Pantheon DB Error:", e), {data: []}));
    const q5 = {
      question: `Which of the following ${plural(randomBio5.occupation)} was born in ${randomBio5.birthyear}?`,
      answer_a: aliveBiosInRandomBio5Occupation[0].name,
      answer_b: aliveBiosInRandomBio5Occupation[2].name,
      answer_c: randomBio5.name,
      answer_d: aliveBiosInRandomBio5Occupation[1].name,
      correct_answer: "c"
    };


    // Question 6.
    // Template: What year was ACTOR Tom Cruise born?
    const topBiosInOccupationBorn20Century = topBiosInOccupation.filter(d => d.birthyear >= 1900);
    const randomIndex1 = Math.floor(Math.random() * topBiosInOccupationBorn20Century.length);
    const randomBio1 = topBiosInOccupationBorn20Century.splice(randomIndex1, 1)[0]; // Pop the item from the array
    const q6 = {
      question: `What year was ${randomBio1.occupation} ${randomBio1.name} born?`,
      answer_a: randomBio1.birthyear,
      answer_b: randomBio1.birthyear + 12,
      answer_c: randomBio1.birthyear - 6,
      answer_d: randomBio1.birthyear - 24,
      correct_answer: "a"
    };

    // Question 7.
    // Template: Which of the following books was written by Stephen King?
    const possibleAuthors = ["Stephen_King", "Thomas_Pynchon", "Haruki_Murakami", "Michael_Chabon", "Ha_Jin", "J._R._R._Tolkien", "Mark_Twain", "Paulo_Coelho", "William_Shakespeare", "Dante_Alighieri", "Homer", "Fyodor_Dostoevsky", "Victor_Hugo", "Franz_Kafka", "Leo_Tolstoy", "Ovid"];
    const possibleAuthorsOrQuery = possibleAuthors.map(author => `slug.eq.${author}`);
    const booksByAuthors = await axios.get(`https://api.pantheon.world/book?or=(${possibleAuthorsOrQuery})&select=slug,title,cover`)
      .then(result => result.data)
      .catch(e => (console.log("[trivia] Pantheon Book Table Query Error:", e), {data: []}));
    const randAuthor = possibleAuthors[Math.floor(Math.random() * possibleAuthors.length)];
    const booksByRandAuthor = shuffleArray(booksByAuthors.filter(b => b.slug === randAuthor));
    const booksNotByRandAuthor = shuffleArray(booksByAuthors.filter(b => b.slug !== randAuthor));
    const q7 = {
      question: `Which of the following books was written by ${randAuthor.replace(/_/g, " ")}?`,
      answer_a: booksNotByRandAuthor[2].title,
      answer_b: booksNotByRandAuthor[0].title,
      answer_c: booksNotByRandAuthor[1].title,
      answer_d: booksByRandAuthor[0].title,
      correct_answer: "d"
    };

    // Question 8.
    // Template: Who played _________ in the 1998 film _______?
    let movieRoles = await axios.get("https://api.pantheon.world/movie?role=not.is.null&select=pid,slug,title,role,release_date&order=rating_count.desc&limit=500")
      .then(result => result.data)
      .catch(e => (console.log("[trivia] Pantheon Movie Table Query Error:", e), {data: []}));
    movieRoles = movieRoles.filter(role => !role.role.includes("Additional Voices"));
    const randRole = movieRoles[Math.floor(Math.random() * movieRoles.length)];
    let wrongMovieRoles = shuffleArray(movieRoles.filter(role => role.slug !== randRole.slug)).slice(0, 10);
    const movieRoleNameQuery = [randRole, ...wrongMovieRoles].map(role => `id.eq.${role.pid}`);
    const movieRoleActorNames = await axios.get(`https://api.pantheon.world/person?or=(${movieRoleNameQuery})&select=slug,name`)
      .then(result => result.data)
      .catch(e => (console.log("[trivia] Pantheon Person Table Movie Role Names Query Error:", e), {data: []}));
    const x = movieRoleActorNames.find(actor => actor.slug === randRole.slug);
    if (!x) {
      return res.json({randRole});
    }
    randRole.name = x.name;
    wrongMovieRoles = wrongMovieRoles.map(role => ({...role, name: movieRoleActorNames.find(actor => actor.slug === role.slug).name}));
    // return res.json({randRole, wrongMovieRoles});
    const q8 = {
      question: `Who played ${randRole.role} in the ${randRole.release_date.substring(0, 4)} movie ${randRole.title}?`,
      answer_a: wrongMovieRoles[0].name,
      answer_b: randRole.name,
      answer_c: wrongMovieRoles[1].name,
      answer_d: wrongMovieRoles[2].name,
      correct_answer: "b"
    };

    // Question 9.
    // "WHICH OF THE FOLLOWING MOVIES DOES NOT FEATURE ACTOR JOHN TRAVOLTA?"
    const mostFamousActors = await axios.get("https://api.pantheon.world/person?occupation=eq.ACTOR&select=slug,name,id&order=hpi.desc&limit=120")
      .then(result => result.data)
      .catch(e => (console.log("[trivia] Pantheon Person Table Most Famous Actors Query Error:", e), {data: []}));
    let randActor;
    let randActorRoles = [];
    while (randActorRoles.length < 3) {
      randActor = mostFamousActors[Math.floor(Math.random() * mostFamousActors.length)];
      randActorRoles = await axios.get(`https://api.pantheon.world/movie?pid=eq.${randActor.id}&role=not.is.null&select=pid,slug,title,role,release_date`)
        .then(result => result.data)
        .catch(e => (console.log("[trivia] Pantheon Movie Table Query Error:", e), {data: []}));
    }
    const q9 = {
      question: `Which of the following movies does not feature actor ${randActor.name}?`,
      answer_a: wrongMovieRoles[3].title,
      answer_b: randActorRoles[0].title,
      answer_c: randActorRoles[1].title,
      answer_d: randActorRoles[2].title,
      correct_answer: "a"
    };

    // return res.json({randActor, randActorRoles});
    const shuffledQuestions = shuffleArray([q1, q2, q3, q4, q5, q6, q7, q8, q9])
      .map((q, i) => ({...q, id: i + 1}));

    return res.json(shuffledQuestions);
  });

};

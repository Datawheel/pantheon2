const axios = require("axios");
const apiKey = process.env.TMDB_API_KEY;

const pgFormatDate = (dateobj) => {
  const year = dateobj.getFullYear();
  const month = `${dateobj.getMonth() + 1}`.replace(
    /(^|\D)(\d)(?!\d)/g,
    "$10$2"
  );
  const day = `${dateobj.getDate()}`.replace(/(^|\D)(\d)(?!\d)/g, "$10$2");
  return `${year}-${month}-${day}`;
};

module.exports = function (app) {
  app.get("/api/movies", async (req, res) => {
    // grab id from query param (if missing return empty array)
    const id = req.query.id;
    if (!id) return res.json([]);

    // try to find person in patheon ID (if missing return empty array)
    const personPantheonResp = await axios
      .get(
        `https://api-dev.pantheon.world/person?id=eq.${id}&select=name,slug,occupation.occupation_name`
      )
      .catch(
        (e) => (
          console.log(`[Movies API]: No Person in DB with id: ${id}`),
          { data: [] }
        )
      );
    if (!personPantheonResp.data.length) return res.json([]);

    // ensure the person is in fact an actor or director (classification could expand in the future)
    const person = personPantheonResp.data[0];
    if (person.occupation !== "ACTOR" && person.occupation !== "FILM DIRECTOR")
      return res.json([]);

    // check if we've already scraped their movies
    const dateobj = new Date();
    dateobj.setDate(dateobj.getDate() - 180);
    const sixMonthsAgo = pgFormatDate(dateobj);
    const moviesFromPantheonDbResp = await axios
      .get(
        `https://api-dev.pantheon.world/movie?pid=eq.${id}&last_fetch=gte.${sixMonthsAgo}`
      )
      .catch(
        (e) => (
          console.log("[Movies API] Error finding movie in db:", e),
          { data: [] }
        )
      );
    if (moviesFromPantheonDbResp.data && moviesFromPantheonDbResp.data.length) {
      return res.json(moviesFromPantheonDbResp.data);
    }

    // in case the person DOES have movies but older than 180 days,
    // delete them and pull in fresh ones
    await axios
      .delete(`https://api-dev.pantheon.world/movie?pid=eq.${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZGVwbG95In0.Es95xLgTB1583Sxh8MvamXIE-xEV0QsNFlRFVOq_we8",
          Prefer: "resolution=merge-duplicates",
        },
      })
      .catch(
        (e) => (
          console.log("[Movies API] DELETE Error in db:", e), { data: [] }
        )
      );

    const movieDbPerson = await axios
      .get(
        `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(
          person.name
        )}&page=1&include_adult=true`
      )
      .then((res) => {
        // console.log("movies search res.data!!", res.data);
        const { data: movieActorSearch } = res;
        if (movieActorSearch.results && movieActorSearch.results.length) {
          return {
            id: movieActorSearch.results[0].id,
            movies: movieActorSearch.results[0].known_for,
          };
        }
      });
    const movieIds = movieDbPerson.movies.map((m) => m.id);
    const movieMediaTypeIds = movieDbPerson.movies.map((m) => [
      m.id,
      m.media_type,
    ]);

    const movieRoles = await axios
      .get(
        `https://api.themoviedb.org/3/person/${movieDbPerson.id}/combined_credits?api_key=${apiKey}&language=en-US`
      )
      .then((res) => {
        // console.log("credits res.data!!", res.data);
        if (res.data) {
          if (person.occupation.id === "FILM DIRECTOR" && res.data.crew) {
            const directedMovies = res.data.crew
              .filter((d) => d.department === "Directing" && d.vote_count)
              .sort(
                (a, b) =>
                  b.vote_average * b.vote_count - a.vote_average * a.vote_count
              )
              .slice(0, 6);
            // console.log("directedMovies!!!", directedMovies);
            return directedMovies;
          } else if (res.data.cast) {
            const knownForMovies = res.data.cast.filter((d) =>
              movieIds.includes(d.id)
            );
            // console.log("knownForMovies!!!", knownForMovies);
            return knownForMovies;
          }
        }
      });
    const tmdbMovieApiUrls = movieMediaTypeIds.map((mtype_id) =>
      axios.get(
        `https://api.themoviedb.org/3/${mtype_id[1]}/${mtype_id[0]}?api_key=${apiKey}&language=en-US`
      )
    );
    const movieData = await axios
      .all(tmdbMovieApiUrls)
      .then(
        axios.spread(
          (...responses) => responses.map((r) => r.data)
          // use/access the results
        )
      )
      .catch((errors) => {
        console.log("ERRORS!", errors);
      });
    // return res.json(movieData);
    const cleanedMovieData = movieData.map((movie) => {
      const roleData = movieRoles.find((role) => role.id === movie.id);
      return {
        pid: id,
        slug: person.slug,
        mid: movie.id,
        title: movie.title || movie.original_name,
        poster: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
        backdrop: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
        role:
          roleData && roleData.character && roleData.character.trim()
            ? roleData.character
            : null,
        overview:
          movie.overview && movie.overview.trim() ? movie.overview : null,
        tagline: movie.tagline && movie.tagline.trim() ? movie.tagline : null,
        genres: movie.genres ? movie.genres.map((g) => g.name) : null,
        release_date: movie.release_date,
        average_rating: movie.vote_average,
        rating_count: movie.vote_count,
        budget: movie.budget || null,
        revenue: movie.revenue || null,
        runtime: movie.runtime || null,
        homepage:
          movie.homepage && movie.homepage.trim() ? movie.homepage : null,
      };
    });

    // UPSERT via "Prefer: resolution=merge-duplicates" header
    const moviePosts = cleanedMovieData.map((movie) =>
      axios
        .post(
          "https://api-dev.pantheon.world/movie?columns=pid,slug,mid,title,poster,backdrop,role,overview,tagline,genres,release_date,average_rating,rating_count,budget,revenue,runtime,homepage",
          movie,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZGVwbG95In0.Es95xLgTB1583Sxh8MvamXIE-xEV0QsNFlRFVOq_we8",
              Prefer: "resolution=merge-duplicates",
            },
          }
        )
        .catch((err) => {
          console.log(
            `[Movies API] unable to post movie by ${person.name} to db.`
          );
          console.log(err);
          return { error: err };
        })
    );
    await Promise.all(moviePosts);
    return res.json(cleanedMovieData);
  });
};

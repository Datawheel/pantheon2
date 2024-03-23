import dayjs from "dayjs";
import SectionLayout from "../common/SectionLayout";
import "./Works.css";

async function getMovies(personId) {
  const res = await fetch(`https://pantheon.world/api/movies?id=${personId}`);
  return res.json();
}

export default async function Books({person, slug, title}) {
  if (!["ACTOR", "COMEDIAN", "FILM DIRECTOR"].includes(person.occupation.id)) {
    return null;
  }
  const movies = await getMovies(person.id);

  return (
    <SectionLayout slug={slug} title={title}>
      <div>
        {movies.length ? (
          <div className="card-list">
            {movies.map(movie => (
              <a
                href={
                  movie.homepage ||
                  `https://www.themoviedb.org/movie/${movie.mid}`
                }
                rel="noopener noreferrer"
                target="_blank"
                className="work-card"
                key={movie.id}
              >
                <div
                  className="thumb"
                  style={
                    movie.poster
                      ? {backgroundImage: `url('${movie.poster}')`}
                      : {}
                  }
                ></div>
                <div className="info-group">
                  <div className="title" title={movie.title}>
                    {movie.title}
                  </div>
                  <div className="subtitle">
                    {person.occupation.id === "FILM DIRECTOR"
                      ? "Director"
                      : movie.role}
                  </div>
                  <div className="description">{movie.overview}</div>
                  <div className="info-group-footer">
                    <span>
                      {movie.release_date
                        ? dayjs(movie.release_date, "YYYY-MM-DD").format(
                            "MMM Do YYYY"
                          )
                        : ""}
                    </span>
                    <span>{movie.average_rating} / 10</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </SectionLayout>
  );
}

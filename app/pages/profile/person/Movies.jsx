import React, {Component} from "react";
import {connect} from "react-redux";
import axios from "axios";
import moment from "moment";
import "pages/profile/person/Works.css";

class Movies extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: []
    };
  }

  componentDidMount = () => {
    const {env, person} = this.props;
    const apiKey = env.TMDB_API_KEY;
    axios.get(`https://api.themoviedb.org/3/search/person?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(person.name)}&page=1&include_adult=true`)
      .then(res => {
        // console.log("movies search res.data!!", res.data);
        const {data: movieActorSearch} = res;
        if (movieActorSearch.results && movieActorSearch.results.length) {
          const movieDbPerson = movieActorSearch.results[0];
          const {id, known_for} = movieDbPerson;
          const knownForIds = known_for.map(d => d.id);
          axios.get(`https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${apiKey}&language=en-US`)
            .then(res => {
              // console.log("credits res.data!!", res.data);
              if (res.data) {
                if (person.occupation.id === "FILM DIRECTOR" && res.data.crew) {
                  const directedMovies = res.data.crew
                    .filter(d => d.department === "Directing" && d.vote_count)
                    .sort((a, b) => b.vote_average * b.vote_count - a.vote_average * a.vote_count)
                    .slice(0, 6);
                  // console.log("directedMovies!!!", directedMovies);
                  this.setState({data: directedMovies});
                }
                else if (res.data.cast) {
                  const knownForMovies = res.data.cast.filter(d => knownForIds.includes(d.id));
                  // console.log("knownForMovies!!!", knownForMovies);
                  this.setState({data: knownForMovies});
                }
              }
            });
        }
      });
  }

  render() {
    const {person} = this.props;
    const {data} = this.state;

    return (
      <div>
        {data.length
          ? <div className="card-list">
            {data.map(movie =>
              <div href="#" className="work-card" key={movie.id}>
                <div className="thumb" style={movie.poster_path ? {backgroundImage: `url('https://image.tmdb.org/t/p/original${movie.poster_path}')`} : {}}>
                </div>
                <div className="info-group">
                  <div className="title" title={movie.title || movie.original_name}>{movie.title || movie.original_name}</div>
                  <div className="subtitle">{
                    person.occupation.id === "FILM DIRECTOR"
                      ? "Director"
                      : movie.character}
                  </div>
                  <div className="description">{movie.overview}</div>
                  <div className="info-group-footer">
                    <span>
                      {movie.release_date || movie.first_air_date
                        ? moment(movie.release_date || movie.first_air_date, "YYYY-MM-DD").format("MMM Do YYYY")
                        : ""}
                    </span>
                    <span>{movie.vote_average} / 10</span>
                  </div>
                </div>
              </div>)
            }
          </div>
          : null}
      </div>
    );
  }
}

export default connect(state => ({env: state.env}), {})(Movies);

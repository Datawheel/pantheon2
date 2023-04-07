import React, {Component} from "react";
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
    const {person} = this.props;
    axios.get(`/api/movies?id=${person.id}`)
      .then(res => {
        const {data} = res;
        this.setState({data});
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
              <a href={movie.homepage || `https://www.themoviedb.org/movie/${movie.mid}`} rel="noopener noreferrer" target="_blank" className="work-card" key={movie.id}>
                <div className="thumb" style={movie.poster ? {backgroundImage: `url('${movie.poster}')`} : {}}>
                </div>
                <div className="info-group">
                  <div className="title" title={movie.title}>{movie.title}</div>
                  <div className="subtitle">{
                    person.occupation.id === "FILM DIRECTOR"
                      ? "Director"
                      : movie.role}
                  </div>
                  <div className="description">{movie.overview}</div>
                  <div className="info-group-footer">
                    <span>
                      {movie.release_date
                        ? moment(movie.release_date, "YYYY-MM-DD").format("MMM Do YYYY")
                        : ""}
                    </span>
                    <span>{movie.average_rating} / 10</span>
                  </div>
                </div>
              </a>)
            }
          </div>
          : null}
      </div>
    );
  }
}

export default Movies;

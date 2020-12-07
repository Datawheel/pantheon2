import React, {Component} from "react";
import axios from "axios";
import moment from "moment";
import "pages/profile/person/Works.css";

class Books extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: []
    };
  }

  componentDidMount = () => {
    const {person} = this.props;

    // fetch books by author
    if (person.occupation.id === "WRITER") {
      axios.get(`/api/books?id=${person.id}`)
        .then(response => {
          if (response.status === 200) console.log("Fetch books successful.");
          this.setState({data: response.data});
        })
        .catch(error => console.log("Fetch books error:", error));
    }
  }

  render() {
    const {person} = this.props;
    const {data} = this.state;

    return (
      <div>
        {data.length
          ? <div className="card-list">
            {data.map(book =>
              <div href="#" className="work-card book" key={book.totle}>
                <div className="thumb" style={book.cover ? {backgroundImage: `url('${book.cover}')`} : {}}>
                </div>
                <div className="info-group">
                  <div className="title" title={book.title}>{book.title}</div>
                  {book.categories
                    ? <div className="subtitle">{book.categories.slice(0, 3).map((category, index) =>
                      <span key={`category_${index}`}>{(index ? ", " : "") + category}</span>
                    )}</div>
                    : null}
                  {book.description
                    ? <div className="description">{book.description}</div>
                    : null}
                  {book.first_published || book.average_rating
                    ? <div className="info-group-footer">
                      <span>{book.first_published}</span>
                      {book.average_rating ? <span>{book.average_rating} / 5</span> : null}
                    </div>
                    : null}
                </div>
              </div>)
            }
          </div>
          : null}
      </div>
    );
  }
}

export default Books;

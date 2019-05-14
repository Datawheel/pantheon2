import React, {Component} from "react";
import api from "apiConfig";
import PersonImage from "components/utils/PersonImage";
import {COLORS_DOMAIN, FORMATTERS} from "types/index";
import {min as D3Min, max as D3Max} from "d3-array";

const PHOTO_WIDTH = 150;
const PHOTO_PADDING = 36;
const ITEMS_TO_LOAD = 12;

class PhotoCarousel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lowerBound: null,
      upperBound: null,
      replacementPeople: []
    };
  }

  scroll(e) {
    // prevent default action (navigating to link)
    e.preventDefault();
    const {me, people, rankAccessor, peopleAll} = this.props;
    const {lowerBound, upperBound, replacementPeople} = this.state;
    // console.log("me, people, rankAccessor", me, people, rankAccessor);

    // determine if user is clicking backward or forward arrow
    const direction = e.target.classList.contains("back") ? -1 : 1;

    // store old offset for comparison with new
    const oldOffset = this.rankList.scrollLeft;

    // modify horizontal scroll position of container
    this.rankList.scrollLeft += PHOTO_WIDTH * direction;
    const newOffset = this.rankList.scrollLeft;

    // load more items if user has reached end (either furthest right or left)
    if (oldOffset === newOffset) {
      const peopleShown = replacementPeople.length ? replacementPeople : people;

      // IF user wants to load more items to the left, decrease lower bound limit
      const newLowerBound = e.target.classList.contains("back")
        ? Math.max(1, D3Min(peopleShown, person => person[rankAccessor]) - ITEMS_TO_LOAD)
        : D3Min(peopleShown, person => person[rankAccessor]);
      if (e.target.classList.contains("back") && lowerBound === newLowerBound) {
        return;
      }
      // IF user wants to load more items to the right, increase upper bound limit
      const newUpperBound = e.target.classList.contains("back") ? D3Max(peopleShown, person => person[rankAccessor]) : D3Max(peopleShown, person => person[rankAccessor]) + ITEMS_TO_LOAD;
      if (!e.target.classList.contains("back") && upperBound === newUpperBound) {
        return;
      }

      console.log("lowerbound, upper", [newLowerBound, newUpperBound]);
      console.log("rankAccessor", rankAccessor);

      // determine filter key
      const filterKey = rankAccessor.replace("_rank_unique", "");

      // determine whether to fetch more people from server or not
      if (peopleAll) {
        console.log("load more:", peopleAll);
        console.log("filterKey", filterKey);
        console.log("lowerbound, upper", [newLowerBound, newUpperBound]);
        const replacementPeopleAll = peopleAll.slice(newLowerBound - 1, newUpperBound - 1);
        const diffxAll = lowerBound - newLowerBound;
        this.setState({replacementPeople: replacementPeopleAll, lowerBound: newLowerBound, upperBound: newUpperBound});
        if (direction > 0) {
          console.log("this.rankList.scrollLeft (b4)", this.rankList.scrollLeft);
          this.rankList.scrollLeft += (PHOTO_WIDTH + PHOTO_PADDING) * 5 - PHOTO_WIDTH / 2;
          console.log("trying to add:", (PHOTO_WIDTH + PHOTO_PADDING) * 5 - PHOTO_WIDTH / 2);
          console.log("this.rankList.scrollLeft (af)", this.rankList.scrollLeft);
        }
        else {
          this.rankList.scrollLeft += (PHOTO_WIDTH + PHOTO_PADDING) * Math.min(7, diffxAll);
        }
      }
      else {
        const datasetFilter = me ? `${filterKey}=eq.${me[filterKey].id}&` : "";
        const morePeopleUrl = `/person?${datasetFilter}${rankAccessor}=gte.${newLowerBound}&${rankAccessor}=lte.${newUpperBound}&select=occupation(*),bplace_country(*),hpi,l,${filterKey}_rank,${rankAccessor},slug,gender,name,id,birthyear,deathyear`;
        console.log("morePeopleUrl", morePeopleUrl);
        api.get(morePeopleUrl).then(newPeopleResults => {
          const replacementPeople = newPeopleResults.data.sort((personA, personB) => personA[rankAccessor] - personB[rankAccessor]);
          // lastly set the offset to the former last item is still in view
          const diffx = lowerBound - newLowerBound;
          this.setState({replacementPeople, lowerBound: newLowerBound, upperBound: newUpperBound});
          if (direction > 0) {
            this.rankList.scrollLeft += (PHOTO_WIDTH + PHOTO_PADDING) * 5 - PHOTO_WIDTH / 2;
          }
          else {
            this.rankList.scrollLeft += (PHOTO_WIDTH + PHOTO_PADDING) * Math.min(7, diffx);
          }
        });
      }
    }
  }

  componentDidMount() {
    const rankMe = this.rankList.querySelector(".rank-me");
    if (rankMe) {
      const myL = rankMe.offsetLeft;
      const myW = rankMe.offsetWidth;
      const listW = this.rankList.offsetWidth;
      this.rankList.scrollLeft = myL + myW / 2 - listW / 2;
    }
  }

  render() {
    const {me, people, rankAccessor} = this.props;
    const {replacementPeople} = this.state;
    const myId = me ? me.id : null;
    const scroll = this.scroll.bind(this);
    const peopleToRender = replacementPeople.length ? replacementPeople : people;

    return (
      <div className="rank-carousel">
        <a className="arrow back" href="#" onClick={scroll}><img className="back" src="/images/ui/tri-left-b.svg" alt="Load previous" /></a>
        <React.Fragment>
          <ul className="rank-list" ref={comp => this.rankList = comp}>
            {peopleToRender.map(person =>
              <li key={`${person.id}`} className={person.id === myId ? "rank-me" : null}>
                <div className="rank-photo" style={{backgroundColor: person.occupation ? COLORS_DOMAIN[person.occupation.domain_slug] : "#efefef"}}>
                  <a href={`/profile/person/${person.slug}/`}>
                    <PersonImage src={`/images/profile/people/${person.id}.jpg`} alt={`Photo of ${person.name}`} fallbackSrc="/images/icons/icon-person.svg" />
                  </a>
                </div>
                <h2><a href={`/profile/person/${person.slug}/`}>{person.name}</a></h2>
                <p className="rank-year">{FORMATTERS.year(person.birthyear)} - {person.deathyear ? `${FORMATTERS.year(person.deathyear)}` : "Present"}</p>
                <p className="rank-year"><strong>HPI:</strong> {FORMATTERS.decimal(person.hpi)}</p>
                {rankAccessor ? <p className="rank-year"><strong>Rank:</strong> {person[rankAccessor]}</p> : null}
              </li>
            )}
          </ul>
        </React.Fragment>
        <a className="arrow forward" href="#" onClick={scroll}><img className="forward" src="/images/ui/tri-right-b.svg" alt="Load previous" /></a>
      </div>
    );
  }
}

export default PhotoCarousel;

import React from "react";
import {Route, IndexRoute} from "react-router";

import App from "containers/App";
import Home from "containers/Home";

// profile components
import Profile from "components/profile/Profile";
import Person from "components/profile/person/Person";
import Place from "components/profile/place/Place";
import Occupation from "components/profile/occupation/Occupation";
import Era from "components/profile/era/Era";

// about components
import About from "components/about/About";
import Vision from "components/about/Vision";
import Methods from "components/about/Methods";
import Team from "components/about/Team";
import Publications from "components/about/Publications";
import DataSources from "components/about/DataSources";
import Contact from "components/about/Contact";

// explore componenets
import Explore from "components/explore/Explore";
import Viz from "components/explore/viz/Viz";
import Rankings from "components/explore/rankings/Rankings";

// data section components
import Data from "components/data/Data";
import Datasets from "components/data/Datasets";
import Api from "components/data/Api";
import Permissions from "components/data/Permissions";
import Faq from "components/data/Faq";

// custom 404 page
import NotFound from "components/NotFound";

/*
 * @param {Redux Store}
 * We require store as an argument here because we wish to get
 * state from the store after it has been authenticated.
 */
export default function checkId() {

  function genRandId(path) {
    let candidates;
    if (path.includes("place")) {
      candidates = ["india", "united_kingdom", "france", "italy", "chile", "brazil", "bulgaria", "rome", "coimbra", "albuquerque", "oslo", "thailand", "indonesia", "shanghai", "st._louis", "cote_d'ivoire_(ivory_coast)", "dallas", "philippines"];
    }
    else if (path.includes("occupation")) {
      candidates = ["architect", "social_activist", "politician", "pilot", "physicist", "biologist", "astronomer", "athlete", "basketball_player", "baseball_player", "chef", "celebrity", "game_designer", "actor", "film_director", "philosopher", "computer_scientist", "snooker", "youtuber"];
    }
    else if (path.includes("person")) {
      candidates = ["joseph_cook", "pope_paschal_ii", "nick_drake", "lewis_carroll", "eddie_irvine", "manfred,_king_of_sicily", "julius_caesar", "john_l._hall", "jenny_lind", "henri_nestle", "raif_badawi", "emma_shapplin", "beyonce", "jim_morrison"];
    }
    else if (path.includes("/era")) {
      candidates = ["scribal", "printing", "newspaper", "radio_and_film", "television", "personal_computer"];
    }
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  function checkForId(nextState, replace) {
    if (!nextState.params.id) {
      const reqestedUrl = nextState.location.pathname;
      const randId = genRandId(reqestedUrl);
      const nextUrl = reqestedUrl.slice(-1) === "/" ? `${reqestedUrl}${randId}` : `${reqestedUrl}/${randId}`;
      return replace({pathname: nextUrl});
    }
    else {
      // make sure it's legal
      return NotFound;
    }
  }


  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home} />

      <Route path="person(/:id)" component={Person} />

      <Route path="explore" component={Explore}>
        <Route path="viz" component={Viz} />
        <Route path="rankings" component={Rankings} />
      </Route>

      <Route path="about" component={About}>
        <Route path="vision" component={Vision} />
        <Route path="methods" component={Methods} />
        <Route path="team" component={Team} />
        <Route path="publications" component={Publications} />
        <Route path="data_sources" component={DataSources} />
        <Route path="contact" component={Contact} />
      </Route>

      <Route path="profile" component={Profile}>
        <Route path="person(/:id)" component={Person} onEnter={checkForId} />
        <Route path="place(/:id)" component={Place} onEnter={checkForId} />
        <Route path="occupation(/:id)" component={Occupation} onEnter={checkForId} />
        <Route path="era(/:id)" component={Era} onEnter={checkForId} />
      </Route>

      <Route path="data" component={Data}>
        <Route path="datasets" component={Datasets} />
        <Route path="api" component={Api} />
        <Route path="permissions" component={Permissions} />
        <Route path="faq" component={Faq} />
      </Route>

      <Route path="*" component={NotFound} status={404} />

    </Route>
  );
}

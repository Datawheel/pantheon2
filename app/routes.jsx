import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from 'containers/App';
import Home from 'containers/Home';

// profile components
import Profile from 'pages/profile/Index';
import Person from 'pages/profile/Person';
import Geo from 'pages/profile/Geo';
import Domain from 'pages/profile/Domain';

// about components
import About from 'pages/about/Index';
import Vision from 'pages/about/Vision';
import Methods from 'pages/about/Methods';
import Team from 'pages/about/Team';
import Publications from 'pages/about/Publications';
import DataSources from 'pages/about/DataSources';
import Resources from 'pages/about/Resources';
import References from 'pages/about/References';
import Contact from 'pages/about/Contact';

// explore componenets
import Explore from 'pages/explore/Index';

// data section components
import Data from 'pages/data/Index';
import Datasets from 'pages/data/Datasets';
import Api from 'pages/data/Api';
import Permissions from 'pages/data/Permissions';
import Faq from 'pages/data/Faq';

/*
 * @param {Redux Store}
 * We require store as an argument here because we wish to get
 * state from the store after it has been authenticated.
 */
export default (store) => {
  const requireAuth = (nextState, replace, callback) => {
    const { user: { authenticated }} = store.getState();
    if (!authenticated) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      });
    }
    callback();
  };

  const redirectAuth = (nextState, replace, callback) => {
    const { user: { authenticated }} = store.getState();
    if (authenticated) {
      replace({
        pathname: '/'
      });
    }
    callback();
  };
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home} />

      <Route path="person(/:id)" component={Person} />

      <Route path="explore" component={Explore} />

      <Route path="about" component={About}>
        <Route path="vision" component={Vision} />
        <Route path="methods" component={Methods} />
        <Route path="team" component={Team} />
        <Route path="publications" component={Publications} />
        <Route path="data_sources" component={DataSources} />
        <Route path="resources" component={Resources} />
        <Route path="references" component={References} />
        <Route path="contact" component={Contact} />
      </Route>

      <Route path="profile" component={Profile}>
        <Route path="person(/:id)" component={Person} />
        <Route path="geo(/:id)" component={Geo} />
        <Route path="domain(/:id)" component={Domain} />
      </Route>

      <Route path="data" component={Data}>
        <Route path="datasets" component={Datasets} />
        <Route path="api" component={Api} />
        <Route path="permissions" component={Permissions} />
        <Route path="faq" component={Faq} />
      </Route>

    </Route>
  );
};

// <Route path="profile/:name/" component={Profile} />

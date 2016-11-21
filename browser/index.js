'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
// import AllPuppiesContainer from './components/all-puppies/AllPuppiesContainer';
// import SinglePuppyContainer from './components/single-puppy/SinglePuppyContainer';
import AppContainer from './containers/AppContainer';
import VerificationContainer from './containers/VerificationContainer';

import store from './store';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
//import { loadPuppies, loadOnePuppy } from './action-creators';


// const onPuppiesEnter = function () {
//   const thunk = loadPuppies();
//   store.dispatch(thunk);
// };

// const onSinglePuppyEnter = function (nextRouterState) {
//   const puppyId = nextRouterState.params.puppyId;
//   const thunk = loadOnePuppy(puppyId);
//   store.dispatch(thunk);
// };

ReactDOM.render(
  <Provider store={store}>
    <div className="container flexbox-container">
      <div className="jumbotron">
        <Router history={browserHistory}>
          <Route path="/">
            <Route path="login" component={AppContainer} />
            <Route path="verification" component={VerificationContainer} />
            <IndexRoute component={AppContainer}/>
          </Route>
        </Router>
      </div>
    </div>
  </Provider>,
  document.getElementById('app')
);
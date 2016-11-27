'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
// import AllPuppiesContainer from './components/all-puppies/AllPuppiesContainer';
// import SinglePuppyContainer from './components/single-puppy/SinglePuppyContainer';
import AppContainer from './containers/AppContainer';
import {SendVerificationContainer} from './containers/VerificationContainer';
import {VerifyContainer} from './containers/VerificationContainer';
import DashboardContainer from './containers/DashboardContainer';
import AdminContainer from './containers/AdminContainer';
import AddMission from './components/AddMission';
import EditMissionsContainer from './containers/EditMissionsContainer';
import EditChallengesContainer from './containers/EditChallengesContainer';
import injectTapEventPlugin from 'react-tap-event-plugin';
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
injectTapEventPlugin();

ReactDOM.render(
  <Provider store={store}>
    <div className="container flexbox-container">
      <div>
        <Router history={browserHistory}>
          <Route path="/">
            <Route path="login" component={AppContainer} />
            <Route path="sendVerification" component={SendVerificationContainer} />
            <Route path="verify" component={VerifyContainer} />
            <Route path="dashboard" component={DashboardContainer}/>
            <Route path="admin" component={AdminContainer}>
              <Route path="editChallenge" component={EditChallengesContainer}/>
              <Route path="editMission" component={EditMissionsContainer}/>
            </Route>
            <IndexRoute component={AppContainer}/>
          </Route>
        </Router>
      </div>
    </div>
  </Provider>,
  document.getElementById('app')
);
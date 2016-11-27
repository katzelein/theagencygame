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

// Adding Material-UI

import injectTapEventPlugin from 'react-tap-event-plugin';
import agencyBaseTheme from 'material-ui/styles/baseThemes/agencyBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Paper from 'material-ui/Paper'


import { Grid } from 'react-flexbox-grid/lib/index'



ReactDOM.render(
  <MuiThemeProvider muiTheme={getMuiTheme(agencyBaseTheme)}>
    <Provider store={store}>
      <Grid>
        <Paper>
          <Router history={browserHistory}>
            <Route path="/">
              <Route path="login" component={AppContainer} />
              <Route path="sendVerification" component={SendVerificationContainer} />
              <Route path="verify" component={VerifyContainer} />
              <Route path="dashboard" component={DashboardContainer}/>
              <Route path="admin" component={AdminContainer}>
                <Route path="addMission" component={AddMission}/>
              </Route>
              <IndexRoute component={AppContainer}/>
            </Route>
          </Router>
        </Paper>
      </Grid>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('app')
);
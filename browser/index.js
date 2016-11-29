'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import AppContainer from './containers/AppContainer';
import {SendVerificationContainer} from './containers/VerificationContainer';
import {VerifyContainer} from './containers/VerificationContainer';
import DashboardContainer from './containers/DashboardContainer';
import AdminContainer from './containers/AdminContainer';
import EditMissionsContainer from './containers/EditMissionsContainer';
import EditChallengesContainer from './containers/EditChallengesContainer';
import injectTapEventPlugin from 'react-tap-event-plugin';
import store from './store';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
// Adding Material-UI
import agencyBaseTheme from 'material-ui/styles/baseThemes/agencyBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Paper from 'material-ui/Paper'


import { Grid, Row, Col } from 'react-flexbox-grid/lib/index'


injectTapEventPlugin();


ReactDOM.render(

  <MuiThemeProvider muiTheme={getMuiTheme(agencyBaseTheme)}>
    <Provider store={store}>
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
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('app')
);
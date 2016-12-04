'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import store from './store';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';


import AppContainer from './containers/AppContainer';
import { SendVerificationContainer, VerifyContainer } from './containers/VerificationContainer';
import DashboardContainer from './containers/DashboardContainer';
import AdminContainer from './containers/AdminContainer';
import EditMissionsContainer from './containers/EditMissionsContainer';
import EditChallengesContainer from './containers/EditChallengesContainer';



// Adding Material-UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { grey800, amberA700, grey400, amberA400, grey600, amberA100, fullWhite } from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';
import Paper from 'material-ui/Paper';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';

// setting up custom Material-UI theme through darkBaseTheme
const muiTheme = getMuiTheme({
  palette: {
    primary1Color: grey400,
    primary2Color: amberA700,
    primary3Color: grey400,
    accent1Color: amberA400,
    accent2Color: grey800,
    accent3Color: amberA100,
    textColor: fullWhite,
    secondaryTextColor: fade(fullWhite, 0.7),
    alternateTextColor: '#303030',
    canvasColor: '#303030',
    borderColor: fade(fullWhite, 0.3),
    disabledColor: fade(fullWhite, 0.3),
    pickerHeaderColor: fade(fullWhite, 0.12),
    clockCircleColor: fade(fullWhite, 0.12)
  }
});


ReactDOM.render(

  <MuiThemeProvider muiTheme={muiTheme}>
    <Provider store={store}>
      <Grid fluid>
        <Paper style={{position: 'absolute', top: 0, bottom: 0, overflow: 'auto', width: '100%'}}>
          <Router history={browserHistory}>
            <Route path="/">
              <IndexRoute component={AppContainer}/>
              <Route path="login" component={AppContainer} />
              <Route path="sendVerification" component={SendVerificationContainer} />
              <Route path="verify" component={VerifyContainer} />
              <Route path="dashboard" component={DashboardContainer}/>
              <Route path="admin" component={AdminContainer}>
                <Route path="editChallenge" component={EditChallengesContainer}/>
                <Route path="editMission" component={EditMissionsContainer}/>
              </Route>
            </Route>
          </Router>
        </Paper>
      </Grid>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('app')
);

import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import axios from 'axios';

import {Grid, Row, Col} from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardText, CardHeader, CardTitle} from 'material-ui/Card'
import Toggle from 'material-ui/Toggle'
import DashboardMission from './DashboardMission'

const styles = {
  card: {
    margin: 20,
    padding: 10,
    textAlign: 'left'
  },
  paper: {
    height: 500,
    width: 800,
    margin: 20
  },
};


export default class Dashboard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };

    this.logout = this.logout.bind(this)
    this.handleExpand = this.handleExpand.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.handleExpandChange = this.handleExpandChange.bind(this)
    this.handleReduce = this.handleReduce.bind(this)
  }

  componentDidMount () {
    this.props.findUser()
  }

  logout(){
    this.props.logoutUser()
    axios.post('/api/logout')
    .then(res => {
      console.log("logout res: ", res)
      browserHistory.push('/')
    })
  }

  handleExpandChange (expanded) {
    this.setState({expanded: expanded});
  };

  handleToggle (event, toggle) {
    this.setState({expanded: toggle});
  };

  handleExpand () {
    this.setState({expanded: true});
  };

  handleReduce () {
    this.setState({expanded: false});
  };


  render () {
    let missions = this.props.user.userMissions || []
    let user = this.props.user.user || ''
    let challenges = this.props.user.userChallenges || []
    return (
      <div id="main">
          
              {user ? (
                <div id="dashboard">
                  <h1 className="dashboardHeader">Agency Dashboard</h1>
                  <h5 className="dashboardHeader">Completed Missions</h5>   
                  {
                    missions.map(function (mission) {
                      return (
                        <DashboardMission missions={this.props.user.userMissions} challenges={this.props.user.userChallenges} />
                      )
                    })
                  }

                  <div>
                    <RaisedButton style={{margin: 10}} secondary={true} label="Logout" onClick={this.logout} />
                  </div>

                  {user.isAdmin ?
                    (
                      <div>
                        <Link to="/admin">
                          <RaisedButton style={{margin: 10}} secondary={true} label="Admin Page" onClick={this.logout} />
                        </Link>
                      </div>
                    ) :
                    null   
                  } 

                </div>

              ) : (
                <div id="blocked">
                  <Link to="/">
                    <RaisedButton style={{margin: 10}} secondary={true} label="Access Denied" onClick={this.logout} />
                  </Link>
                </div>
              )
            }
      </div>
    );
  }
}
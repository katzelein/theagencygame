import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';

import { Grid, Row, Col } from 'react-flexbox-grid/lib/index'
import RaisedButton from 'material-ui/RaisedButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import { amberA700, amberA400, amberA200 } from 'material-ui/styles/colors'
import Paper from 'material-ui/Paper';

import EditMissionsContainer from '../containers/EditMissionsContainer'
import EditChallengesContainer from '../containers/EditChallengesContainer'
import SvgIconDashboard from 'material-ui/svg-icons/action/dashboard';
import Avatar from 'material-ui/Avatar'

const styles = {
  paper: {
    margin: 30,
    padding: 10
  },
  table: {
    margin: 20,
    width: 900,
  },
  raisedButton: {
    margin: 20
  },
  chip: {
    margin: 'auto',
  },
};

export default class Admin extends Component {

  constructor() {
    super();
    this.state = {
      value: "missions"
    }
    this.handleChange.bind(this)
  }

  handleChange (value) {
    this.setState({
      value: value,
    })
  }

  componentDidMount () {
   this.props.findUser()
  }

  render () {
    console.log("admin component: ", this.props.user)
    return (
      <div style={{height: '100%', width: '100%', backgroundColor: 'black'}}>
      <Grid>
        <Row>
          <Col lg={12}>
            <Row left="lg">
              {/* {this.props.user.user && this.props.user.user.isAdmin ? ( */}
                <div>
                <div>
                <span className="console"/>
                </div>
                <div>
                <span className="console1"/>
                </div>
                </div>
            </Row>
          </Col>     
        </Row>
      </Grid>
      </div>
    );
  }
}
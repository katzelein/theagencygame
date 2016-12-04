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

  render () {
    return (
      <div style={{height: '100%', width: '100%', backgroundColor: 'black'}}>
      <Grid id="myGrid" style={{margin: '0px 0px 0px 30px'}}>
        <Row id="myFirstRow" start="lg">
          <Col id="myCol" start="lg">
            <Row id="myRow" start="lg">
              {/* {this.props.user.user && this.props.user.user.isAdmin ? ( */}
                <div style={{margin: '30px 0px 0px 0px'}}>
                <div>
                <span className="preConsole">Agency:covert_ops host$ </span>
                <span className="console"></span>
                </div>
                <div style={{margin: "20px 0px 0px 0px"}}>
                <Link id="enter" to="login"> ENTER </Link>
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
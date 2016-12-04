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

export default class Splash extends Component {

  constructor() {
    super();
  }


  componentDidMount () {

  }

  render () {

    return (
      <div style={{height: '100%', width: '100%', backgroundColor: 'black'}}>
      <Grid>
        <Row>
          <Col lg={12}>
            <Row center="lg">
              {/* {this.props.user.user && this.props.user.user.isAdmin ? ( */}
                <p id="src1">
&lt;TEST&gt;&013;&010;&nbsp;
</p>
<p id="src2">
&lt;THIS&gt; 
</p>
{/*<p id="src3">
&lt;OUT&gt; 
</p>
<p id="src4">
&lt;NOW&gt; 
</p>*/}

<p id="typed-paragraph">
<div id="target1" className="target1"></div>
<span id="target2" className="target2"></span>
<span id="typed-cursor">|</span>
</p>



            </Row>
          </Col>     
        </Row>
      </Grid>
      </div>
    );
  }
}
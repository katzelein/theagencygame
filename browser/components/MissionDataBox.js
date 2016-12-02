import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import axios from 'axios';

import {Grid, Row, Col} from 'react-flexbox-grid';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardText, CardHeader, CardTitle} from 'material-ui/Card'
import Toggle from 'material-ui/Toggle';
import {grey800, amberA700, grey400, amberA400, grey600, amberA100, fullWhite} from 'material-ui/styles/colors'
import SvgIconBlur from 'material-ui/svg-icons/image/blur-circular';

export default class MissionDataBox extends Component {

  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div id="missionDataBox">
          {
            this.props.userChallenges.map(challenge => (
              <div key={challenge.id}>
                <Grid>
                  <Row>
                    <Col>
                      <Card style={{width: 600}}>
                        <CardHeader
                          title={challenge.objective}
                          style={{margin: 20, fontSize: 20}}
                          avatar={<SvgIconBlur />} />
                        <CardText style={{margin: 30, fontSize: 14, color: amberA700}}>
                          {challenge.summary}
                        </CardText>
                      </Card>
                    </Col>
                  </Row>
                </Grid>
              </div>
            ))
          }
      </div>
    );
  }
}
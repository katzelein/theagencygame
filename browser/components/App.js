import React, { Component } from 'react';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton'
import {Grid, Row, Col} from 'react-flexbox-grid'
import Paper from 'material-ui/Paper'


export default class App extends Component {

  componentDidMount () {
   
  }

  render () {
    return (
      <div id="background">
        <Grid>
          <Row>
            <Col xs={12}>
              <Paper style={{width: 1500, minHeight: 500}}>
                <Row center="xs" middle="xs">
                  <Col>
                    <Link to="/sendVerification">
                      <FlatButton label="The Agency"/>
                    </Link>
                  </Col>
                </Row>          
              </Paper>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
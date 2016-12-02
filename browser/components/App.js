import React, { Component } from 'react';
import { Link } from 'react-router';

import { Grid, Row, Col } from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';
import Fingerprint from 'material-ui/svg-icons/action/fingerprint'

export default class App extends Component {

  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <Row center="xs">
              <h3>The Agency</h3>
            </Row>
            <br />  
            <Row center="xs">
              <RaisedButton 
                type="submit"
                style={{float: 'center'}}
                icon={<Fingerprint />}
                label="Request Verification" 
                secondary={true}
                href="/sendVerification" />
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }
}

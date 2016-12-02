import React, { Component } from 'react';
import { Link } from 'react-router';

import { Grid, Row, Col } from 'react-flexbox-grid/lib/index'
import RaisedButton from 'material-ui/RaisedButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import { amberA700, amberA400, amberA200 } from 'material-ui/styles/colors'

import EditMissionsContainer from '../containers/EditMissionsContainer'
import EditChallengesContainer from '../containers/EditChallengesContainer'

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
      <Grid>
        <Row>
          <Col xs={12}>
            <Row center="xs">
              {/* {this.props.user.user && this.props.user.user.isAdmin ? ( */}
                <div>
                <h3>Admin Page</h3>
                <div className="adminContainer">
                  <Tabs
                    style={{maxHeight: 800}}
                    value={this.state.value}
                    onChange={e => this.handleChange(e)}>
                    <Tab 
                      label="View/Edit Mission" 
                      value="missions" >
                      <EditMissionsContainer/> 
                    </Tab>
                    <Tab 
                      label="View/Edit Challenges" 
                      value="order">
                      <EditChallengesContainer/> 
                    </Tab>
                  </Tabs>
                </div>
                </div>


              {/* }) : ( 
                 <div className="adminContainer">You do not have permission to access this page, please contact and administrator</div>
                ) */} 
            </Row>
          </Col>     
        </Row>
      </Grid>
    );
  }
}
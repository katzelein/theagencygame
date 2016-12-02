import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';

import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';

import Avatar from 'material-ui/Avatar'
import { amberA700, amberA400, amberA200 } from 'material-ui/styles/colors'
import Paper from 'material-ui/Paper';
import { Tabs, Tab } from 'material-ui/Tabs';
import SvgIconDashboard from 'material-ui/svg-icons/action/dashboard';

import EditMissionsContainer from '../containers/EditMissionsContainer';
import EditChallengesContainer from '../containers/EditChallengesContainer';


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

  constructor(props) {
    super(props);

    this.state = {
      value: 'missions'
    };
    this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState({
      value: value,
    });
  }

  componentDidMount() {
    this.props.findUser();
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <Row center="xs">
              {this.props.user && this.props.user.isAdmin ? (
                <div>
                <h3>Admin Page</h3>
                <Paper style={styles.paper} zDepth={5}>
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
                </Paper>
                {/*<button style={{backgroundColor:'transparent', border: 'none'}}>*/} <Avatar style={{'margin-bottom': '40px', cursor: 'pointer'}} onClick={() => {browserHistory.push('/dashboard')}} color="#444" icon={<SvgIconDashboard hoverColor={amberA700}/>} />
                </div>
              ) : ( 
                <div className="adminContainer">Access Denied. <Link to="/">Try again.</Link></div>
              )}
            </Row>
          </Col>     
        </Row>
      </Grid>
    );
  }
}

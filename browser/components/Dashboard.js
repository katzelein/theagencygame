import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import axios from 'axios';
import MissionDataBox from './MissionDataBox'

import { Grid, Row, Col } from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
import SvgIconFace from 'material-ui/svg-icons/action/assignment-ind';
import SvgIconWork from 'material-ui/svg-icons/action/work';
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

export default class Dashboard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      data: false
    };
    this.handleChange.bind(this)
    this.logout = this.logout.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleChange(event) {
    this.setState({
      height: event.target.value
    });
  }

  handleOpen() {
    this.setState({ open: true })
  }

  handleClose() {
    this.setState({ open: false })
  }

  componentDidMount() {
    this.props.findUser()
    this.props.findUserData()
    this.setState({
      data: true
    })
  }

  logout() {
    this.props.logoutUser()
    axios.post('/api/logout')
      .then(res => {
        console.log("logout res: ", res)
        browserHistory.push('/')
      })
  }

  render() {

    const actions = [
      <FlatButton
        label="OK"
        primary={true}
        onTouchTap={this.handleClose}
      />,
    ];

    return (
      <div id="main">
        <Grid>
          <Row>
            <Col xs={12}>
              <Row center="xs">
                <div id="dashboard">
                  {this.props.user.id ? (
                    <div>
                      <div>
                        <Paper style={styles.paper} zDepth={5}>
                          <Avatar color="#444" icon={<SvgIconWork />} />
                          <h1>DOSSIER</h1>
                          <Chip
                            style={styles.chip} >
                              <Avatar color="#444" icon={<SvgIconFace />} />
                              {this.props.user.username}
                          </Chip>
                          <Table style={styles.table} selectable={false} >
                            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                              <TableRow>
                                <TableHeaderColumn colSpan={1} >ID</TableHeaderColumn>
                                <TableHeaderColumn colSpan={4} >Title</TableHeaderColumn>
                                <TableHeaderColumn colSpan={2} >Location</TableHeaderColumn>
                                <TableHeaderColumn colSpan={2} >Status</TableHeaderColumn>
                                <TableHeaderColumn style={{textAlign: 'center'}} colSpan={2} >Actions</TableHeaderColumn>
                              </TableRow>
                            </TableHeader>

                            <TableBody
                              displayRowCheckbox={false}
                              deselectOnClickaway={true}
                              showRowHover={true} 
                              adjustForCheckbox={false}>

                              {this.props.userData ? (
                                this.props.userData.map(row => (
                                  <TableRow key={row.missionId}>
                                    <TableRowColumn colSpan={1} >{row.missionId}</TableRowColumn>
                                    <TableRowColumn colSpan={4} >{row.mission.title}</TableRowColumn>
                                    <TableRowColumn colSpan={2} >{row.mission.place}</TableRowColumn>
                                    <TableRowColumn colSpan={2} >{row.status}</TableRowColumn>
                                    <TableRowColumn colSpan={2} >

                                      <RaisedButton 
                                        label="Challenges"
                                        primary={true} 
                                        onTouchTap={this.handleOpen} />
                                      <Dialog
                                        title="Challenges"
                                        actions={actions}
                                        modal={false}
                                        open={this.state.open}
                                        onRequestClose={this.handleClose}
                                        autoScrollBodyContent={true} >
                                          <MissionDataBox styl={{margin: 20}} userMission={row} userChallenges={row.mission.challenges}/>
                                      </Dialog>
                                    </TableRowColumn>
                                  </TableRow>
                                ))) : (
                                  <TableRow>
                                    <TableRowColumn style={{textAlign: 'center'}} colSpan={11}> No data to display for this agent</TableRowColumn>
                                  </TableRow>
                                )}

                            </TableBody>
                          </Table>

                          <div >
                            <RaisedButton 
                              secondary={true} 
                              label="Logout" 
                              onClick={this.logout} 
                              style={styles.raisedButton}/>
                          </div>
                        </Paper>
                      </div>

                      {this.props.user && this.props.user.isAdmin ?
                        (
                          <div>
                            <RaisedButton 
                              href='/admin' 
                              primary={true} 
                              label="Admin Page"
                              style={styles.raisedButton}/>
                          </div>
                        ) : null   
                      }           
                    </div>
                  ) : (
                    <div> Access Denied. <Link to="/">Try again.</Link></div>
                  )
                }
                </div>
              </Row>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

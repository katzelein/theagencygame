import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import axios from 'axios';

import {Grid, Row, Col} from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
  from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  paper: {
    margin: 30,
  },
  table: {
    margin: 20,
  },
  raisedButton: {
    margin: 20
  }
};

const tableData = [
  {
    status: 'completed',
    id: '27',
    title: 'Grace Hopper and the Missing Bone',
    numChallenges: '5',
    place: 'Grace Hopper Academy'
  },
  {
    status: 'completed',
    id: '4',
    title: 'Intrigue on Wall Street',
    numChallenges: '3',
    place: 'Wall Street'
  },
  {
    status: 'completed',
    id: '3',
    title: 'The Dark Underbelly of Broadway\'s Bright Lights',
    numChallenges: '4',
    place: 'Broadway'
  },
  {
    status: 'completed',
    id: '19',
    title: 'Fullstack\'s Disappearing Cereal',
    numChallenges: '2',
    place: 'Fullstack Academy'
  },
  {
    status: 'completed',
    id: '16',
    title: 'In the Shadow of the World Trade Center',
    numChallenges: '6',
    place: 'World Trade Center'
  },
  {
    status: 'completed',
    id: '31',
    title: 'Disappearance in Port Authority',
    numChallenges: '4',
    place: 'NYC Metro'
  },
  {
    status: 'incomplete',
    id: '9',
    title: 'The Case of the Closed Subway Station',
    numChallenges: '5',
    place: 'NYC Metro'
  },
];

export default class Dashboard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectable: true,
    };

    this.handleToggle.bind(this)
    this.handleChange.bind(this)
    this.logout = this.logout.bind(this)
  }

  handleToggle (event, toggled) {
    this.setState({
      [event.target.name]: toggled,
    });
  }

  handleChange (event) { 
    this.setState({
      height: event.target.value
    });
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

  render () {
    return (
      <div id="main">
        <Grid>
          <Row>
            <div id="dashboard">
                {this.props.user.id ? (
                  <div>
                    <div>
                      <Paper style={styles.paper} zDepth={5}>
                        <h1>DOSSIER</h1>
                        <h4>Agent: {this.props.user.username}</h4>
                        <h4>Phone: {this.props.user.phoneNumber}</h4>
                        <Table style={styles.table} >
                          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                              <TableHeaderColumn colSpan={1} >ID</TableHeaderColumn>
                              <TableHeaderColumn colSpan={4} >Title</TableHeaderColumn>
                              <TableHeaderColumn colSpan={2} >Location</TableHeaderColumn>
                              <TableHeaderColumn colSpan={1} >Challenges</TableHeaderColumn>
                              <TableHeaderColumn colSpan={2} >Status</TableHeaderColumn>
                            </TableRow>
                          </TableHeader>

                          <TableBody
                            displayRowCheckbox={false}
                            deselectOnClickaway={true}
                            showRowHover={true} 
                            adjustForCheckbox={false}>

                            {tableData.map( (row, index) => (
                              <TableRow key={index} onCellClick={(e) => {e.PreventDefault()}}>
                                <TableRowColumn colSpan={1} >{row.id}</TableRowColumn>
                                <TableRowColumn colSpan={4} >{row.title}</TableRowColumn>
                                <TableRowColumn colSpan={2} >{row.place}</TableRowColumn>
                                <TableRowColumn colSpan={1} >{row.numChallenges}</TableRowColumn>
                                <TableRowColumn colSpan={2} >{row.status}</TableRowColumn>
                              </TableRow>
                            ))}

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
                            onClick={this.logout} 
                            style={styles.raisedButton}/>
                        </div>
                      ) : null   
                    }           
                  </div>
                ) : (
                  <div> Please <Link to="/">log in</Link> to view your dashboard </div>
                )
              }
            </div>
          </Row>
        </Grid>
      </div>
    );
  }
}
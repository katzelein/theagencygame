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
    // height: 100,
    // width: 800,
    textAlign: 'center',
    display: 'inline-block',
  },
  table: {
    margin: 20,
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
      fixedHeader: true,
      fixedFooter: true,
      stripedRows: false,
      showRowHover: false,
      selectable: true,
      multiSelectable: false,
      enableSelectAll: false,
      deselectOnClickaway: true,
      showCheckboxes: true,
      height: '300px',
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
    console.log("DASHBOARD USER: ", this.props.user)
    return (
      <div id="main">
        <Grid>
          <Row>
          <Col xs={12}>
            <Row center="xs">
          <div id="dashboard" >
              {this.props.user.id ? (
                <div>
                  <div>
                   <Paper style={{margin: 30}} zDepth={5}>
                      <h1>DASHBOARD</h1>
                      <Table style={styles.table} >
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                          <TableRow>
                            <TableHeaderColumn colSpan={10} style={{textAlign: 'center', fontSize: 26}}>
                              {this.props.user.username}
                            </TableHeaderColumn>
                          </TableRow>

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

                      <div ><RaisedButton secondary={true} label="Logout" onClick={this.logout} style={{margin: 20}}/></div>
                    </Paper>
                  </div>

                  {this.props.user && this.props.user.isAdmin ?
                    (
                      <div>
                        <RaisedButton href='/admin' primary={true} label="Admin Page" onClick={this.logout} style={{margin: 20}}/>
                      </div>
                    ) :
                    null   
                  }           
                </div>
              ) : (
                <div> Please <Link to="/">log in</Link> to view your dashboard </div>
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
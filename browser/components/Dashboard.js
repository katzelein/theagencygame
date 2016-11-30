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
  }
};

const tableData = [
  {
    name: 'John Smith',
    status: 'Employed',
    selected: true,
  },
  {
    name: 'Randal White',
    status: 'Unemployed',
  },
  {
    name: 'Stephanie Sanders',
    status: 'Employed',
    selected: true,
  },
  {
    name: 'Steve Brown',
    status: 'Employed',
  },
  {
    name: 'Joyce Whitten',
    status: 'Employed',
  },
  {
    name: 'Samuel Roberts',
    status: 'Employed',
  },
  {
    name: 'Adam Moore',
    status: 'Employed',
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
          <div id="dashboard" >
              {this.props.user.id ? (
                <div>
                  <div>
                      DASHBOARD
                      <Table style={styles.table} >
                        <TableHeader adjustForCheckbox={false}>
                          <TableRow>
                            <TableHeaderColumn colSpan={6} style={{textAlign: 'center'}}>
                              {this.props.user.username}
                            </TableHeaderColumn>
                          </TableRow>

                          <TableRow>
                            <TableHeaderColumn>Mission Status</TableHeaderColumn>
                            <TableHeaderColumn>Mission ID</TableHeaderColumn>
                            <TableHeaderColumn>Title</TableHeaderColumn>
                            <TableHeaderColumn>Description</TableHeaderColumn>
                            <TableHeaderColumn>Location</TableHeaderColumn>
                            <TableHeaderColumn>Begun At</TableHeaderColumn>
                          </TableRow>

                        </TableHeader>

                        <TableBody
                          displayRowCheckbox={false}
                          deselectOnClickaway={true}
                          showRowHover={true} 
                          adjustForCheckbox={false}>

                          {tableData.map( (row, index) => (
                            <TableRow key={index} selected={row.selected} onCellClick={(e) => {e.PreventDefault()}}>
                              <TableRowColumn>{row.status}</TableRowColumn>
                              <TableRowColumn>{row.status}</TableRowColumn>
                              <TableRowColumn>{row.status}</TableRowColumn>
                              <TableRowColumn>{row.status}</TableRowColumn>
                              <TableRowColumn>{row.status}</TableRowColumn>
                              <TableRowColumn>{row.status}</TableRowColumn>
                            </TableRow>
                          ))}

                        </TableBody>

                      </Table>

                      <div ><RaisedButton label="Logout" onClick={this.logout} /></div>
                  </div>

                  {this.props.user && this.props.user.isAdmin ?
                    (<div>
                      <Link to="/admin">Admin Page</Link>
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
        </Grid>
      </div>
    );
  }
}
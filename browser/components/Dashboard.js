import React, { Component } from 'react';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
  from 'material-ui/Table';


const styles = {
  paper: {
    height: 500,
    width: 800,
    margin: 20,
    textAlign: 'center',
    display: 'inline-block',
  },
  propContainer: {
    width: 200,
    overflow: 'hidden',
    margin: '20px auto 0',
  },
  propToggleHeader: {
    margin: '20px auto 10px',
  },
};

// Things to display:

// List of Missions
// Nested list of challenges
// Data contained therein

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
   
  }

  render () {
    return (
      <Paper style={styles.paper} zDepth={4} >
        <Table height={'300'} >
          <TableHeader >
            <TableRow>
              <TableHeaderColumn colSpan="3" tooltip="Dashboard" style={{textAlign: 'center'}}>
                Dashboard
              </TableHeaderColumn>
            </TableRow>

            <TableRow>
              <TableHeaderColumn tooltip="The ID">ID</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Name">Name</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Status">Status</TableHeaderColumn>
            </TableRow>

          </TableHeader>

          <TableBody
            displayRowCheckbox={false}
            deselectOnClickaway={true}
            showRowHover={true} >

            {tableData.map( (row, index) => (
              <TableRow key={index} selected={row.selected}>
                <TableRowColumn>{index}</TableRowColumn>
                <TableRowColumn>{row.name}</TableRowColumn>
                <TableRowColumn>{row.status}</TableRowColumn>
              </TableRow>
            ))}

          </TableBody>

          <TableFooter
            adjustForCheckbox={this.state.showCheckboxes} >
            
            <TableRow>
              <TableRowColumn>ID</TableRowColumn>
              <TableRowColumn>Name</TableRowColumn>
              <TableRowColumn>Status</TableRowColumn>
            </TableRow>

            <TableRow>
              <TableRowColumn colSpan="3" style={{textAlign: 'center'}}>
                Super Footer
              </TableRowColumn>
            </TableRow>

          </TableFooter>

        </Table>
          <div> {this.props.user.username} </div>

      </Paper>
    );
  }
}
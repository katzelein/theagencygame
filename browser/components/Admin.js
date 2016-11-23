import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Admin extends Component {

  componentDidMount () {
   
  }

  render () {
    return (
         <div className="row">
              <div> THIS IS THE ADMIN PAGE </div>
              <Link to="/admin/addMission"> Add Mission </Link>
              {this.props.children}       
          </div>
    );
  }
}
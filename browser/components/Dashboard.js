import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Dashboard extends Component {

  componentDidMount () {
   
  }

  render () {
    return (
         <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6">
                  DASHBOARD
                  <div> {this.props.user.username} </div>
              </div>           
          </div>
    );
  }
}
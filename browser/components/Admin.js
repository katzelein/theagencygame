import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Admin extends Component {

  componentDidMount () {
   this.props.findUser()
  }

  render () {
    console.log("admin component: ", this.props.user)
    return (
         <div className="row">
              {this.props.user && this.props.user.isAdmin ? 
              (<div><div> THIS IS THE ADMIN PAGE </div>
              <Link to="/admin/addMission"> Add Mission </Link>
              <Link to="/admin/editMission"> View/Edit Missions </Link>
              {this.props.children} </div>)
              :
              (<div>You do not have permission to access this page, please contact and administrator</div>)
              }      
          </div>
    );
  }
}
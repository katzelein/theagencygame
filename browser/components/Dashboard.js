import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import axios from 'axios';
export default class Dashboard extends Component {
  constructor(props){
    super(props)
    this.logout = this.logout.bind(this)
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
      <div>
        {this.props.user.id ? (
         <div>
              <div>
                  DASHBOARD
                  <div> {this.props.user.username} </div>
                  <div ><button type="button" onClick={this.logout}>Logout</button></div>
              </div>
              {this.props.user && this.props.user.isAdmin ?
              (<div>
                <Link to="/admin">Admin Page</Link>
                </div>):
                null
                }           
          </div>
          ) : (<div> Please <Link to="/">log in</Link> to view your dashboard </div>)

        }
        </div>
    );
  }
}
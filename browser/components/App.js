import React, { Component } from 'react';
import { Link } from 'react-router';

export default class App extends Component {

  componentDidMount () {
   
  }

  render () {
    return (
      <div className="jumbotron">
         <div className="row">
                  <Link to="/sendVerification">
                    <input type="submit" value="Phone Verification" className="btn btn-info btn-block"/>
                  </Link>          
          </div>
      </div>
    );
  }
}
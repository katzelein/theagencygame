import React, { Component } from 'react';
import { Link } from 'react-router';

export default class App extends Component {

  componentDidMount () {
   
  }

  render () {
    return (
         <div className="row">
                  <Link to="/verification">
                    <input type="submit" value="Phone Verification" className="btn btn-info btn-block"/>
                  </Link>          
          </div>
    );
  }
}
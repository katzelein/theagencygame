import React, { Component } from 'react';
import { Link } from 'react-router';

export default class App extends Component {

  componentDidMount () {
   
  }

  render () {
    return (
         <div className="row">
              <form action="/api/mission" method="POST">
               <label>Title:</label><br/>
               <input type="text" name="title" />
               <input type="submit" value="Submit"/>
              </form>
          </div>
    );
  }
}
import React, { Component } from 'react';
import { Link } from 'react-router';
import { Form } from 'formsy-react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card'
import { RaisedButton, FlatButton, IconButton } from 'material-ui';
import MyInput from './Input';
import axios from 'axios';
import bluebird from 'bluebird';
import ContentClear from 'material-ui/svg-icons/content/clear';


export default class MissionForm extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      add: false, 
      addOrSave: "ADD MISSION" 
    }
    this.closeForm = this.closeForm.bind(this)
  }

  closeForm() {
    this.props.toggleAdd()
  }

  render() {
    return (
      <form
        className="form-style"
        style={{color: 'black'}} 
        autoComplete="off"> 
        <label style={{color: 'white'}}>Title:</label>
        <br/>
        <input 
          style={{width: '340px'}}
          type="text" 
          name="title" 
          value={this.props.mission.title} 
          onChange={this.props.onChange}
          required/>
        <br/>
        <label style={{color: 'white'}}>Description: </label>
        <br/>
        <textArea 
          type="text" 
          name="description" 
          value={this.props.mission.description} 
          onChange={this.props.onChange}
          required/>
        <br/>
        <label style={{color: 'white'}}>Place: </label>
        <br/>
        <input 
          type="text" 
          name="place" 
          value={this.props.mission.place} 
          onChange={this.props.onChange}
          required/>
        <br/>
        <label style={{color: 'white'}}>Location: </label>
        <br/>
        <input 
          type="text" 
          name="location" 
          value={this.props.mission.location.coordinates} 
          onChange={this.props.onChange}
          required />
        <br/>
      </form>
    )
  }
}

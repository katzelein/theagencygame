import React, { Component } from 'react';
import { Link } from 'react-router';
import { Form } from 'formsy-react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import { RaisedButton, FlatButton, IconButton } from 'material-ui';
import MyInput from './Input';
import axios from 'axios';
import bluebird from 'bluebird';
import ContentClear from 'material-ui/svg-icons/content/clear';

const styles = {
  form: {
    color: 'black'
  }
}

export default class ChallengeForm extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      add: false, 
      addOrSave: 'ADD MISSION' 
    };
    this.closeForm = this.closeForm.bind(this);
  }

  closeForm() {
    this.props.toggleAdd();
  }

  render() {
    return (
      <form className="form-style" autoComplete="off"> 
        
        {this.props.missionSpecific ? null : 
          <MissionDropDown 
            onChange={this.props.onChange} 
            missions={this.props.missions} 
            challenge={this.props.challenge}/>
        }

        <label>Objective:</label><br/>
        <input 
          type="text" 
          style={{width: '340px'}}
          name="objective" 
          value={this.props.challenge.objective} 
          onChange={this.props.onChange}
          required/>
        <br/>
        <label>Summary: </label><br/>
        <textArea 
          type="text" 
          name="summary" 
          value={this.props.challenge.summary} 
          onChange={this.props.onChange}
          required/>
        <br/>
        <label>Target Tags: </label><br/>
        <input 
          type="text" 
          name="targetTags" 
          value={this.props.challenge.targetTags} 
          onChange={this.props.onChange}/>
        <br/>
        <label>Target Text: </label><br/>
        <input 
          type="text" 
          name="targetText" 
          value={this.props.challenge.targetText} 
          onChange={this.props.onChange}/>
        <br/>
        <label>Conclusion: </label><br/>
        <textArea 
          type="text" 
          name="conclusion" 
          value={this.props.challenge.conclusion} 
          onChange={this.props.onChange}
          required/>
        <br/>
        <label>Type: </label><br/>
        <select 
          name="category" 
          value={this.props.challenge.category} 
          onChange={this.props.onChange}
          required>
          <option value="text">Text</option>
          <option value="image">Image</option>
          <option value="voice">Voice</option>
        </select>
        <br/>
        <label>Order:</label><br/>
        <input 
          type="text" 
          name="order" 
          value={this.props.challenge.order} 
          onChange={this.props.onChange}
          required/>
        <br/>
      </form>
    );
  }
}

export const MissionDropDown = ({ missions, onChange, challenge }) => (
  <div>
    <label>Mission:</label><br/>
    <select 
      name="mission" 
      value={challenge.missionId ? challenge.missionId : 'null'} 
      onChange={onChange}
      required>
      <option value="null">Leave Unassigned</option>
      
      {missions.map((mission, i) => {
        return(
          <option key={mission.id} value={mission.id}> {mission.title} </option>
        );
      })}

    </select>
    <br/>
  </div>
);

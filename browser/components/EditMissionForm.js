import React, { Component } from 'react';
import { Link } from 'react-router';
import { Form } from 'formsy-react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card'
import { RaisedButton, FlatButton, IconButton } from 'material-ui';
import MyInput from './Input';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import bluebird from 'bluebird';
import ContentClear from 'material-ui/svg-icons/content/clear';
import ChallengeCard from './ChallengeCard';


export default class MissionForm extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      add: false, 
      addOrSave: "ADD MISSION",
      mission: this.props.mission
    }
    this.mission = Object.assign({}, this.props.mission)
    this.closeForm = this.closeForm.bind(this)
    this.updateHere = this.updateHere.bind(this)
  }

  closeForm() {
    this.props.toggleAdd()
  }

  updateHere(e){
    let val = e.target.value

    if(e.target.name.indexOf('order') !== -1){
      let challengeId = e.target.name.slice(6)

      console.log("CHALLENGE ID: ", challengeId)
      console.log("target: ", e.target)
      console.log("target ID: ", e.target.id)
      let id = parseInt(e.target.id)
      this.mission.challenges[id].order = val
    }
    
    this.setState({ mission: this.mission})
    this.props.findMissions()
  }

  render() {
    console.log("EDIT MISSION FORM STATE: ", this.state.mission.challenges)
    console.log("EDIT MISSION FORM PROPS: ", this.props.mission.challenges)
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
        <label style={{color: 'white'}}>Meeting Place: </label>
        <br/>
        <input 
          type="text" 
          name="meetingPlace" 
          value={this.props.mission.meetingPlace} 
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

        {this.props.challenges && this.props.challenges.length ? (
          <div style={{paddingLeft: "16px", paddingTop: "20px", color: 'white'}}> 
            Challenges 
          </div> ) : (
          null
          )}
                  
          {this.props.challenges.map((challenge, i) => {
            return (
              <div style={{display: 'block'}}>
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge} 
                mission={this.props.mission} 
                refreshCards={this.props.refreshCards}
                missionSpecific={true}
                editingMission={true} />
              <TextField
                    style={{display: 'inline-block', width: '60px'}}
                    type="text"
                    id={i.toString()}
                    value={this.state.mission.challenges[i].order}
                    onChange={(e) => {
                      this.props.onChange(e)
                      this.updateHere(e)
                    }}
                    name={`order_${challenge.id}`}
                    floatingLabelText="Order" />
              </div>
            )
          })}
      </form>
    )
  }
}

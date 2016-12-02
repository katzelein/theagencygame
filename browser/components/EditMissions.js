import React, { Component } from 'react';
import { Link } from 'react-router';
import { Form } from 'formsy-react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card'
import { RaisedButton, FlatButton, IconButton } from 'material-ui';
import MyInput from './Input';
import MissionForm from './MissionForm';
import ChallengeForm from './ChallengeForm';
import ChallengeCard from './ChallengeCard';
import axios from 'axios';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import MissionCard from './MissionCard'

const styles = {
  jumbotron: {
    paddingBottom: 15
  },
  missionCard: {
    padding: 10, 
    margin: 10
  },
  raisedButton: {
    margin: '20px 0px 0px 10px'
  }
}

export default class EditMissions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fields: [],
      canSubmit: false,
      addMission: false,
      addOrSave: "ADD MISSION"
    }
    this.toggleAdd = this.toggleAdd.bind(this);
  }

  componentDidMount() {
    this.props.findMissions()
  }

  toggleAdd() {
    let bool = !this.state.addMission
    let buttonText = bool ? "SAVE MISSION" : "ADD MISSION"
    if (this.state.addMission) {
      // TODO: post challenge to database
    }
    this.setState({ 
      addMission: bool, 
      addOrSave: buttonText 
    })
  }

  render() {
    return (
      <div 
        className="container jumbotron" 
        style={styles.jumbotron} >
        <div className="row centered-form">
          <div>
      
          {this.props.missions.map((mission, i) => {
            return(
              <MissionCard 
                id={`mission-${mission.id}`} 
                style={styles.missionCard} 
                key={mission.id} 
                mission={mission} 
                findMissions={this.props.findMissions} />       
            )
          })}

          {this.state.addMission ? 
            <MissionForm 
              findMissions={this.props.findMissions} 
              toggleAdd={this.toggleAdd}/> 
          : null }
            
          </div>
          
          {this.state.addMission ? (
            <RaisedButton 
              type="submit" 
              form="mission-form" 
              className="mission-button" 
              label="SAVE MISSION" /> 
          )  : null }

          {this.state.addMission ? null : (
            <RaisedButton 
              type="button" 
              className="mission-button" 
              style={styles.raisedButton} 
              label="ADD MISSION" 
              onClick={this.toggleAdd}/>
          )}
        </div>
      </div>
    )
  }
}

import React, { Component } from 'react';
import { Link } from 'react-router';
import { Form } from 'formsy-react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card'
import { RaisedButton, FlatButton, IconButton } from 'material-ui';
import MyInput from './Input';
import MissionForm from './MissionForm';
import ChallengeCard from './ChallengeCard';
import ChallengeForm from './ChallengeForm';
import axios from 'axios';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';

const styles = {
  jumbotron: {
    paddingBottom: 15
  },
  challengeCard: {
    padding: 10, 
    margin: 10
  },
  raisedButton: {
    margin: '20px 0px 0px 10px'
  }
}

export default class EditChallenges extends Component {
  constructor(props) {
    super(props)
    this.state = { addChallenge: false }
      //this.handleClick = this.handleClick.bind(this);
    this.buttonAlert = this.buttonAlert.bind(this);
    this.toggleAdd = this.toggleAdd.bind(this);
    //this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    this.props.findChallenges()
    this.props.findMissions()
  }

  buttonAlert() {
    alert("testing button")
  }

  toggleAdd() {
    let bool = !this.state.addChallenge
    let buttonText = bool ? "SAVE CHALLENGE" : "ADD CHALLENGE"
    if (this.state.addChallenge) {
      // TODO: post challenge to database
    }
    this.setState({ addChallenge: bool })
  }

  render() {
    return (
      <div className="container jumbotron" style={styles.jumbotron}>
        <div className="row centered-form">
          <div>
      
          {this.props.challenges.map((challenge, i) => {
            return(
              <ChallengeCard 
                id={`challenge-${challenge.id}`} 
                style={styles.challengeCard} 
                key={challenge.id} 
                challenge={challenge} 
                missionSpecific={false} 
                missions={this.props.missions}
                deleteFromMission={false} 
                refreshCards={this.props.findChallenges}/>  
            )
          })}
          
          {this.state.addChallenge ? 
            <ChallengeForm 
              missionSpecific={false} 
              missions={this.props.missions} 
              refreshCards={this.props.findChallenges} 
              toggleAdd={this.toggleAdd}/> 
          : null }
            
          </div>

          {this.state.addChallenge ? (
            <RaisedButton 
              type="submit" 
              form="challenge-form" 
              className="challenge-button" 
              label="SAVE CHALLENGE" />
          ) : null }
        
          {this.state.addChallenge ? null : (
            <RaisedButton 
              type="button" 
              style={styles.raisedButton} 
              labelColor="black" 
              backgroundColor="#989898" 
              className="challenge-button" 
              label="ADD CHALLENGE" 
              onClick={this.toggleAdd}/>
          )}
        </div>
      </div>
    )
  }
}

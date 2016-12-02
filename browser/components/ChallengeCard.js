import React, { Component } from 'react';
import { Link } from 'react-router';
import { Form } from 'formsy-react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import { RaisedButton, FlatButton, IconButton } from 'material-ui';
import EditChallengeForm from './EditChallengeForm';
import axios from 'axios';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import ContentClear from 'material-ui/svg-icons/content/clear';
import ActionDone from 'material-ui/svg-icons/action/done';

export default class ChallengeCard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      refresh: true,
      isEditing: false,
      challenge: this.props.challenge,
      prevMission: this.props.challenge.missionId
    }

    this.challenge = Object.assign({}, this.state.challenge);
    this.deleteChallenge = this.deleteChallenge.bind(this);
    this.editChallenge = this.editChallenge.bind(this);
    this.updateChallengeState = this.updateChallengeState.bind(this);
    this.saveChallenge = this.saveChallenge.bind(this);
    this.updatePrevMission = this.updatePrevMission.bind(this);
    this.updateNextMission = this.updateNextMission.bind(this);
  }


  deleteChallenge(id) {

    // delete challenge from a mission, not from the database
    let bool = !this.state.refresh;
    if (this.props.deleteFromMission) {
      let missionId = this.props.mission.id;
      axios.delete(`/api/challenge/${id}/mission/${missionId}`)
        .then(() => {
          this.props.refreshCards();
          this.setState({ refresh: bool });
        })
    }

    // delete challenge from database
    else {
      axios.delete(`/api/challenge/${id}`)
        .then(() => {
          this.props.refreshCards();
          this.setState({ refresh: bool });
        })
    }
  }

  editChallenge() {
    let bool = !this.state.isEditing;
    this.setState({ isEditing: bool });
  }

  updateChallengeState(e) {


    if (e.target.name === 'mission') {
      let val = e.target.value === 'null' ? null : parseInt(e.target.value);
      this.challenge.missionId = val;
      this.setState({
        challenge: this.challenge
      });
    } else {
      let val = e.target.value;
      if (e.target.name === 'targetTags') {
        val = val.split(",")
      }
      this.challenge[e.target.name] = val;
      this.setState({ challenge: this.challenge });
    }
  }


  saveChallenge() {
    let missionId = this.state.challenge.missionId
    let prevMission = this.state.prevMission
    let challengeId = this.state.challenge.id
    console.log("IN SAVE: ")
    console.log("MISSION ID: ", missionId, " type ", typeof missionId)
    console.log("PREV MISSION: ", prevMission, " type ", typeof prevMission)
    axios.put(`/api/challenge/${challengeId}/update`, this.state.challenge)
      .then(() => {
        console.log("SAVED CHALLENGE")
        if (prevMission !== missionId) {
          console.log("PREV AND NEW NOT EQUAL")
          if (prevMission && missionId) {
            console.log("BOTH NOT NULL")
            return axios.all([this.updatePrevMission(), this.updateNextMission()])
          } else if (prevMission) {
            console.log("JUST PREV NOT NULL")
            return axios.all([this.updatePrevMission()])
          } else if (missionId) {
            console.log("JUST NEXT NOT NULL")
            return axios.all([this.updateNextMission()])
          }
        }
      })
      .then(() => {
        this.props.refreshCards()
        let bool = !this.state.isEditing
        this.setState({ isEditing: bool, prevMission: missionId })
      })
  }

  updatePrevMission() {
    return axios.delete(`/api/challenge/${this.props.challenge.id}/mission/${this.state.prevMission}`)
  }

  updateNextMission() {
    return axios.put(`/api/challenge/${this.props.challenge.id}/addToMission/${this.state.challenge.missionId}`)
  }

  render() {
    if (this.state.isEditing) {
      return (

        <Card style={{padding: '10px', margin: '10px', 'backgroundColor': 'white', color: 'black'}}>
      <CardText style={{color: 'black'}} expandable={true}>
        <EditChallengeForm onChange={this.updateChallengeState} challenge={this.state.challenge} editChallenge={this.props.editChallenge} 
        missionSpecific={this.props.missionSpecific} missions={this.props.missions}/>
      </CardText>
      <CardActions id="challenge-actions" style={{height: '40px', padding: '0px'}} expandable={true}>
        <div className="mui-button" style={{position: 'absolute', height: '100%', 'marginRight': '0px'}}>
        <IconButton className="inside-mui-button" tooltip="Save"
                    tooltipPosition="top-center" onClick={this.saveChallenge}
                    iconStyle={{color: 'black'}} style={{padding: '0px', height: '100%', width: '28px'}}>
          <ActionDone/>
        </IconButton>
        <IconButton className="inside-mui-button" tooltip="Cancel"
                    tooltipPosition="top-center" onClick={this.editChallenge}
                    iconStyle={{color: 'black'}} style={{padding: '0px', height: '100%', width: '28px'}}>
          <ContentClear/>
        </IconButton>
        </div>
      </CardActions>
  </Card>
      )
    } else {
      return (
        <Card style={{padding: '10px', margin: '10px', 'backgroundColor': 'white', color: 'black'}}>
      <CardHeader className="white-challenge-card" actAsExpander={true} 
                  showExpandableButton={true} title={this.props.challenge.objective}
                  titleStyle={{fontWeight: "bold", color: 'black'}} style={{color: 'black'}}>
      </CardHeader>
      <CardText style={{color: 'black'}} expandable={true}>
        <div><h5> Summary </h5>{this.props.challenge.summary} </div>
        <div>
          <h4> Target Answers </h4>
          <div><h5> Tags: </h5>{this.props.challenge.tagetTags} </div>
          <div><h5> Text: </h5>{this.props.challenge.tagetText} </div>
        </div>
        <div><h5> Conclusion </h5> {this.props.challenge.conclusion} </div>
        <div><h5> Type </h5> {this.props.challenge.category} </div>
        {this.props.missionSpecific ? null : (this.props.challenge.mission ? 
          <div><h5> Mission </h5> {this.props.challenge.mission.title} </div>
          : <div><h5> Not assigned to mission </h5></div>)}
      </CardText>
      <CardActions id="challenge-actions" style={{height: '40px', padding: '0px'}} expandable={true}>
        <div className="mui-button" style={{position: 'absolute', height: '100%', 'marginRight': '0px'}}>
        <IconButton className="inside-mui-button" tooltip="edit"
                    tooltipPosition="top-center" onClick={this.editChallenge}
                    iconStyle={{color: 'black'}} style={{padding: '0px', height: '100%', width: '28px'}}>
          <EditorModeEdit/>
        </IconButton>
        <IconButton className="inside-mui-button" tooltip="delete"
                    tooltipPosition="top-center" onClick={() => this.deleteChallenge(this.props.challenge.id)}
                    iconStyle={{color: 'black'}} style={{padding: '0px', height: '100%', width: '28px'}}>
          <ActionDelete/>
        </IconButton>
        </div>
      </CardActions>
  </Card>)
    }
  }
}

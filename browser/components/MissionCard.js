import React, { Component } from 'react';
import { Link } from 'react-router';
import axios from 'axios';

import MyInput from './Input';
import MissionForm from './MissionForm';
import ChallengeForm from './ChallengeForm';
import ChallengeCard from './ChallengeCard';
import EditMissionForm from './EditMissionForm';

import ActionDelete from 'material-ui/svg-icons/action/delete';
import ActionDone from 'material-ui/svg-icons/action/done';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card'
import ContentClear from 'material-ui/svg-icons/content/clear';
import Dialog from 'material-ui/Dialog';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import { RaisedButton, FlatButton, IconButton } from 'material-ui';

const styles = {
  card: {
    padding: 10, 
    margin: 10
  },
  muiButton: {
    position: 'absolute', 
    height: '100%', 
    marginRight: 0
  },
  iconButton: {
    padding: 0, 
    height: '100%', 
    width: 28
  }
}

export default class MissionCard extends Component {
  constructor(props) {

    super(props);
    this.state = { 
      addChallenge: false, 
      addOrSave: "ADD CHALLENGE", 
      isEditing: false, 
      mission: this.props.mission, 
      open: false,
      challengeOrder: {}
    }
  
    this.challengeOrder = {}
    this.mission = Object.assign({}, this.state.mission)
    this.props.mission.challenges.forEach(i => {
      this.challengeOrder[i.id] = i.order
    })
    this.toggleAdd = this.toggleAdd.bind(this);
    this.deleteMission = this.deleteMission.bind(this);
    this.editMission = this.editMission.bind(this);
    this.updateMissionState = this.updateMissionState.bind(this);
    this.saveMission = this.saveMission.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  toggleAdd() {
    let bool = !this.state.addChallenge
    let buttonText = bool ? "SAVE CHALLENGE" : "ADD CHALLENGE"
    this.setState({ 
      addChallenge: bool, 
      addOrSave: buttonText 
    })
  }

  updateMissionState(e) {
    let val = e.target.value
    if (e.target.name === 'location') {
      let coordinates = val.split(",")
      val = { type: "Point", coordinates }
    }

    if(e.target.name.indexOf('order') !== -1){
      let challengeId = e.target.name.slice(6)

      console.log("CHALLENGE ID: ", challengeId)
      console.log("target: ", e.target)
      console.log("target ID: ", e.target.id)
      let id = parseInt(e.target.id)
      this.mission.challenges[id].order = val
      this.challengeOrder[challengeId] = val

    }
    else{
      this.mission[e.target.name] = val
    }
    this.setState({ mission: this.mission, challengeOrder: this.challengeOrder })
    console.log("CHALLENGE ORDER: ", this.state.challengeOrder)
  }

  saveMission() {
    let missionId = this.state.mission.id
    let PromiseArray = []
    axios.put(`/api/mission/${missionId}/update`, this.state.mission)
      .then(() => {
        let key;
        for(key in this.state.challengeOrder){
          console.log("KEY: ", key)
          console.log("Order: ", this.state.challengeOrder[key])
          let p = axios.put(`/api/challenge/${key}/update`, {order: this.state.challengeOrder[key]})
          PromiseArray.push(p)
        }
        Promise.all(PromiseArray)
        .then(() => {
          this.props.findMissions()
          let bool = !this.state.isEditing
          this.setState({ isEditing: bool })
        })
      })
  }

  deleteMission(id) {
    axios.delete(`/api/mission/${id}`)
      .then(() => {
        this.props.findMissions()
      })
  }

  editMission() {
    let bool = !this.state.isEditing
    this.setState({ isEditing: bool })
  }

  handleOpen() {
    this.setState({ open: true });
  };

  handleClose() {
    this.setState({ open: false });
  };

  render() {

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose} />, 
      <FlatButton
        label = "Delete"
        primary = { true }
        onClick = {() => {
          this.handleClose
          this.deleteMission(this.props.mission.id)
        }} />
    ];

    if (this.state.isEditing) {
      return (
        <Card 
          id={`mission-${this.props.mission.id}`} 
          style={styles.card}>
          <CardText expandable={true} style={{margin: '16px 30px'}}>
            <EditMissionForm 
              mission={this.props.mission}
              challenges={this.props.mission.challenges} 
              onChange={this.updateMissionState}
              editMission={this.props.editMission}
              findMissions={this.props.findMissions} />
          </CardText>

          <CardActions id="actions" expandable={true}>
            <div 
              className="mui-button" 
              style={styles.muiButton}>
              <IconButton 
                className="inside-mui-button" 
                tooltip="Save"
                tooltipPosition="top-center" 
                onClick={this.saveMission}
                style={styles.iconButton}>
                <ActionDone/>
              </IconButton>
              <IconButton 
                className="inside-mui-button" 
                tooltip="Cancel"
                tooltipPosition="top-center" 
                onClick={this.editMission}
                style={styles.iconButton}>
                <ContentClear/>
              </IconButton>
            </div>
          </CardActions>
        </Card>
      )
    } 
    else {
      return (
        <Card 
          id={`mission-${this.props.mission.id}`} 
          style={styles.card} >
          <CardHeader
            style={{marginLeft: "10px"}}
            actAsExpander={true} 
            showExpandableButton={true} 
            title={this.props.mission.title}
            titleStyle={{fontWeight: "bold", fontSize:'22px'}}>
            <div className="card-header"> 
              {this.props.mission.description} 
            </div>
          </CardHeader>
          <CardText expandable={true}>
            <div style={{marginLeft: "10px"}}>
              <h3>
              Place
              </h3>
              {this.props.mission.place ? this.props.mission.place : "None Listed"} 
              <h3>
              Meeting Place
              </h3>
              {this.props.mission.meetingPlace ? this.props.mission.meetingPlace : "None Listed"}
              <h3>
              Location
              </h3>
              {this.props.mission.location ? this.props.mission.location.coordinates : "None Listed"}
              <h3>
              Number of Challenges
              </h3>
              {this.props.mission.numChallenges}
            </div>
            {this.props.mission.challenges && this.props.mission.challenges.length ? (
          <div style={{marginLeft: "10px", marginTop: "20px"}}> 
            Challenges 
          </div> ) : (
          null
          )}
            
            {this.props.mission.challenges.map((challenge, i) => {
              return(
                <ChallengeCard 
                  key={challenge.id} 
                  challenge={challenge} 
                  mission={this.props.mission} 
                  refreshCards={this.props.findMissions}
                  missionSpecific={true}
                  editingMission={false}
                  deleteFromMission={true}/>
              )
            })}

            {this.state.addChallenge ? 
              <ChallengeForm 
                missionSpecific={true} 
                refreshCards={this.props.findMissions} 
                mission={this.props.mission} 
                toggleAdd={this.toggleAdd}/> 
            : null }
    
            {this.state.addChallenge ? (
              <RaisedButton 
                type="submit" 
                form="challenge-form" 
                className="mission-button" 
                label="SAVE CHALLENGE" />
            ) : null }

            {this.state.addChallenge ? null : (
              <RaisedButton 
                type="button" 
                className="mission-button" 
                label="ADD CHALLENGE" 
                style={{marginTop: '10px'}}
                onClick={this.toggleAdd} />
            )}
          </CardText>
          <Dialog
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
            overlayStyle={{background: 'rgba(250, 110, 60, .5)'}} >
            Are you sure you want to delete this mission?
          </Dialog>
          <CardActions id="actions" expandable={true}>
            <div 
              className="mui-button" 
              style={styles.muiButton} >
              <IconButton 
                className="inside-mui-button" 
                tooltip="Edit"
                tooltipPosition="top-center" 
                onClick={this.editMission}
                style={styles.iconButton} >
                <EditorModeEdit/>
              </IconButton>
              <IconButton 
                className="inside-mui-button" 
                tooltip="Delete" 
                onClick={this.handleOpen}
                tooltipPosition="top-center" 
                style={styles.iconButton} >
                <ActionDelete/>
              </IconButton>
            </div>
          </CardActions>
        </Card>
      )
    }
  }
}

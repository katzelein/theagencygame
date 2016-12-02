import React, { Component } from 'react';
import { Link } from 'react-router';
// import { Form } from 'formsy-react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import { RaisedButton, FlatButton, IconButton } from 'material-ui';
import MyInput from './Input';
import MissionForm from './MissionForm';
import ChallengeForm from './ChallengeForm';
import ChallengeCard from './ChallengeCard';
import EditMissionForm from './EditMissionForm';
import axios from 'axios';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import ContentClear from 'material-ui/svg-icons/content/clear';
import ActionDone from 'material-ui/svg-icons/action/done';
import Dialog from 'material-ui/Dialog';

export default class MissionCard extends Component {
  constructor(props) {
    super(props);
    this.state = { addChallenge: false, addOrSave: 'ADD CHALLENGE', isEditing: false, mission: this.props.mission, open: false };
    this.mission = Object.assign({}, this.state.mission);
    this.toggleAdd = this.toggleAdd.bind(this);
    this.deleteMission = this.deleteMission.bind(this);
    this.editMission = this.editMission.bind(this);
    this.updateMissionState = this.updateMissionState.bind(this);
    this.saveMission = this.saveMission.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  toggleAdd() {
    let bool = !this.state.addChallenge;
    let buttonText = bool ? 'SAVE CHALLENGE' : 'ADD CHALLENGE';
    console.log('BUTTON TEXT: ', buttonText);
    this.setState({ addChallenge: bool, addOrSave: buttonText });
  }

  updateMissionState(e) {
    console.log('MISSION BODY: ', this.state.mission);
    console.log('EVENT: ', e);
    console.log('EVENT TARGET: ', e.target);
    console.log('THIS.MISSION: ', this.mission);

    let val = e.target.value;
    console.log('VAL: ', val);
    if (e.target.name === 'location') {
      let coordinates = val.split(',');
      val = { type: 'Point', coordinates };
    }
    console.log('THIS>MISSION: ', this.mission);
    this.mission[e.target.name] = val;
    console.log('THIS.MISSION AFTER UPDATE: ', this.mission);
    this.setState({ mission: this.mission });

  }

  saveMission() {
    console.log('STATE BEFORE SAVE: ', this.state);
    let missionId = this.state.mission.id;
    console.log('IN SAVE: ');
    console.log('MISSION ID: ', missionId, ' type ', typeof missionId);
    axios.put(`/api/mission/${missionId}/update`, this.state.mission)
      .then(() => {
        this.props.findMissions();
        let bool = !this.state.isEditing;
        this.setState({ isEditing: bool });
      });
  }

  deleteMission(id) {
    axios.delete(`/api/mission/${id}`)
      .then(() => {
        this.props.findMissions();
      });
  }

  editMission() {
    let bool = !this.state.isEditing;
    this.setState({ isEditing: bool });
  }

  handleOpen() {
    console.log('handleOpen');
    this.setState({ open: true });
  }

  handleClose() {
    console.log('handleClose');
    this.setState({ open: false });
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />, < FlatButton
      label = "Delete"
      primary = { true }
      onClick = {
        () => {
          this.handleClose;
          this.deleteMission(this.props.mission.id);
        }
      }
      />,
    ];
    if (this.state.isEditing) {
      return (
        <Card id={`mission-${this.props.mission.id}`} style={{padding: '10px', margin: '10px'}}>
          <CardText expandable={true}>
            <EditMissionForm mission={this.state.mission} onChange={this.updateMissionState}
                            editMission={this.props.editMission}/>
          </CardText>
          <div> Challenges </div>
                  {this.props.mission.challenges.map((challenge, i) => {
  return(
                    <ChallengeCard key={challenge.id} challenge={challenge} mission={this.props.mission} refreshCards={this.props.findMissions}
                    missionSpecific={true}/>
  );
})}
          <CardActions id="actions" expandable={true}>
            <div className="mui-button" style={{position: 'absolute', height: '100%', 'marginRight': '0px'}}>
              <IconButton className="inside-mui-button" tooltip="Save"
                    tooltipPosition="top-center" onClick={this.saveMission}
                   style={{padding: '0px', height: '100%', width: '28px'}}>
                  <ActionDone/>
              </IconButton>
              <IconButton className="inside-mui-button" tooltip="Cancel"
                    tooltipPosition="top-center" onClick={this.editMission}
                    style={{padding: '0px', height: '100%', width: '28px'}}>
                   <ContentClear/>
              </IconButton>
            </div>
          </CardActions>
        </Card>
      );
    } else {
      return (

        <Card id={`mission-${this.props.mission.id}`} style={{padding: '10px', margin: '10px'}}>
                <CardHeader actAsExpander={true} 
                  showExpandableButton={true} title={this.props.mission.title}
                  titleStyle={{fontWeight: 'bold'}}>
                  <div className="card-header"> {this.props.mission.description} </div>
                </CardHeader>
                <CardText expandable={true}>
                  <div> Challenges </div>
                  {this.props.mission.challenges.map((challenge, i) => {
  return(
                    <ChallengeCard key={challenge.id} challenge={challenge} mission={this.props.mission} refreshCards={this.props.findMissions}
                    missionSpecific={true}/>
  );
})}
                  {this.state.addChallenge ? <ChallengeForm missionSpecific={true} refreshCards={this.props.findMissions} mission={this.props.mission} toggleAdd={this.toggleAdd}/> : null}
    
            {this.state.addChallenge ? 
              (<RaisedButton type="submit" form="challenge-form" className="mission-button" label="SAVE CHALLENGE" />)
              : null}
            {this.state.addChallenge ? null :
              (<RaisedButton type="button" className="mission-button" label="ADD CHALLENGE" onClick={this.toggleAdd}/>)
            }
                </CardText>
                <Dialog
                  actions={actions}
                  modal={false}
                  open={this.state.open}
                  onRequestClose={this.handleClose}
                  overlayStyle={{background: 'rgba(250, 110, 60, .5)'}}
                >
                Are you sure you want to delete this mission?
               </Dialog>
                <CardActions id="actions" expandable={true}>
                  <div className="mui-button" style={{position: 'absolute', height: '100%', 'marginRight': '0px'}}>
                    <IconButton className="inside-mui-button" tooltip="edit"
                      tooltipPosition="top-center" onClick={this.editMission}
                      style={{padding: '0px', height: '100%', width: '28px'}}>
                      <EditorModeEdit/>
                    </IconButton>
                    <IconButton className="inside-mui-button" tooltip="delete" onClick={this.handleOpen}
                      tooltipPosition="top-center" 
                      style={{padding: '0px', height: '100%', width: '28px'}}>
                      <ActionDelete/>
                    </IconButton>
                  </div>
                </CardActions>
            </Card>

      );
    }
  }
}



//onClick={() => this.deleteMission(this.props.mission.id)}

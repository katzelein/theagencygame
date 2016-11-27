import React, { Component } from 'react';
import { Link } from 'react-router';
import { Form } from 'formsy-react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import {RaisedButton, FlatButton, IconButton} from 'material-ui';
import MyInput from './Input';
import MissionForm from './MissionForm';
import ChallengeForm from './ChallengeForm';
import ChallengeCard from './ChallengeCard';
import axios from 'axios';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';


const Fields = props => {
  function onRemove(pos) {
    return event => {
      event.preventDefault();
      props.onRemove(pos);
    };
  }
  const foo = 'required';
  return (
    <div className="fields">
      {props.data.map((field, i) => (
        <div className="field" key={field.id}>
          {
            field.type === 'input' ?
            (
              <MyInput
                value=""
                name={`fields[${i}]`}
                title={field.validations ? JSON.stringify(field.validations) : 'No validations'}
                required={field.required}
                validations={field.validations}
              />
            ) : null
          }
          <a href="#" className="remove-field" onClick={onRemove(i)}>X</a>
        </div>
      ))
    }
    </div>
  );
};

export default class EditMissions extends Component {
  constructor(props){
    super(props)
    this.state = { fields: [], canSubmit: false, addMission: false, addOrSave: "ADD MISSION"}
    //this.handleClick = this.handleClick.bind(this);
    this.buttonAlert = this.buttonAlert.bind(this);
    this.toggleAdd = this.toggleAdd.bind(this);
    //this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount () {
    this.props.findMissions()
  }

  // handleClick(missionId){
  //   console.log("MISSION ID: ", missionId)
  //   console.log("this.state: ", this.state.expanded)
  //   if(this.state.expanded === missionId){
  //     console.log("already expanded")
  //     this.setState({expanded: false})
  //   }
  //   else{
  //     console.log("now expanding")
  //     this.setState({expanded: missionId})
  //   }
  // }

  buttonAlert(){
    alert("testing button")
  }

  toggleAdd(){
    let bool = !this.state.addMission
    let buttonText = bool ? "SAVE MISSION" : "ADD MISSION"
    console.log("BUTTON TEXT: ", buttonText)
    if(this.state.addMission){
      // post challenge to database
    }
    this.setState({addMission: bool, addOrSave: buttonText})
  }

  render () {
    return (
        <MuiThemeProvider>
           <div className="container jumbotron">
             <div className="row centered-form">
            <div>
      
           {this.props.missions.map((mission, i) => {
              console.log("MISSION CHALLENGES: ", mission.challenges)
              return(
              <MissionCard id={`mission-${mission.id}`} 
                            style={{padding: '10px', margin: '10px'}} 
                            key={mission.id} mission={mission} findMissions={this.props.findMissions}/>
          
            )})}
            {this.state.addMission ? <MissionForm findMissions={this.props.findMissions} toggleAdd={this.toggleAdd}/> : null}
            </div>
            {this.state.addMission ? 
              (<RaisedButton type="submit" form="mission-form" className="mission-button" label="SAVE MISSION" />)
              : null}
            {this.state.addMission ? null :
              (<RaisedButton type="button" className="mission-button" label="ADD MISSION" onClick={this.toggleAdd}/>)
            }
      
            </div>
            </div>
          </MuiThemeProvider>
    )
  }
}

export class MissionCard extends Component {
  constructor(props){
    super(props)
    this.state = {addChallenge: false, addOrSave: "ADD CHALLENGE"}
    //this.handleClick = this.handleClick.bind(this);
    this.toggleAdd = this.toggleAdd.bind(this);
    this.deleteMission = this.deleteMission.bind(this);
    this.editMission = this.editMission.bind(this);
  }

  toggleAdd(){
    let bool = !this.state.addChallenge
    let buttonText = bool ? "SAVE CHALLENGE" : "ADD CHALLENGE"
    console.log("BUTTON TEXT: ", buttonText)
    if(this.state.addChallenge){
      // post challenge to database
    }
    this.setState({addChallenge: bool, addOrSave: buttonText})
  }

  deleteMission(id){
    axios.delete(`/api/mission/${id}`)
    .then(() => {
      this.props.findMissions()
    })
  }

  editMission(){
    // do something
  }

  
  render () {
    return (
  
              <Card id={`mission-${this.props.mission.id}`} style={{padding: '10px', margin: '10px'}} key={this.props.mission.id}>
                <CardHeader actAsExpander={true} 
                  showExpandableButton={true} title={this.props.mission.title}
                  titleStyle={{fontWeight: "bold"}}>
                  <div className="card-header"> {this.props.mission.description} </div>
                </CardHeader>
                <CardText expandable={true}>
                  <div> IT WORKED </div>
                  <div> Challenges </div>
                  {this.props.mission.challenges.map((challenge, i) => {
                    return(
                    <ChallengeCard key={challenge.id} challenge={challenge} mission={this.props.mission} findMissions={this.props.findMissions}
                    missionSpecific={true}/>
                    )
                  })}
                  {this.state.addChallenge ? <ChallengeForm missionSpecific={true} refreshCards={this.props.findMissions} mission={this.props.mission} toggleAdd={this.toggleAdd}/> : null}
    
            {this.state.addChallenge ? 
              (<RaisedButton type="submit" form="challenge-form" className="mission-button" label="SAVE CHALLENGE" />)
              : null}
            {this.state.addChallenge ? null :
              (<RaisedButton type="button" className="mission-button" label="ADD CHALLENGE" onClick={this.toggleAdd}/>)
            }
                </CardText>
                <CardActions id="actions" expandable={true}>
                  <div className="mui-button" style={{position: 'absolute', height: '100%', 'marginRight': '0px'}}>
                    <IconButton className="inside-mui-button" tooltip="edit"
                      tooltipPosition="top-center" onClick={this.editMission}
                      style={{padding: '0px', height: '100%', width: '28px'}}>
                      <EditorModeEdit/>
                    </IconButton>
                    <IconButton className="inside-mui-button" tooltip="delete"
                      tooltipPosition="top-center" onClick={() => this.deleteMission(this.props.mission.id)}
                      style={{padding: '0px', height: '100%', width: '28px'}}>
                      <ActionDelete/>
                    </IconButton>
                  </div>
                </CardActions>
            </Card>
        
    )
  }
}







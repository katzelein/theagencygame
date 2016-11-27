import React, { Component } from 'react';
import { Link } from 'react-router';
import { Form } from 'formsy-react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import {RaisedButton, FlatButton, IconButton} from 'material-ui';
import MyInput from './Input';
import MissionForm from './MissionForm';
import ChallengeForm from './ChallengeForm';
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

export default class EditMission extends Component {
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
    )
  }
}

export class MissionCard extends Component {
  constructor(props){
    super(props)
    this.state = { fields: [], canSubmit: false, addMission: false, addOrSave: "ADD CHALLENGE"}
    //this.handleClick = this.handleClick.bind(this);
    this.toggleAdd = this.toggleAdd.bind(this);
    this.deleteMission = this.deleteMission.bind(this);
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
                    <ChallengeCard id={challenge.id} key={challenge.id} challenge={challenge} mission={this.props.mission} findMissions={this.props.findMissions}/>
                    )
                  })}
                  {this.state.addChallenge ? <ChallengeForm findMissions={this.props.findMissions} mission={this.props.mission} toggleAdd={this.toggleAdd}/> : null}
    
            {this.state.addChallenge ? 
              (<RaisedButton type="submit" form="mission-form" className="mission-button" label="SAVE CHALLENGE" />)
              : null}
            {this.state.addChallenge ? null :
              (<RaisedButton type="button" className="mission-button" label="ADD CHALLENGE" onClick={this.toggleAdd}/>)
            }
                </CardText>
                <CardActions id="actions" expandable={true}>
                  <div className="mui-button" style={{position: 'absolute', height: '100%', 'margin-right': '0px'}}>
                    <IconButton className="inside-mui-button" tooltip="edit"
                      tooltipPosition="top-center" onClick={() => this.deleteMission(this.props.mission.id)}
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

export class ChallengeCard extends Component{
  constructor(props){
    super(props)
    this.state = { refresh: true, canSubmit: false, addMission: false, addOrSave: "ADD CHALLENGE"}
    //this.handleClick = this.handleClick.bind(this);
    this.toggleAdd = this.toggleAdd.bind(this);
    this.deleteChallenge = this.deleteChallenge.bind(this);
  }

  toggleAdd(){
    let bool = !this.state.addMission
    let buttonText = bool ? "SAVE CHALLENGE" : "ADD CHALLENGE"
    console.log("BUTTON TEXT: ", buttonText)
    if(this.state.addMission){
      // post challenge to database
    }
    this.setState({addMission: bool, addOrSave: buttonText})
  }

  deleteChallenge(id){
    let bool = !this.state.refresh
    let missionId = this.props.mission.id
    axios.delete(`/api/challenge/${id}/mission/${missionId}`)
    .then(() => {
      console.log("PROPS: ", this.props)
      this.props.findMissions()
      this.setState({refresh: bool})
      console.log("REFRESH: ", this.state.refresh)
    })
  }
  
  render(){
    return (
  <Card style={{padding: '10px', margin: '10px', 'background-color': 'white', color: 'black'}}>
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
        <div><h5> Type </h5> {this.props.challenge.type} </div>
      </CardText>
      <CardActions id="challenge-actions" style={{height: '40px', padding: '0px'}} expandable={true}>
        <div className="mui-button" style={{position: 'absolute', height: '100%', 'margin-right': '0px'}}>
        <IconButton className="inside-mui-button" tooltip="edit"
                    tooltipPosition="top-center" onClick={() => this.deleteMission(this.props.mission.id)}
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
  </Card>
  )}

}






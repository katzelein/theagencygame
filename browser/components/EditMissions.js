import React, { Component } from 'react';
import { Link } from 'react-router';
import { Form } from 'formsy-react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import {RaisedButton, FlatButton, IconButton} from 'material-ui';
import MyInput from './Input';
import MissionForm from './MissionForm';
import axios from 'axios';
import ActionDelete from 'material-ui/svg-icons/action/delete';


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
    this.state = { fields: [], canSubmit: false, addMission: false, addOrSave: "ADD CHALLENGE"}
    //this.handleClick = this.handleClick.bind(this);
    this.toggleAdd = this.toggleAdd.bind(this);
    this.deleteMission = this.deleteMission.bind(this);
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

  deleteMission(id){
    axios.delete(`/api/mission/${id}`)
    .then(() => {
      this.props.findMissions()
    })
  }

  deleteChallenge(id){
    axios.delete(`/api/challenge/${id}`)
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
                    <ChallengeCard key={challenge.id} challenge={challenge} mission={this.props.mission}/>
                    )
                  })}
                  {this.state.addMission ? (<div>ADD CHALLENGE</div>) : null}
                </CardText>
                <CardActions id="actions" expandable={true}>
                  <RaisedButton className="challenge-button" label={this.state.addOrSave} onClick={this.toggleAdd}>
                    {/*<label for={`mission-${mission.id}`}>TEST</label>*/}
                  </RaisedButton>
                  <IconButton className="mui-button" tooltip="SVG Icon" tooltip="top-center"
                    tooltipPosition="top-center" onClick={() => this.deleteMission(this.props.mission.id)}
                    style={{padding: '0px', position: 'absolute', margin: '0px 0px, 0px, 0px', 'margin-right': '0px', height: '100%'}}>
                    <ActionDelete/>
                  </IconButton>
                </CardActions>
            </Card>
        
    )
  }
}

export const ChallengeCard = ({ challenge, mission }) => (
  <Card style={{padding: '10px', margin: '10px'}}>
      <CardHeader actAsExpander={true} 
                  showExpandableButton={true} title={challenge.objective}
                  titleStyle={{fontWeight: "bold"}}>
      </CardHeader>
      <CardText expandable={true}>
        <div><h5> Summary </h5>{challenge.summary} </div>
        <div>
          <h4> Target Answers </h4>
          <div><h5> Tags: </h5>{challenge.tagetTags} </div>
          <div><h5> Text: </h5>{challenge.tagetText} </div>
        </div>
        <div><h5> Conclusion </h5> {challenge.conclusion} </div>
        <div><h5> Type </h5> {challenge.type} </div>
      </CardText>
      <CardActions id="challenge-actions" style={{height: '52.23px'}} expandable={true}>
        <IconButton className="mui-button" tooltip="SVG Icon" tooltip="top-center"
                    tooltipPosition="top-center" onClick={() => this.deleteMission(this.props.mission.id)}
                    style={{padding: '0px', position: 'absolute', margin: '0px 0px, 0px, 0px', 'margin-right': '0px', height: '100%'}}>
          <ActionDelete/>
        </IconButton>
      </CardActions>
  </Card>

)






import React, { Component } from 'react';
import { Link } from 'react-router';
import { Form } from 'formsy-react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import {RaisedButton, FlatButton, IconButton} from 'material-ui';
import MyInput from './Input';
import MissionForm from './MissionForm';
import ChallengeCard from './ChallengeCard';
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

export default class EditChallenges extends Component {
  constructor(props){
    super(props)
    this.state = {addChallenge: false}
    //this.handleClick = this.handleClick.bind(this);
    this.buttonAlert = this.buttonAlert.bind(this);
    this.toggleAdd = this.toggleAdd.bind(this);
    //this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount () {
    this.props.findChallenges()
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
    let bool = !this.state.addChallenge
    let buttonText = bool ? "SAVE CHALLENGE" : "ADD CHALLENGE"
    console.log("BUTTON TEXT: ", buttonText)
    if(this.state.addChallenge){
      // post challenge to database
    }
    this.setState({addChallenge: bool})
  }

  render () {
    return (

           <div className="container jumbotron">
             <div className="row centered-form">
            <div>
      
           {this.props.challenges.map((challenge, i) => {
              console.log("MISSION CHALLENGES: ", challenge.challenges)
              return(
              <ChallengeCard id={`challenge-${challenge.id}`} 
                            style={{padding: '10px', margin: '10px'}} 
                            key={challenge.id} challenge={challenge} missionSpecific={false} missions={this.props.missions}
                            deleteFromMission={false} refreshCards={this.props.findChallenges}/>
          
            )})}
            {this.state.addChallenge ? <ChallengeForm missionSpecific={false} missions={this.props.missions} refreshCards={this.props.findChallenges} toggleAdd={this.toggleAdd}/> : null}
            </div>
            {this.state.addChallenge ? 
              (<RaisedButton type="submit" form="challenge-form" className="challenge-button" label="SAVE CHALLENGE" />)
              : null}
            {this.state.addChallenge ? null :
              (<RaisedButton type="button" className="challenge-button" label="ADD CHALLENGE" onClick={this.toggleAdd}/>)
            }
      
            </div>
            </div>

    )
  }
}

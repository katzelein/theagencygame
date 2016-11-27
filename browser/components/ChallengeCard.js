import React, { Component } from 'react';
import { Link } from 'react-router';
import { Form } from 'formsy-react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import {RaisedButton, FlatButton, IconButton} from 'material-ui';
import ChallengeForm from './ChallengeForm';
import axios from 'axios';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';

export default class ChallengeCard extends Component{
  constructor(props){
    super(props)
    this.state = { refresh: true }
    //this.handleClick = this.handleClick.bind(this);
    //this.toggleAdd = this.toggleAdd.bind(this);
    this.deleteChallenge = this.deleteChallenge.bind(this);
    this.editChallenge = this.editChallenge.bind(this);
  }

  // toggleAdd(){
  //   let bool = !this.state.addMission
  //   let buttonText = bool ? "SAVE CHALLENGE" : "ADD CHALLENGE"
  //   console.log("BUTTON TEXT: ", buttonText)
  //   if(this.state.addMission){
  //     // post challenge to database
  //   }
  //   this.setState({addMission: bool, addOrSave: buttonText})
  // }

  deleteChallenge(id){
    let bool = !this.state.refresh
    // delete challenge from a mission, not from the database
    if(this.props.deleteFromMission){
      let missionId = this.props.mission.id
      axios.delete(`/api/challenge/${id}/mission/${missionId}`)
      .then(() => {
        console.log("PROPS: ", this.props)
        this.props.findMissions()
        this.setState({refresh: bool})
        console.log("REFRESH: ", this.state.refresh)
      })
    }
    // delete challenge from database
    else{
      axios.delete(`/api/challenge/${id}`)
      .then(() => {
        console.log("PROPS: ", this.props)
        this.props.findChallenges()
        this.setState({refresh: bool})
        console.log("REFRESH: ", this.state.refresh)
      })
    }
  }

  editChallenge(){
    // do something
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
  </Card>
  )}


}
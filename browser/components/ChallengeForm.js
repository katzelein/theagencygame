import React, { Component } from 'react';
import { Link } from 'react-router';
import { Form } from 'formsy-react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import {RaisedButton, FlatButton, IconButton} from 'material-ui';
import MyInput from './Input';
import axios from 'axios';
import bluebird from 'bluebird';
import ContentClear from 'material-ui/svg-icons/content/clear';


export default class ChallengeForm extends Component {
  constructor(props){
    super(props)
    this.state = { fields: [], canSubmit: false, add: false, addOrSave: "ADD MISSION"}
    //this.handleClick = this.handleClick.bind(this);
    this.submitAlert = this.submitAlert.bind(this)
    this.closeForm = this.closeForm.bind(this)
  }

  submitAlert(e){
    e.preventDefault()
    let objective = e.target.objective.value
    let summary = e.target.summary.value
    let targetTags = e.target.targetTags.value.split(",")
    let targetText = e.target.targetText.value
    let conclusion = e.target.conclusion.value
    let type = e.target.type.value
    let order = e.target.order.value

    if(this.props.missionSpecific || (e.target.mission && e.target.mission.value !== "null")){
      let missionId = (this.props.missionSpecific ? this.props.mission.id : e.target.mission.value)
      console.log("MISSION ID ON SUBMIT: ", missionId)
      axios.post(`/api/challenge/setMission/${missionId}`, {objective, summary, targetTags, targetText, conclusion, type, order})
      .then((res) => res.data)
      .then(challenge => {
        console.log("CHALLENGE: ", challenge)
          this.props.refreshCards()
          this.props.toggleAdd()
      })
    }
    // if(this.props.missionSpecific){
    //   let missionId = this.props.mission.id
    //   console.log("MISSION ID ON SUBMIT: ", missionId)
    //   axios.post(`/api/challenge/setMission/${missionId}`, {objective, summary, targetTags, targetText, conclusion, type, order})
    //   .then((res) => res.data)
    //   .then(challenge => {
    //     console.log("CHALLENGE: ", challenge)
    //       this.props.findMissions()
    //       this.props.toggleAdd()
    //   })
    // }
    // else if(e.target.mission && e.target.mission.value){
    //   let missionId = e.target.mission.value
    // }

    else{
      axios.post('/api/challenge', {objective, summary, targetTags, targetText, conclusion, type, order})
      .then((res) => res.data)
      .then(challenge => {
        console.log("CHALLENGE: ", challenge)
          this.props.refreshCards()
          this.props.toggleAdd()
      })
    }
  }

  closeForm(){
    this.props.toggleAdd()
  }

  render () {
    return (
      <Card id="new-challenge-form" style={{padding: '10px', margin: '10px'}}>
        <CardHeader style={{position: 'relative', padding: '10px 16px 10px 16px', height: '50px'}} title="NEW CHALLENGE"
            titleStyle={{fontWeight: "bold", 'verticalAlign': 'center'}}>
           {/* <div className="mui-button" style={{'padding-right': '0px', top: '0px', height: '21.25px', position: 'absolute'}}>*/}
            <IconButton className="inside-mui-button" tooltip="Cancel"
                    tooltipPosition="top-center" onClick={this.closeForm}
                    style={{padding: '2px 10px 0px 0px', height: '21.25px', width: '28px', position: 'absolute', top: '0px', right: '0px'}}>
          <ContentClear/>
        </IconButton>
        </CardHeader>
        <CardText>
          <form id="challenge-form" onSubmit={this.submitAlert}> 
            {this.props.missionSpecific ? null : <MissionDropDown missions={this.props.missions}/>}
            <label>Objective:</label><br/>
            <input type="text" name="objective" /><br/>
            <label>Summary: </label><br/>
            <textArea type="text" name="summary"/><br/>
            <label>Target Tags: </label><br/>
            <input type="text" name="targetTags" /><br/>
            <label>Target Text: </label><br/>
            <input type="text" name="targetText" /><br/>
            <label>Conclusion: </label><br/>
            <textArea type="text" name="conclusion"/><br/>
            <label>Type: </label><br/>
            <input type="text" name="type" /><br/>
            <label>Order: </label><br/>
            <input type="text" name="order" /><br/>
          </form>
        </CardText>
        </Card>   
    )
  }
}

export const MissionDropDown = ({ missions }) => (
  <div>
  <label>Mission:</label><br/>
  <select name="mission">
    <option value="null">Leave Unassigned</option>
    {missions.map((mission, i) => {
      return(
        <option key={mission.id} value={mission.id}> {mission.title} </option>
      )
    })}
  </select><br/>
  </div>
)



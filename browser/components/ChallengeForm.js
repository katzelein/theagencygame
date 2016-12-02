import React, { Component } from 'react';
import { Link } from 'react-router';
import { Form } from 'formsy-react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card'
import { RaisedButton, FlatButton, IconButton } from 'material-ui';
import MyInput from './Input';
import axios from 'axios';
import bluebird from 'bluebird';
import ContentClear from 'material-ui/svg-icons/content/clear';

const styles = {
  card: {
    padding: 10, 
    margin: 10
  },
  cardHeader: {
    position: 'relative', 
    padding: '10px 16px 10px 16px', 
    height: 50
  },
  cardHeaderTitle: {
    fontWeight: 'bold', 
    verticalAlign: 'center'
  },
  iconButton: {
    padding: '2px 10px 0px 0px', 
    height: 21.25, 
    width: 28, 
    position: 'absolute', 
    top: 0, 
    right: 0
  }
}

export default class ChallengeForm extends Component {
  constructor(props) {
    super(props)
    this.state = { fields: [], canSubmit: false, add: false, addOrSave: "ADD MISSION" }
    this.submitAlert = this.submitAlert.bind(this)
    this.closeForm = this.closeForm.bind(this)
  }

  submitAlert(e) {
    e.preventDefault()
    let objective = e.target.objective.value
    let summary = e.target.summary.value
    let targetTags = e.target.targetTags.value.split(",")
    let targetText = e.target.targetText.value
    let conclusion = e.target.conclusion.value
    let category = e.target.category.value
    let order = e.target.order.value

    if (this.props.missionSpecific || (e.target.mission && e.target.mission.value !== "null")) {
      let missionId = (this.props.missionSpecific ? this.props.mission.id : e.target.mission.value)
      axios.post(`/api/challenge/setMission/${missionId}`, { objective, summary, targetTags, targetText, conclusion, category, order })
        .then((res) => res.data)
        .then(challenge => {
          this.props.refreshCards()
          this.props.toggleAdd()
        })
    } 
    else {
      axios.post('/api/challenge', { objective, summary, targetTags, targetText, conclusion, category, order })
        .then((res) => res.data)
        .then(challenge => {
          this.props.refreshCards()
          this.props.toggleAdd()
        })
    }
  }

  closeForm() {
    this.props.toggleAdd()
  }

  render() {
    return (
      <Card id="new-challenge-form" style={styles.card}>
        <CardHeader 
          style={styles.cardHeader} 
          title="NEW CHALLENGE"
          titleStyle={styles.cardHeaderTitle} >
          <IconButton 
            className="inside-mui-button" 
            tooltip="Cancel"
            tooltipPosition="top-center" 
            onClick={this.closeForm}
            style={styles.iconButton}>
            <ContentClear/>
          </IconButton>
        </CardHeader>
        <CardText>
          <form 
            id="challenge-form" 
            onSubmit={this.submitAlert} 
            autoComplete="off">        
            
            {this.props.missionSpecific ? null : <MissionDropDown missions={this.props.missions}/>}
            
            <label>Objective:</label>
            <br/>
            <input 
              type="text" 
              name="objective" />
            <br/>
            <label>Summary:</label><br/>
            <textArea 
              type="text" 
              name="summary"/>
            <br/>
            <label>Target Tags:</label><br/>
            <input 
              type="text" 
              name="targetTags" />
            <br/>
            <label>Target Text:</label><br/>
            <input 
              type="text" 
              name="targetText" />
            <br/>
            <label>Conclusion:</label>
            <br/>
            <textArea 
              type="text" 
              name="conclusion"/>
            <br/>
            <label>Type:</label><br/>
            <input 
              type="text" 
              name="category" />
            <br/>
            <label>Order:</label><br/>
            <input 
              type="text" 
              name="order" />
            <br/>
          </form>
        </CardText>
      </Card>
    )
  }
}

export const MissionDropDown = ({ missions }) => (
  <div>
    <label>Mission:</label>
    <br/>
    <select name="mission">
    <option value="null">Leave Unassigned</option>
    
    {missions.map((mission, i) => {
      return(
        <option key={mission.id} value={mission.id}> {mission.title} </option>
      )
    })}

    </select>
    <br/>
  </div>
)

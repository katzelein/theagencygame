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
import Dialog from 'material-ui/Dialog';

const styles = {
  card: {
    padding: 10, 
    margin: 10, 
    backgroundColor: 'white', 
    color: 'black'
  },
  cardText: {
    color: 'black'
  },
  cardActions: {
    height: 40, 
    padding: 0
  },
  iconButton: {
    padding: 0, 
    height: '100%', 
    width: 28
  },
  cardHeader: {
    color: 'black'
  },
  muiButton: {
    position: 'absolute', 
    height: '100%', 
    marginRight: 0
  }
}

export default class ChallengeCard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      refresh: true,
      isEditing: false,
      challenge: this.props.challenge,
      prevMission: this.props.challenge.missionId,
      editingMission: this.props.editingMission
    }

    this.challenge = Object.assign({}, this.state.challenge);
    this.deleteChallenge = this.deleteChallenge.bind(this);
    this.editChallenge = this.editChallenge.bind(this);
    this.updateChallengeState = this.updateChallengeState.bind(this);
    this.saveChallenge = this.saveChallenge.bind(this);
    this.updatePrevMission = this.updatePrevMission.bind(this);
    this.updateNextMission = this.updateNextMission.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
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
    } 
    else {
      let val = e.target.value;
      if (e.target.name === 'targetTags') {
        val = val.split(",");
      }
      this.challenge[e.target.name] = val;
      this.setState({ challenge: this.challenge });
    }
  }

  saveChallenge() {
    let missionId = this.state.challenge.missionId
    let prevMission = this.state.prevMission
    let challengeId = this.state.challenge.id
    axios.put(`/api/challenge/${challengeId}/update`, this.state.challenge)
      .then(() => {
        if (prevMission !== missionId) {
          if (prevMission && missionId) {
            return axios.all([this.updatePrevMission(), this.updateNextMission()])
          } 
          else if (prevMission) {
            return axios.all([this.updatePrevMission()])
          } 
          else if (missionId) {
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

  handleOpen() {
    this.setState({ open: true });
  };

  handleClose() {
    this.setState({ open: false });
  };

  render() {
    console.log("EDITING MISSION: ", this.props.editingMission)
    if(this.state.editingMission){
      styles.card = {
        padding: 10, 
        margin: 10, 
        backgroundColor: 'white', 
        color: 'black', 
        display: 'inline-block',
        width: 700
      }
    }
    else{
      styles.card = {
        padding: 10, 
        margin: 10, 
        backgroundColor: 'white', 
        color: 'black'
      }
    }
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
          this.deleteChallenge(this.props.challenge.id)
        }} />
    ];

    if (this.state.isEditing) {
      return (
        <Card 
          style={styles.card}>
          <CardText style={styles.cardText} expandable={true}>
            <EditChallengeForm 
              onChange={this.updateChallengeState} 
              challenge={this.state.challenge} 
              editChallenge={this.props.editChallenge} 
              missionSpecific={this.props.missionSpecific} 
              missions={this.props.missions}/>
          </CardText>
          <CardActions 
            id="challenge-actions" 
            style={styles.cardActions} 
            expandable={true}>
            <div 
              className="mui-button" 
              style={styles.muiButton}>
              <IconButton 
                className="inside-mui-button" 
                tooltip="Save"
                tooltipPosition="top-center" 
                onClick={this.saveChallenge}
                iconStyle={{color: 'black'}} 
                style={styles.iconButton}>
                <ActionDone/>
              </IconButton>
              <IconButton 
                className="inside-mui-button" 
                tooltip="Cancel"
                tooltipPosition="top-center" 
                onClick={this.editChallenge}
                iconStyle={{color: 'black'}} 
                style={styles.iconButton}>
                <ContentClear/>
              </IconButton>
            </div>
          </CardActions>
        </Card>
      )
    } else {
      return (
        <Card style={styles.card}>
          <CardHeader 
            className="white-challenge-card" 
            actAsExpander={true} 
            showExpandableButton={true} 
            title={this.props.challenge.objective}
            titleStyle={{fontWeight: "bold", color: 'black'}} 
            style={styles.cardHeader} >
          </CardHeader>
          <CardText style={styles.cardText} expandable={true}>
            <div>
              <h5> Summary </h5>
              {this.props.challenge.summary} 
            </div>
            <div>
              <h4> Target Answers </h4>
              <div>
                <h5> Tags: </h5>
                {this.props.challenge.tagetTags} 
              </div>
              <div>
                <h5> Text: </h5>
                {this.props.challenge.tagetText} 
              </div>
            </div>
            <div>
              <h5> Conclusion </h5> 
              {this.props.challenge.conclusion} 
            </div>
            <div>
              <h5> Type </h5> 
              {this.props.challenge.category} 
            </div>
            {this.props.missionSpecific ? null : (
              this.props.challenge.mission ? 
                <div>
                  <h5> Mission </h5> 
                  {this.props.challenge.mission.title} 
                </div>
              : 
                <div>
                  <h5> Not assigned to mission </h5>
                  </div>
            )}
          </CardText>
          <Dialog
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
            overlayStyle={{background: 'rgba(250, 110, 60, .5)'}} >
            Are you sure you want to delete this challenge?
          </Dialog>
          <CardActions 
            id="challenge-actions" 
            style={styles.cardActions} 
            expandable={true}>
            <div 
              className="mui-button" 
              style={styles.muiButton}>
              <IconButton 
                className="inside-mui-button" 
                tooltip="Edit"
                tooltipPosition="top-center" 
                onClick={this.editChallenge}
                iconStyle={{color: 'black'}} 
                style={styles.iconButton}>
                <EditorModeEdit/>
              </IconButton>
              <IconButton 
                className="inside-mui-button" 
                tooltip="Delete"
                tooltipPosition="top-center" 
                style={styles.iconButton}    
                iconStyle={{color: 'black'}} 
                onClick={this.handleOpen} >
                <ActionDelete/>
              </IconButton>
            </div>
          </CardActions>
        </Card>
      )
    }
  }
}

import React, { Component } from 'react';
import { Link } from 'react-router';
import { Form } from 'formsy-react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card'
import { RaisedButton, FlatButton, IconButton } from 'material-ui';
import MyInput from './Input';
import MissionForm from './MissionForm';
import ChallengeForm from './ChallengeForm';
import ChallengeCard from './ChallengeCard';
import axios from 'axios';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import MissionCard from './MissionCard'

export default class EditMissions extends Component {
  constructor(props) {
    super(props)
    this.state = { fields: [], canSubmit: false, addMission: false, addOrSave: "ADD MISSION" }
    this.toggleAdd = this.toggleAdd.bind(this);
  }

  componentDidMount() {
    this.props.findMissions()
  }

  toggleAdd() {
    let bool = !this.state.addMission
    let buttonText = bool ? "SAVE MISSION" : "ADD MISSION"
    console.log("BUTTON TEXT: ", buttonText)
    if (this.state.addMission) {
      // post challenge to database
    }
    this.setState({ addMission: bool, addOrSave: buttonText })
  }

  render() {
    return (
      <div className="container jumbotron" style={{'padding-bottom': '15px'}}>
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
              (<RaisedButton type="button" className="mission-button" style={{margin: "20px 0px 0px 10px"}} label="ADD MISSION" onClick={this.toggleAdd}/>)
            }
      
            </div>
            </div>
    )
  }
}

// export class MissionCard extends Component {
//   constructor(props){
//     super(props)
//     this.state = {addChallenge: false, addOrSave: "ADD CHALLENGE"}
//     //this.handleClick = this.handleClick.bind(this);
//     this.toggleAdd = this.toggleAdd.bind(this);
//     this.deleteMission = this.deleteMission.bind(this);
//     this.editMission = this.editMission.bind(this);
//   }

//   toggleAdd(){
//     let bool = !this.state.addChallenge
//     let buttonText = bool ? "SAVE CHALLENGE" : "ADD CHALLENGE"
//     console.log("BUTTON TEXT: ", buttonText)
//     if(this.state.addChallenge){
//       // post challenge to database
//     }
//     this.setState({addChallenge: bool, addOrSave: buttonText})
//   }

//   deleteMission(id){
//     axios.delete(`/api/mission/${id}`)
//     .then(() => {
//       this.props.findMissions()
//     })
//   }

//   editMission(){
//     // do something
//   }


//   render () {
//     return (

//               <Card id={`mission-${this.props.mission.id}`} style={{padding: '10px', margin: '10px'}} key={this.props.mission.id}>
//                 <CardHeader actAsExpander={true} 
//                   showExpandableButton={true} title={this.props.mission.title}
//                   titleStyle={{fontWeight: "bold"}}>
//                   <div className="card-header"> {this.props.mission.description} </div>
//                 </CardHeader>
//                 <CardText expandable={true}>
//                   <div> IT WORKED </div>
//                   <div> Challenges </div>
//                   {this.props.mission.challenges.map((challenge, i) => {
//                     return(
//                     <ChallengeCard key={challenge.id} challenge={challenge} mission={this.props.mission} refreshCards={this.props.findMissions}
//                     missionSpecific={true}/>
//                     )
//                   })}
//                   {this.state.addChallenge ? <ChallengeForm missionSpecific={true} refreshCards={this.props.findMissions} mission={this.props.mission} toggleAdd={this.toggleAdd}/> : null}

//             {this.state.addChallenge ? 
//               (<RaisedButton type="submit" form="challenge-form" className="mission-button" label="SAVE CHALLENGE" />)
//               : null}
//             {this.state.addChallenge ? null :
//               (<RaisedButton type="button" className="mission-button" label="ADD CHALLENGE" onClick={this.toggleAdd}/>)
//             }
//                 </CardText>
//                 <CardActions id="actions" expandable={true}>
//                   <div className="mui-button" style={{position: 'absolute', height: '100%', 'marginRight': '0px'}}>
//                     <IconButton className="inside-mui-button" tooltip="edit"
//                       tooltipPosition="top-center" onClick={this.editMission}
//                       style={{padding: '0px', height: '100%', width: '28px'}}>
//                       <EditorModeEdit/>
//                     </IconButton>
//                     <IconButton className="inside-mui-button" tooltip="delete"
//                       tooltipPosition="top-center" onClick={() => this.deleteMission(this.props.mission.id)}
//                       style={{padding: '0px', height: '100%', width: '28px'}}>
//                       <ActionDelete/>
//                     </IconButton>
//                   </div>
//                 </CardActions>
//             </Card>

//     )
//   }
// }

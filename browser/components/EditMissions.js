import React, { Component } from 'react';
import { Link } from 'react-router';
import { Form } from 'formsy-react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton';
import MyInput from './Input';

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
    this.state = { fields: [], canSubmit: false, expanded: false }
    this.handleClick = this.handleClick.bind(this);
    this.buttonAlert = this.buttonAlert.bind(this);
  }

  componentDidMount () {
    this.props.findMissions()
  }

  handleClick(missionId){
    console.log("MISSION ID: ", missionId)
    console.log("this.state: ", this.state.expanded)
    if(this.state.expanded === missionId){
      console.log("already expanded")
      this.setState({expanded: false})
    }
    else{
      console.log("now expanding")
      this.setState({expanded: missionId})
    }
  }

  buttonAlert(){
    alert("testing button")
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
              <Card style={{padding: '10px', margin: '10px'}} key={mission.id}>
                <CardHeader actAsExpander={true} 
                  showExpandableButton={true} title={mission.title}
                  titleStyle={{"font-weight": "bold"}}>
                  <div className="card-header"> {mission.description} </div>
                </CardHeader>
                <CardText expandable={true}>
                  <div> IT WORKED </div>
                  {mission.challenges.map((challenge, i) => {
                    return(
                    <Card key={challenge.id}> 
                    <CardHeader title={challenge.objective}/> 
                    </Card>
                    )
                  })}
                </CardText>
                <CardActions expandable={true}>
                <FlatButton label="Add Challenge" onClick={this.buttonAlert}/>
                </CardActions>
            </Card>
            )})}

            </div>
            </div>
            </div>
          </MuiThemeProvider>
    )
    // return (
    //      <div>
    //      {this.props.missions.map((mission, i) => {
    //       if(this.state.expanded === mission.id) {
    //         return (
    //       <div style={{padding: '10px'}} key={mission.id} onClick={() => this.handleClick(mission.id)}>
    //       <div> {mission.title} </div>
    //       <div> {mission.description} </div>
    //       <div> IT WORKED </div>
    //       </div>
    //       )}
    //       else{
    //         return(
    //           <div style={{padding: '10px'}} key={mission.id} onClick={() => this.handleClick(mission.id)}>
    //       <div> {mission.title} </div>
    //       <div> {mission.description} </div>
    //       </div>
    //       )

    //       }})}
    //       </div>
    // )
  }
}
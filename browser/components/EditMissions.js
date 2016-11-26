import React, { Component } from 'react';
import { Link } from 'react-router';
import { Form } from 'formsy-react';

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

  render () {
    return (
         <div>
         {this.props.missions.map((mission, i) => {
          if(this.state.expanded === mission.id) {
            return (
          <div style={{padding: '10px'}} key={mission.id} onClick={() => this.handleClick(mission.id)}>
          <div> {mission.title} </div>
          <div> {mission.description} </div>
          <div> IT WORKED </div>
          </div>
          )}
          else{
            return(
              <div style={{padding: '10px'}} key={mission.id} onClick={() => this.handleClick(mission.id)}>
          <div> {mission.title} </div>
          <div> {mission.description} </div>
          </div>
          )

          }})}
          </div>
    )
  }
}
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
    this.state = { fields: [], canSubmit: false }

  }

  componentDidMount () {
    this.props.findMissions()
  }

  render () {
    return (
         <div>
         {this.props.missions.map((mission, i) => (
          <div key={mission.id}>
          <div> {mission.title} </div>
          <div> {mission.description} </div>
          </div>
          ))}
          </div>
    )
  }
}
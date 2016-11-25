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

export default class AddMission extends Component {
  constructor(props){
    super(props)
    this.state = { fields: [], canSubmit: false }

  }

  componentDidMount () {
   
  }

  render () {
    return (
         <div className="row">
              <form action="/api/mission" method="POST">
               <label>Title:</label><br/>
               <input type="text" name="title" />
               <label>Description:</label><br/>
               <input type="text" name="description" />
               <label>Place:</label><br/>
               <input type="text" name="place" />
               <label>Location:</label><br/>
               <input type="text" name="location" />
               <input type="submit" value="Submit"/>
              </form>
          </div>
    );
  }
}
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
    <label>Title:</label><br/>
               <MyInput type="text" name="title" />
               <label>Description:</label><br/>
               <MyInput type="text" name="description" />
               <label>Place:</label><br/>
               <MyInput type="text" name="place" />
               <label>Location:</label><br/>
               <MyInput type="text" name="location" />
      {props.data.map((field, i) => (
        <div className="field" key={field.id}>
          {
            field.type === 'input' ?
            (
              <div>
              <label>Challenge {i}</label> 
              <br/>
              <MyInput
                value=""
                name={`fields[${i}]`}
                required={field.required}
                validations={field.validations}
              />
              </div>
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
    this.addField = this.addField.bind(this)
    this.removeField = this.removeField.bind(this)
    this.submit = this.submit.bind(this)
  }

  componentDidMount () {
   
  }

  submit(data) {
    //console.log("Title: ", e.target.title.value)
    alert(JSON.stringify(data, null, 4));
  }
  addField() {
    let fieldData = {};
    fieldData.type = "input"
    fieldData.id = Date.now();
    this.setState({ fields: this.state.fields.concat(fieldData) });
  }
  removeField(pos) {
    const fields = this.state.fields;
    this.setState({ fields: fields.slice(0, pos).concat(fields.slice(pos+1)) })
  }
  enableButton() {
    this.setState({ canSubmit: true });
  }
  disableButton() {
    this.setState({ canSubmit: false });
  }

  render () {
    return (
         <div>
              <Form className="many-fields" onSubmit={this.submit}>
                <Fields data={this.state.fields} onRemove={this.removeField} />
                <button type="button" onClick={this.addField}>Add</button>
                <button type="submit">Submit</button>
              </Form>
          </div>
    );
  }
}
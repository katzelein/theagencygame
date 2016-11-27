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

export default class MissionForm extends Component {
  constructor(props){
    super(props)
    this.state = { fields: [], canSubmit: false, add: false, addOrSave: "ADD MISSION"}
    //this.handleClick = this.handleClick.bind(this);
    this.submitAlert = this.submitAlert.bind(this)
    this.closeForm = this.closeForm.bind(this)
  }

  submitAlert(e){
    e.preventDefault()
    let title = e.target.title.value
    let description = e.target.description.value
    let place = e.target.place.value
    let coordinates = e.target.location.value.split(",")
    let location = {type: "Point", coordinates}
    axios.post('/api/mission', {title, description, place, location})
    .then(() => {
      this.props.findMissions()
      this.props.toggleAdd()
    })
  }

  closeForm(){
    this.props.toggleAdd()
  }

  render () {
    return (
      <Card id="new-mission-form" style={{padding: '10px', margin: '10px'}}>
        <CardHeader style={{position: 'relative', padding: '10px 16px 10px 16px', height: '50px'}} title="NEW MISSION"
            titleStyle={{fontWeight: "bold", 'vertical-align': 'center'}}>
           {/* <div className="mui-button" style={{'padding-right': '0px', top: '0px', height: '21.25px', position: 'absolute'}}>*/}
            <IconButton className="inside-mui-button" tooltip="Cancel"
                    tooltipPosition="top-center" onClick={this.closeForm}
                    style={{padding: '2px 10px 0px 0px', height: '21.25px', width: '28px', position: 'absolute', top: '0px', right: '0px'}}>
          <ContentClear/>
        </IconButton>
        </CardHeader>
        <CardText>
          <form id="mission-form" onSubmit={this.submitAlert}> 
            <label>Title:</label><br/>
            <input type="text" name="title" /><br/>
            <label>Description: </label><br/>
            <textArea type="text" name="description"/><br/>
            <label>Place: </label><br/>
            <input type="text" name="place" /><br/>
            <label>Location: </label><br/>
            <input type="text" name="location" /><br/>
          </form>
        </CardText>
        </Card>   
    )
  }
}





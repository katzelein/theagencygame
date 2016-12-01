import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import axios from 'axios'

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index'
import CommunicationPhonelinkRing from 'material-ui/svg-icons/communication/phonelink-ring'
import CheckCircle from 'material-ui/svg-icons/action/check-circle'
import constants from "../../variables"

const style = {
  paper: {
    textAlign: 'center',
    display: 'inline-block',
  }
};

export class SendVerification extends Component {
  constructor(){
    super();
    this.state = {
      via: 1,
      countryCode: '',
      number: '',
      error: ''
    };
    this.handleCodeChange = this.handleCodeChange.bind(this)
    this.handlePhoneChange = this.handlePhoneChange.bind(this)
    this.startVerification = this.startVerification.bind(this)
  }

  componentDidMount () {

  }

  startVerification(e) {
    //dispatcher
    //1. check db for number
    //2. authy.startverification
    e.preventDefault()
    console.log("This is e: ", e.target.country_code.value)
    let countryCode = e.target.country_code.value
    let number = e.target.phone_number.value
    let via = 'sms'
    console.log("These are the countryCode, number" + countryCode + '' + number)
    if(!(countryCode && number)){
      //alert("Please provide your number")
      this.setState({error: "Please provide your number"})
    }

    else{
    this.setState({countryCode, number})
    let fullNumber = "+" + countryCode + number
    this.props.setNumber({countryCode, number})
    console.log("AFTER SET STATE: ", this.state)
    axios.get(`/api/user/exists/${fullNumber}`)
    .then(res => res.data)
    .then(user => {
      if(user.found){
        axios.post('/authy/verification/start', {countryCode, phoneNumber: number, via})
        .then(() => browserHistory.push('/verify'))
      }
      else{
        //alert("This number is not a registered number, please text the agency to get started")
        this.setState({error: "No account associated with this number"})
      }
    })
  }

    // don't send text if user is not in database

  }

  handleCodeChange (event, value) {
    console.log("This is the event: ", event)
    console.log("This is the value: ", value)

    this.setState({ countryCode: this.state.countryCode });

    console.log("This is the state after CodeChange", this.state)
  }

  handlePhoneChange (event, value) {
    console.log("This is the event: ", event)
    console.log("This is the value: ", value)
    this.setState({ number: event.target.value });
    console.log("This is the state after PhoneChange", this.state)
  }

  render () {
    return (
        <Grid>
          <Row>
            <Col xs={12}>
              <Row center="xs">
                <h3>Phone Verification</h3>
              </Row>

              <Row center="xs">
                <form role="form" onSubmit={this.startVerification}>

                  <Row>
                    <TextField
                      name="country_code"
                      floatingLabelText="Country Code"
                      hintText="1"
                      // value={this.state.countryCode}
                      onChange={this.handleCodeChange} />
                  </Row>

                  <Row>
                    <TextField
                      name="phone_number"
                      // value={this.state.number}
                      floatingLabelText="Phone #"
                      onChange={this.handlePhoneChange} />
                  </Row>

                  {/* <Row>
                    <SelectField
                      name="via"
                      // value={this.state.method}
                      floatingLabelText="Via"
                      onChange={this.handleViaChange}
                      style={{float: 'left', textAlign: 'left'}} >
                        <MenuItem value={1} primaryText="Text" />
                        <MenuItem value={2} primaryText="Call" />
                    </SelectField>
                  </Row>
                  */}

                  <br />
                  <Row center="xs">
                    <RaisedButton
                      type="submit"
                      style={{float: 'center'}}
                      icon={<CommunicationPhonelinkRing />}
                      label="Request Verification"
                      secondary={true} />
                  </Row>

                </form>
              </Row>

              <Row>
                {this.state.error ? <div className="error">{this.state.error}</div> : null}
              </Row>

            </Col>
          </Row>
        </Grid>
    );
  }
}


export class Verify extends Component {
  constructor(){
    super();
    this.verifyNumber = this.verifyNumber.bind(this)
    this.state = {};
  }

  componentDidMount () {

  }

  // startVerification(e) {
  //   //dispatcher
  //   //1. check db for number
  //   //2. authy.startverification
  //   e.preventDefault()
  //   let countryCode = e.target.country_code.value
  //   let phoneNumber = e.target.phone_number.value
  //   let method = e.target.via.value
  //   console.log("STATE: ", this.state)
  //   console.log("THIS: ", this)
  //   this.setState({showVerification: true,
  //     countryCode, phoneNumber})
  //   console.log("AFTER SET STATE: ", this.state)
  //   axios.post('/authy/verification/start', {countryCode, phoneNumber, method})
  //   .then(() => browserHistory.push('/'))
  // }

  verifyNumber(e){
    e.preventDefault()
    let token = e.target.token.value;
    // let countryCode = this.state.countryCode
    // let phoneNumber = this.state.phoneNumber
    let countryCode = this.props.phoneNumber.countryCode
    let phoneNumber = this.props.phoneNumber.number
    console.log("phone Number: ", phoneNumber)
    axios.post('/authy/verification/verify', {token, countryCode, phoneNumber})
    .then((res) => (res.data))
    .then((data) => {
      console.log("verifyNumber DATA: ", data)
      if(data.number && data.verified){
        this.props.findUser()
        browserHistory.push('/dashboard')
      }
      // do something different if user not found/incorrect verification token
      else if(data.verified === false){
        this.setState({error: "Incorrect token"})
        //alert("Incorrect token")
      }
      else this.setState({error: data.error})
    })
  }

  render () {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <Row center="xs">
              <h3>Verify By Token</h3>
            </Row>

            <Row center="xs">
              <form role="form" onSubmit={this.verifyNumber}>

                <Row>
                  <TextField
                    type="text"
                    name="token"
                    floatingLabelText="Verification Token"
                    hintText="Verification Token"
                    style={{textAlign: 'center'}}
                    onChange={this.handleTokenChange} />
                </Row>

                <br />

                <Row center="xs">
                  <RaisedButton
                    type="submit"
                    style={{float: 'center'}}
                    icon={<CheckCircle />}
                    label="Verify Phone"
                    secondary={true} />
                </Row>

              </form>
            </Row>

            <Row center="xs">
              {this.state.error ?
                <div style={{height: '20px', padding: '2px 0px'}} className="error">{this.state.error}</div>
                :
                <div style={{height: '20px', padding: '2px 0px'}}/>
              }
            </Row>

            <Row center="xs">
              <div><Link to="/sendVerification">Request new code</Link></div>
            </Row>

          </Col>
        </Row>
      </Grid>
    );
  }
}

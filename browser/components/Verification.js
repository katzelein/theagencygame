import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import axios from 'axios'

export class SendVerification extends Component {
  constructor(){
    super();
    this.startVerification = this.startVerification.bind(this)
    this.state = {};
  }

  componentDidMount () {

  }

  startVerification(e) {
    //dispatcher
    //1. check db for number
    //2. authy.startverification


    e.preventDefault()
    let countryCode = e.target.country_code.value
    let number = e.target.phone_number.value
    let method = e.target.via.value
    console.log("STATE: ", this.state)
    console.log("THIS: ", this)
    this.setState({countryCode, number})
    let fullNumber = "+" + countryCode + number
    this.props.setNumber({countryCode, number})
    console.log("AFTER SET STATE: ", this.state)
    // don't send text if user is not in database
    axios.post('/authy/verification/start', {countryCode, phoneNumber: number, method})
    .then(() => browserHistory.push('/verify'))
  }

  // verifyNumber(e){
  //   e.preventDefault()
  //   let token = e.target.token.value;
  //   let countryCode = this.state.countryCode
  //   let phoneNumber = this.state.phoneNumber
  //   axios.post('/authy/verification/verify', {token, countryCode, phoneNumber})
  //   .then((res) => (res.data))
  //   .then((data) => {
  //     console.log("verifyNumber DATA: ", data)
  //     if(data.number && data.verified){
  //       this.props.findUser(data.number)
  //     }
  //     browserHistory.push('/dashboard')
  //   })
  // }

  render () {
    return (
  <div className="container">
    <div className="row centered-form">
        <div className="col-xs-12 col-sm-8 col-md-4 col-sm-offset-2 col-md-offset-4">
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">Authy Phone Verification</h3>

                      <div className="panel-body">
                    <form role="form" onSubmit={this.startVerification}>
                        <div className="row">
                            <div className="col-xs-3 col-sm-3 col-md-3">
                                <div className="form-group">
                                    <input type="text" name="country_code" id="country_code"
                                           className="form-control"
                                           className="form-control input-sm"
                                           placeholder="Country Code"/>
                                </div>
                            </div>
                            <div className="col-xs-6 col-sm-6 col-md-6">
                                <div className="form-group">
                                    <input type="text" name="phone_number" id="phone_number"
                                           className="form-control"
                                           className="form-control input-sm"
                                           placeholder="Phone #"/>
                                </div>
                            </div>
                            <div className="col-xs-3 col-sm-3 col-md-3">
                                <div className="form-group">
                                    <select name="via" id="via" className="form-control">
                                        <option value="sms" defaultValue="selected">SMS</option>
                                        <option value="call">CALL</option>
                                    </select>
                                </div>
                            </div>

                        </div>

                        <input type="submit" value="Request Verification"
                               className="btn btn-info btn-block"/>
                    </form>
                </div>
                </div>
            </div>
        </div>
    </div>
</div>
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
      }
      // do something different if user not found/incorrect verification token
      browserHistory.push('/dashboard')
    })
  }

  render () {
    return (
  <div className="container">
    <div className="row centered-form">
        <div className="col-xs-12 col-sm-8 col-md-4 col-sm-offset-2 col-md-offset-4">
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">Authy Phone Verification</h3>

                      <div className="panel-body">
                    <form role="form" onSubmit={this.verifyNumber}>
                        <div className="row">
                            <div className="col-xs-6 col-sm-6 col-md-6">
                                <div className="form-group">
                                    <input type="text" name="token"
                                           id="token"
                                           className="form-control"
                                           className="form-control input-sm"
                                           placeholder="Verification Token"/>
                                </div>
                            </div>
                            <div className="col-xs-6 col-sm-6 col-md-6">
                                <div className="form-group">
                                    <input type="submit" value="Verify Phone"
                                           className="btn btn-info btn-block"/>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>
                </div>
            </div>
        </div>
    </div>
</div>
    );
  }
}
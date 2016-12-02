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

const styles = {
  paper: {
    textAlign: 'center',
    display: 'inline-block',
  },
  raisedButton: {
    float: 'center'
  },
  textField: {
    textAlign: 'center'
  },
  error: {
    height: 20, 
    padding: '2px 0px'
  }
};

export class SendVerification extends Component {
  constructor() {
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

  startVerification(e) {
    e.preventDefault()
    let countryCode = e.target.country_code.value
    let number = e.target.phone_number.value
    let via = 'sms'

    if (!(countryCode && number)) {
      this.setState({ error: "Please provide your number" })
    } else {
      this.setState({ countryCode, number })
      let fullNumber = "+" + countryCode + number
      this.props.setNumber({ countryCode, number })

      axios.get(`/api/user/exists/${fullNumber}`)
        .then(res => res.data)
        .then(user => {
          if (user.found) {
            axios.post('/authy/verification/start', { countryCode, phoneNumber: number, via })
              .then(() => browserHistory.push('/verify'))
          } else {
            this.setState({ error: "No account associated with this number" })
          }
        })
    }
  }

  handleCodeChange(event, value) {
    this.setState({ countryCode: this.state.countryCode });
  }

  handlePhoneChange(event, value) {
    this.setState({ number: event.target.value });
  }

  render() {
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
                    default="1"
                    hintText="1"
                    onChange={this.handleCodeChange} />
                </Row>

                <Row>
                  <TextField
                    name="phone_number"
                    floatingLabelText="Phone #"
                    onChange={this.handlePhoneChange} />
                </Row>

                <br />
                <Row center="xs">
                  <RaisedButton
                    type="submit"
                    style={styles.raisedButton}
                    icon={<CommunicationPhonelinkRing />}
                    label="Request Verification"
                    secondary={true} />
                </Row>

                <Row>
                  {this.state.error ? <div className="error">{this.state.error}</div> : null}
                </Row>

              </form>
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }
}


export class Verify extends Component {
  constructor() {
    super();
    this.verifyNumber = this.verifyNumber.bind(this)
    this.state = {};
  }

  verifyNumber(e) {
    e.preventDefault()
    let token = e.target.token.value;
    let countryCode = this.props.phoneNumber.countryCode
    let phoneNumber = this.props.phoneNumber.number

    axios.post('/authy/verification/verify', { token, countryCode, phoneNumber })
      .then((res) => (res.data))
      .then((data) => {
        if (data.number && data.verified) {
          this.props.findUser()
          browserHistory.push('/dashboard')
        }
        // do something different if user not found/incorrect verification token
        else if (data.verified === false) {
          this.setState({ error: "Incorrect token" })
        } else this.setState({ error: data.error })
      })
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <Row center="xs">
              <h3>Verify By Token</h3>
            </Row>
            <Row center="xs">
              <form role="form" onSubmit={this.verifyNumber} autoComplete="off">
                <Row>
                  <TextField
                    type="text"
                    name="token"
                    floatingLabelText="Verification Token"
                    hintText="Verification Token"
                    style={styles.textField}
                    onChange={this.handleTokenChange} />
                </Row>
                <br />
                <Row center="xs">
                  <RaisedButton
                    type="submit"
                    style={styles.raisedButton}
                    icon={<CheckCircle />}
                    label="Verify Phone"
                    secondary={true} />
                </Row>
              </form>
            </Row>
            <Row center="xs">
              
              {this.state.error ?
                <div style={styles.error} className="error">{this.state.error}</div>
                :
                <div style={styles.error}/>
              }

            </Row>
            <Row center="xs">
              <div>
                <Link to="/sendVerification">Request new code</Link>
              </div>
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }
}

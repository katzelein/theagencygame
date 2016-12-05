const twilioAPI = require('express').Router()
const twilio = require('twilio')

const accountSid = require('../variables').accountSid;
const authToken = require('../variables').authToken;
const twilioNum = require('../variables').twilioNum;
const client = require('twilio')(accountSid, authToken);

const checkWatsonPromise = require('./watson')
const {lookup} = require('./lookup')

const {sendSimpleText} = require('./send-sms')

/*
 * voice cals are directed here
 * tells twilio to create a recording of the voice call
 *    and send the recording to /voice/recording
 */
twilioAPI.post('/voice', function (req, res, next) {
  let twiml = new twilio.TwimlResponse();
  twiml.say('Go ahead agent.', {
    voice: 'woman'
  })
    .record({
      maxLength: 12,
      action: '/voice/recording'
    })
  res.send(twiml.toString())
});

/*
 * recordings of voice calls are directed here
 */
twilioAPI.post('/recording', function (req, res, next) {

  var answer = lookup(req.body.From, req.body)

  // send text to caller
  return answer
  .then(message => {
    console.log("answer message: ",message)
    sendSimpleText(req.body.From, message)
  })
  .then(() => {
    res.sendStatus(200);
  })
  .catch(err => console.log(err))
})

module.exports = {twilioAPI}; //,checkWatsonAPI

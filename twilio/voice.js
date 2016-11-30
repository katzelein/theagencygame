const twilioAPI = require('express').Router()
const twilio = require('twilio')

const accountSid = require('../variables').accountSid;
const authToken = require('../variables').authToken;
const twilioNum = require('../variables').twilioNum;
const client = require('twilio')(accountSid, authToken);

const checkWatsonPromise = require('./watson')
const lookup = require('./lookup')

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


twilioAPI.post('/recording', function (req, res, next) {
  console.log("THIS IS THE REQ YOU WANT", req.body)
  // req.body.From still gives us the user phone number

  // let result = checkWatsonPromise(req.body)

  // console.log('result:', result);
  // result.then(resolved => {
  //   console.log('resolved:', resolved)
  // })

  // KARIN: This is where you would use your game logic, either lookup or whatever new helper function you've written, to incorporate the result. Result will be a string, all lowercase, that you can compare to the targetText

  console.log("From:", req.body.From)

  var answer = lookup(req.body.From, req.body)

  // this doesn't work. Help
  return answer
  .then(message => {
    console.log("answer message: ",message)
    return client.sendMessage({
      to: req.body.From,
      from: twilioNum,
      body: message
    })
  })
  .catch(err => console.log(err))
})


module.exports = {twilioAPI}; //,checkWatsonAPI


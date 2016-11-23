var twilioAPI = require('express').Router()
var twilio = require('twilio')
var rp = require('request-promise');
var geocoder = require('geocoder');

var lookup = require('./lookup')

/*
* Handle data from Twilio
*/

twilioAPI.get('/', function(req, res, next){
})

twilioAPI.post('/messages', function(req, res, next){
  //console.log("Hey this is a message")
  console.log("REQ BODY: ", req.body)
  console.log("MEDIA URL: ", req.body.MediaUrl)

  console.log("From", req.body.From, "Body", req.body.Body)



  var answer = lookup(req.body.From, req.body) // must return a promise
  console.log("ANSWER: ", answer)
  answer
  .then(message => {
    console.log("answer message: ", message)
    var twiml = new twilio.TwimlResponse();
    twiml.message(function() {
      this.body(message);
    });
    res.writeHead(200, {'Content-Type': 'text/xml'})
    res.end(twiml.toString())
  })

});

// PHONE AND SPEECH-TO-TEXT 

const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
const watsonUsername = require('../constants').watsonUsername
const watsonPassword = require('../constants').watsonPassword
const fs = require('fs');
const User = require('../models/user')
const Message = require('../models/message')

const accountSid = require('../constants').accountSid;
const authToken = require('../constants').authToken;
const twilioNum = require('../constants').twilioNum;
const client = require('twilio')(accountSid, authToken); 
const fetch = require('node-fetch');
const request = require('request');


let speech_to_text = new SpeechToTextV1({
  username: watsonUsername,
  password: watsonPassword
});


twilioAPI.post('/voice', function (req, res, next) {
  let twiml = new twilio.TwimlResponse();
  twiml.say('Go ahead agent.', { 
    voice: 'woman' 
  })
    .record({
      maxLength: 12,
      action: '/twilio/recording'
    })
  // res.type('text/xml')
  res.send(twiml.toString())
});


twilioAPI.post('/recording', function (req, res, next) {
  console.log("THIS IS THE REQ.BODY TEXT: ",req.body)
  // save message in the database

  User.findOne({where: { phoneNumber: req.body.From}})
    .then(user => {
      if (user) {
            let params = {
              audio: request(req.body.RecordingUrl),
              content_type: 'audio/l16; rate=44100'
            }
            console.log("THESE ARE THE PARAMS", params)
            speech_to_text.recognize(params, function (err, res) {
              if (err) console.log(err);
              else console.log(JSON.stringify(res, null, 2));
            });
          })
      }
      // else respond to the user with some kind of error message...
    }) 
})


// END OF VOICE AND SPEECH-TO-TEXT

twilioAPI.post('/testing', function(req, res, next){
  //console.log("Hey this is a message")
  console.log("REQ BODY: ", req.body)
  console.log("MEDIA URL: ", req.body.MediaUrl)
  console.log("From", req.body.From, "Body", req.body.Body)

  var answer = lookup(req.body.From, req.body)

  // answer = "Hi"

  console.log(answer);
  answer
  .then(message => {
    message += '\n'
    res.send(message)
  })
});

module.exports = twilioAPI

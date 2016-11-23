var twilioAPI = require('express').Router()
var twilio = require('twilio')
var rp = require('request-promise');
var geocoder = require('geocoder');

// var clientId = require('../constants').clarifaiClientId
// var clientSecret = require('../constants').clarifaiClientSecret
// var accessToken = require('../constants').clarifaiAccessToken

var lookup = require('./lookup')

// var Clarifai = require('clarifai');
// var clarifaiAPI = new Clarifai.App(
//   clientId,
//   clientSecret
// );

/*
* Handle data from Twilio
*/

twilioAPI.get('/', function(req, res, next){
})

// twilioAPI.post('/messages', function(req, res, next){
//   //console.log("Hey this is a message")
//   console.log("REQ BODY: ", req.body)
//   console.log("MEDIA URL: ", req.body.MediaUrl0)
//   if (req.body.MediaUrl0){
//     analyzePhoto(req.body.MediaUrl0)
//   } else {
//     console.log('There was no media in this message')
//   }
//   var twiml = new twilio.TwimlResponse();
//   twiml.message(function() {
//     this.body('The Robots are coming! Head for the hills!');
//   });
//   res.writeHead(200, {'Content-Type': 'text/xml'})
//   res.end(twiml.toString())
// });

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
        fetch(req.body.RecordingUrl)
          .then(function (res) {
            console.log("THIS IS THE RESPONSE", res)
            let params = {
              audio: fs.createReadStream(res),
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


  var answer = lookup(req.body.From, req.body.Body)

  // answer = "Hi"

  console.log(answer);
  answer
  .then(message => {
    message += '\n'
    res.send(message)
  })
});


/*
* Handle making requests to Clarifai
*/
// function analyzePhoto(mediaUrl){
//   clarifaiAPI.models.predict(Clarifai.GENERAL_MODEL, mediaUrl).then(
//        (res) => {
//          console.log('Clarifai response = ', res);
//          let tags = [];
//          for (let i = 0; i<res.data.outputs[0].data.concepts.length; i++) {
//            tags.push(res.data.outputs[0].data.concepts[i].name);
//          }
//          console.log("TAGS!!!", tags)
//        },
//        (err) => {
//          console.error(err);
//        }
//      )
// }

module.exports = twilioAPI

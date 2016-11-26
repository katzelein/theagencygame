const twilioAPI = require('express').Router()
const twilio = require('twilio')
const fs = require('fs');
const request = require('request');

const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
const watsonUsername = require('../constants').watsonUsername
const watsonPassword = require('../constants').watsonPassword

const accountSid = require('../constants').accountSid;
const authToken = require('../constants').authToken;
const twilioNum = require('../constants').twilioNum;
const client = require('twilio')(accountSid, authToken); 

const lookup = require('./lookup')

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
      action: '/voice/recording'
    })
  res.send(twiml.toString())
});


twilioAPI.post('/recording', function (req, res, next) {
  console.log("THIS IS THE REQ YOU WANT", req.body)
  lookup(req.body.From, req.body)
    .then(res => console.log(res))
})

// let checkWatsonAPI = function (body) {
//   // get the WAV file from twilio
//   request(body.RecordingUrl).pipe(fs.createWriteStream('message.wav')).on('end', ok => console.log('wrote message.wav'))
//   // check it in Watson
//   let params = {
//     audio: request(body.RecordingUrl),
//     content_type: 'audio/l16; rate=8000',
//     model: 'en-US_NarrowbandModel',
//   }
//   speech_to_text.recognize(params, function (err, res) {
//     if (err) console.log("This is the error you're getting: ", err);
//     else {
//       console.log("These are the correct results!", JSON.stringify(res, null, 2));
//       return res
//     }
//   });
// }

module.exports = {twilioAPI} //,checkWatsonAPI
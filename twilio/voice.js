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
  // req.body.To still gives us the user phone number

  let result = checkWatsonAPI(req.body)

  // KARIN: This is where you would use your game logic, either lookup or whatever new helper function you've written, to incorporate the result. Result will be a string, all lowercase, that you can compare to the targetText

  //
  //
  //

})

let checkWatsonAPI = function (body) {

  // get the WAV file from twilio
  request(body.RecordingUrl).pipe(fs.createWriteStream('message.wav')).on('end', ok => console.log('wrote message.wav'))
  
  // check it in Watson
  let params = {
    audio: request(body.RecordingUrl),
    content_type: 'audio/wav',
    model: 'en-US_NarrowbandModel'
  }
  speech_to_text.recognize(params, function (err, res) {
    if (err) {
      console.log("Watson cannot detect transcript", err)
      return '';
    }
    else {
      console.log("Message transcript detected")
      // returns a string to match, ex: "how are you today"
      let result = res.results[0].alternatives[0].transcript.toLowerCase()
      return result;
    }
  });
}

module.exports = {twilioAPI} //,checkWatsonAPI
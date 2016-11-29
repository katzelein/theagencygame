const twilioAPI = require('express').Router()
const twilio = require('twilio')
const fs = require('fs');
const request = require('request');
const Q = require('q');

const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
const watsonUsername = require('../variables').watsonUsername
const watsonPassword = require('../variables').watsonPassword

const accountSid = require('../variables').accountSid;
const authToken = require('../variables').authToken;
const twilioNum = require('../variables').twilioNum;
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
  // req.body.From still gives us the user phone number

  // let result = checkWatsonPromise(req.body)

  // console.log('result:', result);
  // result.then(resolved => {
  //   console.log('resolved:', resolved)
  // })
  // KARIN: This is where you would use your game logic, either lookup or whatever new helper function you've written, to incorporate the result. Result will be a string, all lowercase, that you can compare to the targetText

  var answer = lookup(req.body.From, req.body)

  
  

})

let checkWatsonPromise = function (body) {

  // get the WAV file from twilio
  request(body.RecordingUrl).pipe(fs.createWriteStream('message.wav')).on('end', ok => console.log('wrote message.wav'))

  // check it in Watson
  let params = {
    audio: request(body.RecordingUrl),
    content_type: 'audio/wav',
    model: 'en-US_NarrowbandModel'
  }
  
  let speechTextPromise = Q.denodeify(speech_to_text.recognize.bind(speech_to_text))

  return speechTextPromise(params)
  .then((result) => {
    console.log("Message transcript detected")
    // returns a string to match, ex: "how are you today"
    // console.log(res);
    console.log(result[0])
    let transcript = result[0].results[0].alternatives[0].transcript.toLowerCase()
    console.log(transcript)
    return transcript;
  })
}



let checkWatsonAPI = function (body) {

  // get the WAV file from twilio
  request(body.RecordingUrl).pipe(fs.createWriteStream('message.wav')).on('end', ok => console.log('wrote message.wav'))

  // check it in Watson
  let params = {
    audio: request(body.RecordingUrl),
    content_type: 'audio/wav',
    model: 'en-US_NarrowbandModel'
  }
  
  let result;

  speech_to_text.recognize(params, function (err, res) {
    if (err) {
      console.log("Watson cannot detect transcript", err)
      return '';
    }
    else {
      console.log("Message transcript detected")
      // returns a string to match, ex: "how are you today"
      console.log(res);
      console.log(res.results[0])
      result = res.results[0].alternatives[0].transcript.toLowerCase()
      console.log(result)
      return result;
    }
  });

  return result;
}

module.exports = {twilioAPI, checkWatsonPromise} //,checkWatsonAPI

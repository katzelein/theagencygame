const fs = require('fs');
const request = require('request');
const Q = require('q');

const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
const watsonUsername = require('../variables').watsonUsername
const watsonPassword = require('../variables').watsonPassword

let speech_to_text = new SpeechToTextV1({
  username: watsonUsername,
  password: watsonPassword
});

const checkWatsonPromise = function (body) {

  // needs internet -___-''
  // get the WAV file from twilio

  request(body.RecordingUrl).pipe(fs.createWriteStream('message.wav')).on('end', ok => console.log('wrote message.wav'))

  // do we need this if params includes recordingurl???

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

module.exports = {checkWatsonPromise}; //,checkWatsonAPI

/*
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
      result = res.results[0].alternatives[0].transcript.toLowerCase().trim();
      console.log(result)
      return result;
    }
  });

  return result;
}
*/

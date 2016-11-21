  // FOR TWILIO'S VOICE-TO-TEXT TRANSCRIPTION

const accountSid = require('../constants').accountSid;
const authToken = require('../constants').authToken;
const twilioNum = require('../constants').twilioNum;
let client = require('twilio')(accountSid, authToken); 


client.transcriptions(req.body.SmsMessageSid).get(function(err, transcription) {
    console.log(transcription.transcriptionText);
});





  // END OF TWILIO'S VOICE-TO-TEXT TRANSCRIPTION
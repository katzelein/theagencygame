const accountSid = require('../constants').accountSid;
const authToken = require('../constants').authToken;
const twilioNum = require('../constants').twilioNum;
let client = require('twilio')(accountSid, authToken); 

console.log(client)

client.recordings.list(function(err, data) {
    data.recordings.forEach(function(recording) {
        console.log(recording.Duration);
    });
});
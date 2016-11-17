const constants = require('../constants')

// Twilio Credentials 
const accountSid = constants.accountSid;
const authToken = constants.authToken;
const twilioNum = constants.twilioNum;
 
//require the Twilio module and create a REST client 
let client = require('twilio')(accountSid, authToken); 
 
client.messages.create({ 
    to: "+18607485586", 
    from: twilioNum, 
    body: "This is the ship that made the Kessel Run in fourteen parsecs?", 
}, function(err, message) { 
    console.log(message.sid); 
});
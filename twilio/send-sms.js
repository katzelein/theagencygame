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


// var twilio = require('twilio');

// var app = require('../app')

// app.post('/sms', function(req, res) {
//   var twilio = require('twilio');
//   var twiml = new twilio.TwimlResponse();
//   twiml.message('The Robots are coming! Head for the hills!');
//   res.writeHead(200, {'Content-Type': 'text/xml'});
//   res.end(twiml.toString());
// });
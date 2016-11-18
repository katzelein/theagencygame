var twilioAPI = require('express').Router()
var twilio = require('twilio')

twilioAPI.get('/')

twilioAPI.post('/messages', function(req, res, next){
  //console.log("Hey this is a message")
  console.log("REQ BODY: ", req.body)
  console.log("MEDIA URL: ", req.body.MediaUrl[0])
  var twiml = new twilio.TwimlResponse();
    twiml.message(function() {
      this.body('The Robots are coming! Head for the hills!');
    });
    res.writeHead(200, {'Content-Type': 'text/xml'})
    res.end(twiml.toString())
});

module.exports = twilioAPI
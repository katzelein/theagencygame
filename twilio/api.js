var twilioAPI = require('express').Router
var twilio = require('twilio')

twilioAPI.post('/twilio/messages', function(req, res, next){
  var twiml = new twilio.TwimlResponse();
    twiml.message(function() {
      this.body('The Robots are coming! Head for the hills!');
    });
    res.writeHead(200, {'Content-Type': 'text/xml'})
    res.end(twiml.toString())
});

module.exports = twilioAPI
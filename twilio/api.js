var twilioAPI = require('express').Router()
var twilio = require('twilio')
var lookup = require('./helpers');

twilioAPI.get('/')

twilioAPI.post('/messages', function(req, res, next){
  //console.log("Hey this is a message")
  console.log("REQ BODY: ", req.body)
  console.log("MEDIA URL: ", req.body.MediaUrl)
  var twiml = new twilio.TwimlResponse();
    twiml.message(function() {
      this.body('The Robots are coming! Head for the hills!');
    });
    res.writeHead(200, {'Content-Type': 'text/xml'})
    res.end(twiml.toString())
});


twilioAPI.post('/messages', function(req, res, next){
  //console.log("Hey this is a message")
  console.log("REQ BODY: ", req.body)
  console.log("MEDIA URL: ", req.body.MediaUrl)
  var answer = lookup(req.body.From, req.body.Body)

  var twiml = new twilio.TwimlResponse();
    twiml.message(function() {
      this.body('The Robots are coming! Head for the hills!');
    });
    res.writeHead(200, {'Content-Type': 'text/xml'})
    res.end(twiml.toString())
});

module.exports = twilioAPI
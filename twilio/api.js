var twilioAPI = require('express').Router()
var twilio = require('twilio')

var lookup = require('./lookup')

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


twilioAPI.post('/game', function(req, res, next){
  //console.log("Hey this is a message")
  console.log("REQ BODY: ", req.body)
  console.log("MEDIA URL: ", req.body.MediaUrl)

  console.log("From", req.body.From, "Body", req.body.Body)
  
  var answer = lookup(req.body.From, req.body.Body)

  answer
  .then(message => {
    var twiml = new twilio.TwimlResponse();
    twiml.message(function() {
      this.body(message);
    });
    res.writeHead(200, {'Content-Type': 'text/xml'})
    res.end(twiml.toString())
  })
  
});


twilioAPI.post('/testing', function(req, res, next){
  //console.log("Hey this is a message")
  console.log("REQ BODY: ", req.body)
  console.log("MEDIA URL: ", req.body.MediaUrl)
  console.log("From", req.body.From, "Body", req.body.Body)


  var answer = lookup(req.body.From, req.body.Body)

  // answer = "Hi"

  console.log(answer);
  answer
  .then(message => {
    message += '\n'
    res.send(message)
  })
});


module.exports = twilioAPI
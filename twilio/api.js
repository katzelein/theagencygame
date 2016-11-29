var twilioAPI = require('express').Router()
var twilio = require('twilio')
var rp = require('request-promise');
var geocoder = require('geocoder');

var lookup = require('./lookup')
var getPhotoTags = require('./clarifai')
const {accountSid, authToken} = require('../variables')

var client = require('twilio')(accountSid, authToken);

/*
* Handle data from Twilio
*/

twilioAPI.get('/', function(req, res, next){
})

twilioAPI.post('/messages', function(req, res, next){
  console.log("REQ BODY: ", req.body)
  // console.log("MEDIA URL: ", req.body.MediaUrl0)
  // console.log("From", req.body.From, "Body", req.body.Body)

  var answer = lookup(req.body.From, req.body) // must return a promise
  // console.log("ANSWER: ", answer)

  answer
  .then(message => {
    console.log("answer message: ", message)
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

  var answer = lookup(req.body.From, req.body)

  console.log(answer);
  answer
  .then(message => {
    message += '\n'
    res.send(message)
  })
});

module.exports = twilioAPI

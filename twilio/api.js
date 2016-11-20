var twilioAPI = require('express').Router()
var twilio = require('twilio')
var rp = require('request-promise');
var geocoder = require('geocoder');

// var clientId = require('../constants').clarifaiClientId
// var clientSecret = require('../constants').clarifaiClientSecret
// var accessToken = require('../constants').clarifaiAccessToken

var lookup = require('./lookup')

// var Clarifai = require('clarifai');
// var clarifaiAPI = new Clarifai.App(
//   clientId,
//   clientSecret
// );

/*
* Handle data from Twilio
*/

twilioAPI.get('/', function(req, res, next){
})

// twilioAPI.post('/messages', function(req, res, next){
//   //console.log("Hey this is a message")
//   console.log("REQ BODY: ", req.body)
//   console.log("MEDIA URL: ", req.body.MediaUrl0)
//   if (req.body.MediaUrl0){
//     analyzePhoto(req.body.MediaUrl0)
//   } else {
//     console.log('There was no media in this message')
//   }
//   var twiml = new twilio.TwimlResponse();
//   twiml.message(function() {
//     this.body('The Robots are coming! Head for the hills!');
//   });
//   res.writeHead(200, {'Content-Type': 'text/xml'})
//   res.end(twiml.toString())
// });

twilioAPI.post('/messages', function(req, res, next){
  //console.log("Hey this is a message")
  console.log("REQ BODY: ", req.body)
  console.log("MEDIA URL: ", req.body.MediaUrl)

  console.log("From", req.body.From, "Body", req.body.Body)

  
  
  var answer = lookup(req.body.From, req.body)

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

/*
* Handle making requests to Clarifai
*/
// function analyzePhoto(mediaUrl){
//   clarifaiAPI.models.predict(Clarifai.GENERAL_MODEL, mediaUrl).then(
//        (res) => {
//          console.log('Clarifai response = ', res);
//          let tags = [];
//          for (let i = 0; i<res.data.outputs[0].data.concepts.length; i++) {
//            tags.push(res.data.outputs[0].data.concepts[i].name);
//          }
//          console.log("TAGS!!!", tags)
//        },
//        (err) => {
//          console.error(err);
//        }
//      )
// }

module.exports = twilioAPI

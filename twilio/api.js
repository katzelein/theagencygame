var twilioAPI = require('express').Router()
var twilio = require('twilio')

var clientId = require('../constants').clarifaiClientId
var clientSecret = require('../constants').clarifaiClientSecret
var accessToken = require('../constants').clarifaiAccessToken

var Clarifai = require('clarifai');
var clarifaiAPI = new Clarifai.App(
  clientId,
  clientSecret
);

/*
* Handle data from Twilio
*/

twilioAPI.get('/', function(req, res, next){
})

twilioAPI.post('/messages', function(req, res, next){
  //console.log("Hey this is a message")
  if (req.body.MediaUrl0){
    analyzePhoto(req.body.MediaUrl0)
  } else {
    console.log('There was no media in this message')
  }
  var twiml = new twilio.TwimlResponse();
  twiml.message(function() {
    this.body('The Robots are coming! Head for the hills!');
  });
  res.writeHead(200, {'Content-Type': 'text/xml'})
  res.end(twiml.toString())
});

/*
* Handle making requests to Clarifai
*/
function analyzePhoto(mediaUrl){
  clarifaiAPI.models.predict(Clarifai.GENERAL_MODEL, mediaUrl).then(
       (res) => {
         console.log('Clarifai response = ', res);
         let tags = [];
         for (let i = 0; i<res.data.outputs[0].data.concepts.length; i++) {
           tags.push(res.data.outputs[0].data.concepts[i].name);
         }
         console.log("TAGS!!!", tags)
       },
       (err) => {
         console.error(err);
       }
     )
}

module.exports = twilioAPI

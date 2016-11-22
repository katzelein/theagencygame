var clientId = require('../constants').clarifaiClientId
var clientSecret = require('../constants').clarifaiClientSecret
var accessToken = require('../constants').clarifaiAccessToken

var Clarifai = require('clarifai');
var clarifaiAPI = new Clarifai.App(
  clientId,
  clientSecret
);

/*
* Handle making requests to Clarifai
*/
function analyzePhoto(message){
  if (message.MediaContentType0 === 'image/jpeg' ||
      message.MediaContentType0 === 'image/gif' ||
      message.MediaContentType0 === 'image/png'){
      analyzePhoto(req.body.MediaUrl0)
    } else {
      console.log('There was no media in this message')
    }


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

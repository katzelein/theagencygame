var clientId = require('../constants').clarifaiClientId
var clientSecret = require('../constants').clarifaiClientSecret
var accessToken = require('../constants').clarifaiAccessToken

var Clarifai = require('clarifai');
var clarifaiAPI = new Clarifai.App(
  clientId,
  clientSecret
);

var customModelId = 'bd006c0d75564935a8419ea5ba6a5a07'
var generalModelId = Clarifai.GENERAL_MODEL;


/*
* Function to call from lookup, takes a message and returns the tags array
*/
function getPhotoTags(message){
  var tags = [];
  if (message.MediaContentType0 === 'image/jpeg' ||
      message.MediaContentType0 === 'image/gif' ||
      message.MediaContentType0 === 'image/png'){
      //Make calls to Clarifai for custom model and general model
      tags.concat(analyzePhoto(customModelId, message.MediaUrl0))
      tags.concat(analyzePhoto(generalModelId, message.MediaUrl0))
      return tags;
    } else {
      console.log('There was no media in this message')
    }
  }

  /*
  * Function to make Clarifai calls w/specified model
  */
function analyzePhoto(modelToUse, mediaUrl){
  clarifaiAPI.models.predict(modelToUse, mediaUrl).then(
       (res) => {
         console.log('Clarifai response = ', res);
         let tags = [];
         for (let i = 0; i<res.data.outputs[0].data.concepts.length; i++) {
           tags.push(res.data.outputs[0].data.concepts[i].name);
         }
         console.log("TAGS!!!", tags)
         return tags;
       },
       (err) => {
         console.error(err);
       }
     )
}

module.exports = {getPhotoTags}

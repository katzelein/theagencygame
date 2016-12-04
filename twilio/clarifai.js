var clientId = require('../variables').clarifaiClientId
var clientSecret = require('../variables').clarifaiClientSecret

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
let getPhotoTags = function (message){
  var tags = [];
  if (message.MediaContentType0 === 'image/jpeg' ||
      message.MediaContentType0 === 'image/gif' ||
      message.MediaContentType0 === 'image/png'){

      //Make calls to Clarifai for custom model and general model
      let custom = analyzePhoto(customModelId, message.MediaUrl0)
      let general = analyzePhoto(generalModelId, message.MediaUrl0)
      return Promise.all([custom, general])
      .then(results => {
        tags = tags.concat(results[0]);
        tags = tags.concat(results[1]);
        return tags;
      })
    } else {
      // console.log('Clarifai: There was no media in this message')
      return Promise.resolve([]);
    }
  }

/*
* Function to make Clarifai calls w/specified model
*/
function analyzePhoto(modelToUse, mediaUrl){
  return clarifaiAPI.models.predict(modelToUse, mediaUrl).then(
       (res) => {
         // console.log('Clarifai response = ', res);
         let tags = [];
         for (let i = 0; i<res.data.outputs[0].data.concepts.length; i++) {
           if(res.data.outputs[0].data.concepts[i].value > 0.83){
             tags.push(res.data.outputs[0].data.concepts[i].name);
           }         }
         // console.log("Clarifai: TAGS!!!", tags)
         return tags;
       },
       (err) => {
         console.error(err);
       }
     )
}

module.exports = {getPhotoTags};

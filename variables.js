/*
* On heroku, use heroku env variables, locally use .gitignored constants
*/
let localConst
if(process.env.NODE_EVN === 'production'){
  console.log('!!!!the environment is', process.env.NODE_EVN)
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const twilioNum = process.env.TWILIO_NUM
  //Clarifai constants
  const clarifaiClientId = process.env.CLARIFAI_CLIENT_ID
  const clarifaiClientSecret = process.env.CLARIFAI_CLIENT_SECRET
  const clarifaiAccessToken = process.env.CLARIFAI_ACCESS_TOKEN
  //Watson constants
  const watsonUsername = process.env.WATSON_USERNAME
  const watsonPassword = process.env.WATSON_PASSWORD
  const watsonURL = process.env.WATSON_URL
  //Authy constants
  const authyKey = process.env.AUTHY_KEY
} else {
  console.log('*****the environment is', process.env.NODE_EVN)
  localConst = require('./constants')
  const accountSid = localConst.accountSid
  const authToken = localConst.authToken
  const twilioNum = localConst.twilioNum
  //Clarifai constants
  const clarifaiClientId = localConst.clarifaiClientId
  const clarifaiClientSecret = localConst.clarifaiClientSecret
  const clarifaiAccessToken = localConst.clarifaiAccessToken
  //Watson constants
  const watsonUsername = localConst.watsonUsername
  const watsonPassword = localConst.watsonPassword
  const watsonURL = localConst.watsonURL
  //Authy constants
  const authyKey = localConst.authyKey
}

//Twilio constants
const accountSid = process.env.TWILIO_ACCOUNT_SID || localConst.accountSid
const authToken = process.env.TWILIO_AUTH_TOKEN || localConst.authToken
const twilioNum = process.env.TWILIO_NUM || localConst.twilioNum
//Clarifai constants
const clarifaiClientId = process.env.CLARIFAI_CLIENT_ID || localConst.clarifaiClientId
const clarifaiClientSecret = process.env.CLARIFAI_CLIENT_SECRET || localConst.clarifaiClientSecret
const clarifaiAccessToken = process.env.CLARIFAI_ACCESS_TOKEN || localConst.clarifaiAccessToken
//Watson constants
const watsonUsername = process.env.WATSON_USERNAME || localConst.watsonUsername
const watsonPassword = process.env.WATSON_PASSWORD || localConst.watsonPassword
const watsonURL = process.env.WATSON_URL || localConst.watsonURL
//Authy constants
const authyKey = process.env.AUTHY_KEY || localConst.authyKey

module.exports = { accountSid, authToken, twilioNum, clarifaiClientId, clarifaiClientSecret,
  clarifaiAccessToken, watsonUsername, watsonPassword, watsonURL, authyKey }

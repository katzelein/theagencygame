/*
* On heroku, use heroku env variables, locally use .gitignored constants
*/
let localConst;

if (process.env.NODE_ENV === 'production') {
  console.log('THE ENVIRONMENT IS ', process.env.NODE_ENV)
  localConst = null
} else {
  console.log('THE ENVIRONMENT IS ', process.env.NODE_ENV)
  localConst = require('./constants')
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

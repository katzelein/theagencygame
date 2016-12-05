const constants = require('../variables')

// Twilio Credentials
const accountSid = constants.accountSid;
const authToken = constants.authToken;
const twilioNum = constants.twilioNum;

//require the Twilio module and create a REST client
let client = require('twilio')(accountSid, authToken);

let sendSimpleText = (phoneNumber, message) => {
	return client.sendMessage({
		to: phoneNumber,		// Any number Twilio can deliver to
		from: '+12027593387',	// A number you bought from Twilio and can use for outbound communication
		body: message 			// body of the SMS message
	})
}

module.exports = {sendSimpleText}

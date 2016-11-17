const constants = require('../liveconstants')

// Twilio Credentials 
// const accountSid = constants.accountSid;
// const authToken = constants.authToken;
// const twilioNum = constants.twilioNum;

const accountSid = constants.accountSid
const authToken = constants.authToken

var client = require('twilio')(accountSid, authToken)
console.log("client: ", client)
console.log("client.messages: ", client.messages)
console.log("MESSAGES LIST: ", client.messages.list())
// client.messages('MM800f449d0399ed014aae2bcc0cc2f2ec').media.list(function(err, data) {
//     data.mediaList.forEach(function(media) {
//         console.log(media.contentType);
//     });
// });

client.messages.list(function(err, data){
	console.log("FOUND MESSAGES")
	data.messages.forEach(function(message) {
		if(message.media){
			 message.media.list(function(err, data){
			 	data.mediaList.forEach(function(media){
			 		media.delete(function(err, data){
			 			if (err) {
		        			console.log(err.status);
		        			throw err.message;
		    			} else {
		        			console.log("deleted successfully.");
		    			}
			 		})
			 	})
			 })
	 }
	 else{
	 	client.messages(message.sid).delete(function(err, data){
	 		if (err) {
		        console.log(err.status);
		        throw err.message;
		    } else {
		        console.log("deleted successfully.");
		    }
	 	})
	 } 
	}); 
}); 

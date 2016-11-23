const User = require('../models/user')
const Sequelize = require('sequelize')

const whichMessage = require('./whichMessage')

module.exports = function(phoneNumber, message) {
	return User.findOne({where: {phoneNumber}})
	.then(user => {
		if (user) return fetchMessage(user, message);
		else {
			console.log("Did not find user")
			return User.create({
				phoneNumber,
				messageState: 'CONFIRM_JOIN'
			})
			.then (newUser => {
				return "The Agency has no record of you in our system. Would you like to join our forces? If so, text 'join'"

			})
		}
	})
}

const fetchMessage = (user, message) => {
	

	const simpleInput = "";
	if (message.Body != undefined) simpleInput = message.Body.toLowerCase();
	switch(simpleInput) {
		case 'help':
		case 'options':
			return "You have reached The Agency\'s automated help menu! Text 'tutorial' to redo the training mission.  Text 'quit' to quit any ongoing mission.  Text 'skip' to skip any particular challenge in a mission. Text 'resign' to retire from The Agency."
		case 'tutorial':
		case 'skip':
		case 'quit':
		case 'resign':
			return "You have indicated you wish to ____.  Are you certain?"
		default:
			break;
	}

	let returnObj;

	switch(user.messageState) {
		case 'NEED_USERNAME': 
		// actual text with capitalization
			returnObj = whichMessage[user.messageState] (user.username, message.Body);
			break;
		case 'TUTORIAL_MISSION_2': // need location
		case 'QUERY_MISSION': // need location
		// for those that need images or locations
			returnObj = whichMessage[user.messageState] (user.username, message);
			break;
		case 'FETCH_CHALLENGE':
			returnObj = whichMessage[user.messageState] (
				user.currentMission, 
				user.currentChallenge, 
				simpleInput
			);
			break;
		case 'CHALLENGE_ANSWER':
			returnObj = whichMessage[user.messageState] (user.currentChallenge, message)
			break;
		default:
		// text with all lowercase
			returnObj = whichMessage[user.messageState] (user.username, simpleInput);
			break;
	}

	console.log('returnObj instanceof Promise', returnObj instanceof Promise)

	// user.update does not need to happen before sending message,
	if (returnObj && returnObj.state) user.update(returnObj.state);
	if (returnObj && returnObj.message) {
		user.update({lastMessageAt: Date()})
		return returnObj.message;
	}
	if (returnObj instanceof Promise) {
		return returnObj
		.then(obj => {
			if (obj && obj.state) user.update(obj.state);
			if (obj && obj.message) {
				user.update({lastMessageAt: Date()})
				return obj.message;
			}
		})
	}
	else return 'Sorry, The Agency\'s text processor has clearly failed.'
}



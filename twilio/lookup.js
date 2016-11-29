const User = require('../models/user')
const Sequelize = require('sequelize')

const {whichMessage} = require('./whichMessage')

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
	

	let simpleInput = "";
	if (message.Body != undefined) simpleInput = message.Body.toLowerCase();
	switch(simpleInput) {
		case 'help':
		case 'options':
			return "You have reached The Agency\'s automated help menu! Text 'tutorial' to redo the training mission.  Text 'quit' to quit any ongoing mission.  Text 'skip' to skip any particular challenge in a mission. Text 'resign' to retire from The Agency."
		case 'tutorial':
			user.update({
				prevState: user.messageState,
				messageState: 'QUERY_TUTORIAL',
				lastMessageAt: Date()
			})
			return "You have indicated you wish to redo your training mission.  Are you certain?"
		case 'skip':
			user.update({
				prevState: user.messageState,
				messageState: 'QUERY_SKIP_CHALLENGE',
				lastMessageAt: Date()
			})
			return "You have indicated you wish to skip this challenge.  Are you certain?"
		case 'quit':
			user.update({
				prevState: user.messageState,
				messageState: 'QUERY_QUIT_MISSION',
				lastMessageAt: Date()
			})
			return "You have indicated you wish to quit this mission.  Are you certain?"
		case 'resign':
			user.update({
				prevState: user.messageState,
				messageState: 'QUERY_RESIGN',
				lastMessageAt: Date()
			})
			return "You have indicated you wish to resign from The Agency.  Are you certain?"
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
			returnObj = whichMessage[user.messageState] (user.username, message);
			break;
		case 'TUTORIAL_MISSION_3': // need image
		// case 'QUERY_MISSION': // need location
		// // for those that need images or locations
		// 	returnObj = whichMessage[user.messageState] (user.username, message);
		// 	console.log("RETURN OBJECT: ", returnObj)
		// 	break;
		case 'QUERY_MISSION': 
			returnObj = whichMessage[user.messageState] (user.id, user.username, user.location, message.Body);
			console.log("RETURN OBJECT: ", returnObj)
			break;
		case 'SOLO_YN':
			returnObj = whichMessage[user.messageState] (user.username, message);
			break;
		case 'FETCH_CHALLENGE':
		// unique case: needs current mission and current challenge data
			returnObj = whichMessage[user.messageState] (
				user.currentMission, 
				user.currentChallenge, 
				simpleInput
			);
			break;
		case 'CHALLENGE_ANSWER':
		// unique case: needs challenge data and all possible messages
			returnObj = whichMessage[user.messageState] (user.currentChallenge, message)
			break;
		default:
		// text with all lowercase
			returnObj = whichMessage[user.messageState] (user.username, simpleInput);
			break;
	}

	return Promise.resolve(returnObj)
	.then(obj => {
		if (obj && obj.state) user.update(obj.state);
		if (obj && obj.message) {
			user.update({lastMessageAt: Date()})
			return obj.message;
		}
		else return 'Sorry, The Agency\'s text processor has clearly failed.'
	})
}



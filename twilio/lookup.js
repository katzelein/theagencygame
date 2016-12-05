const User = require('../models/user')
const Sequelize = require('sequelize')

const UserMission = require('../models/userMission')

let {sendSimpleText} = require('./send-sms')
const {whichMessage} = require('./whichMessage')

/*
 * if run by mocha (if in testing mode),
 * replace problematic functions with dummy functions
 */
const testing = typeof global.it === 'function'
if (testing) {
	sendSimpleText = (phoneNumber, message) => {
		console.log('testing sendSimpleText')
		return Promise.resolve(`sending text to ${phoneNumber}`)
	}
}

/*
 * paramenters:	phoneNumber	// phone number of message
 *				message		// entire req.body
 * 
 * phoneNumber is used to look up user
 * pass the user found and the whole message into fetchMessage
 *		to find the message to return to the user
 */
const lookup = (phoneNumber, message) => {
	return User.findOne({where: {phoneNumber}})
	.then(user => {
		if (user) return fetchMessage(user, message);
		else {
			console.log("Did not find user")
			return User.create({
				phoneNumber,
				messageState: 'CONFIRM_JOIN',
				lastMessageFrom: Date(),
				lastMessageTo: Date(),
				status: 'standby'
			})
			.then (newUser => {
				return "The Agency has no record of you in our system. Would you like to join our forces? If so, text 'join'"

			})
		}
	})
}

/*
 * essentially a gatekeeper function
 * based on user's current messageState, determines which function to call
 * also provides some help menu shortcuts
 */
const fetchMessage = (user, message) => {

	user.update({lastMessageFrom: Date()})	

	let simpleInput = "";
	if (message.Body != undefined) simpleInput = message.Body.toLowerCase();

	/*
	 * help menu shortcuts
	 * not fully functional yet!!
	 */
	switch(simpleInput) {
		case 'help':
		case 'options':
			return "You have reached The Agency\'s automated help menu! Text 'tutorial' to redo the training mission.  Text 'quit' to quit any ongoing mission.  Text 'skip' to skip any particular challenge in a mission. Text 'resign' to retire from The Agency."
		case 'tutorial':
			user.update({
				prevState: user.messageState,
				messageState: 'QUERY_TUTORIAL',
				lastMessageTo: Date()
			})
			return "You have indicated you wish to redo your training mission.  Are you certain?"
		case 'skip':
			user.update({
				prevState: user.messageState,
				messageState: 'QUERY_SKIP_CHALLENGE',
				lastMessageTo: Date()
			})
			return "You have indicated you wish to skip this challenge.  Are you certain?"
		case 'quit':
			user.update({
				prevState: user.messageState,
				messageState: 'QUERY_QUIT_MISSION',
				lastMessageTo: Date()
			})
			return "You have indicated you wish to quit this mission.  Are you certain?"
		case 'resign':
			user.update({
				prevState: user.messageState,
				messageState: 'QUERY_RESIGN',
				lastMessageTo: Date()
			})
			return "You have indicated you wish to resign from The Agency.  Are you certain?"
		default:
			break;
	}

	let returnObj;
	/*
	 * based off messageState
	 */
	switch(user.messageState) {
		case 'NEED_USERNAME': 
		// actual text with capitalization
			returnObj = whichMessage[user.messageState] (user.username, message.Body);
			break;
		case 'TUTORIAL_MISSION_2': // need location
		case 'TUTORIAL_MISSION_3': // need image
		case 'SOLO_YN': // need location
		// for those that need images or locations
			returnObj = whichMessage[user.messageState] (user.username, message);
			break;
		case 'SOLO_OK':
		case 'QUERY_MISSION': 
		// unique case: need user to get location
			returnObj = whichMessage[user.messageState] (user, simpleInput);
			console.log("RETURN OBJECT: ", returnObj)
			break;
		case 'FETCH_CHALLENGE':
		// unique case: needs current mission and current challenge data
			returnObj = whichMessage[user.messageState] (user, simpleInput);
			break;
		case 'CHALLENGE_ANSWER':
		// unique case: needs challenge data and all possible messages
			returnObj = whichMessage[user.messageState] (user, message)
			break;
		default:
		// text with all lowercase
			returnObj = whichMessage[user.messageState] (user.username, simpleInput);
			break;
	}

	return Promise.resolve(returnObj)
	.then(obj => {
		let hasPartner = false;
		if (user.status == 'active_pair') hasPartner = true;

		let updateObj = {}
		let outMessage = 'Sorry, The Agency\'s text processor has clearly failed.'

		if (obj && obj.state) 
			Object.assign(
				updateObj, 
				obj.state, 
				{lastMessageTo: Date()}
			);
		if (obj && obj.message) outMessage = obj.message;

		if (hasPartner) 
			return sendMessageToPartner(user, outMessage)
			.then(() => {
				return user.update(updateObj)
			})
			.then(() => {
				return outMessage
			})

		else 
			return user.update(updateObj)
			.then(() => {
				return outMessage
			})
	})
}

/*
 * parameters:	user	// user whose partner we're looking for
 * 				message	// message to send
 * looks up user's current UserMission model,
 * looks up the partner attached to the UserMission
 * sends the message to the partner
 *
 * NOTE: could refactor this into the fetchPartnerFromUserMission in whichMessage??
 */
const sendMessageToPartner = (user, message) => {
	return UserMission.findOne({
		where: {
			userId: user.id,
			missionId: user.currentMission
		}
	})
	.then(foundUserMission => {
		return User.findById(foundUserMission.partnerId)
	})
	.then(partner => {
		partner.update({lastMessageTo: Date()})
		// send message somehow
		sendSimpleText(partner.phoneNumber, message);
	})
}


module.exports = {lookup, fetchMessage, sendMessageToPartner}
const User = require('../models/user')

const {chooseMission} = require('./chooser')
const {getLocation} = require('./location')

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
	
	const simpleInput = message.Body.toLowerCase();
	switch(simpleInput) {
		case 'help':
		case 'options':
			return "You have reached the Agency\'s automated help menu! Text 'tutorial' to redo the training mission.  Text 'quit' to quit any ongoing mission.  Text 'skip' to skip any particular challenge in a mission. Text 'resign' to retire from the Agency."
		case 'tutorial':
		case 'skip':
		case 'quit':
		case 'resign':
			return "You have indicated you wish to ____.  Are you certain?"
		default:
			break;
	}

	let str;

	switch(user.messageState) {
		case 'NEED_USERNAME':
			str = whichMessage[user.messageState] (user, message);
			break;
		case 'TUTORIAL_MISSION_1':
		default:
			// str = "Sorry!"
			str = whichMessage[user.messageState] (user, message);
			break;
	}

	return str;
}


const whichMessage = {
	NEED_USERNAME: (user, message) => {
		let re = new RegExp("^[A-Za-z0-9]+$");
		if (re.test(message.Body)) {
		    console.log("Valid username");
		} else {
		    console.log("Invalid username");
		}
	
		return user.update({
			username: message.Body, 
			messageState: 'TUTORIAL_MISSION_1'
		})
		.then(user => {
			return "Welcome to the Agency, Agent "+message.Body+"! Would you like to participate in a training mission?"
		})
		
	},

	CONFIRM_JOIN: (user, message) => {
		if((/(join)/i).test(message.Body)){
  			console.log("IT FOUND JOIN")
  			console.log("USER IN JOIN: ", user)
  			return user.update({
				messageState: 'NEED_USERNAME'
			})
			.then(user => {
				console.log("in .then()")
				return "Ah, it's seems the agency has a new recruit! And what is your name, trainee?  Feel free to use an alias, we respect the secrets of our agents."
			})
	}},

	TUTORIAL_MISSION_1: (user, message) => {
		//can't expect just a yes or no
		var userInput = message.Body.toLowerCase()
		if(userInput == 'no') {
			user.update({messageState: 'TUTORIAL_MISSION_0'});
			return "A little busy at the moment? We understand, no need to blow your cover.  Well, whenever you have a free hour, just text us ‘mission’ and we can get started."
		} else if (userInput == 'yes') {
			user.update({messageState: 'TUTORIAL_MISSION_2'});
			return "The main purpose of this training mission is to get you, our newest recruit, used to our system.  Now first things first, before every mission you will be encouraged to send in your location. This enables us to tailor our missions to your location, perhaps even assign you missions that require interactions with other agents.  Most smartphones have the ability to send or share your current location through text.  Please send your current location to the Agency now."
		}
	},

	TUTORIAL_MISSION_0: (user, message) => {
		user.update({messageState: 'TUTORIAL_MISSION_1'})
		.then(user => {
			return "Ready for your training mission, Trainee "+user.username+"?"
		})	
	},

	TUTORIAL_MISSION_2: (user, message) => {
		var coordinates = getLocation(message)
		console.log("res from getLocation: ", coordinates)
		if(typeof coordinates === "array"){
			return user.update({
				messageState: 'TUTORIAL_MISSION_3',
				latitude: coordinates[0],
				longitude: coordinates[1]
			})
			.then(user => {
				return "Thank you for sending in your location.  Next step: Ensure your phone has a functioning camera.  This is important as many of the challenges in our missions require taking a picture of something and sending it to The Agency for processing.  Go on and take of picture of something - anything you like - and send it in."
			})
		}
		else{
			return coordinates
		}
		
	},

	TUTORIAL_MISSION_3: (user) => {
		// assuming they sent in a picture
		user.update({messageState: 'STANDBY'})
		return "Congratulations, Trainee "+user.username+", you have completed your training mission!  Your name has been added to our list of active field agents.  Text in 'new mission' whenever you have the time to request your first mission!"
	},

	STANDBY: (user, userInput) => {
		if (userInput == 'no') {
			user.update({messageState: 'QUERY_HIATUS'})
			return "Agent "+user.username+", you are currently between missions. Do you wish to take a hiatus from missions?"
		} else if (userInput == 'new' || userInput == 'new mission') {
			user.update({messageState: 'QUERY_MISSION'})
			return "Ah, Agent "+user.username+", good of you to call in! Before we assign you a new mission, please send in your location."
		}
	},

	QUERY_MISSION: (user, userInput) => {
		// assume we were able to access and process location
		return chooseMission()
		.then(newMission => {
			user.update({
				messageState: 'MISSION_1', 
				currentMission: newMission
			});
			return mission.title+": "+mission.summary+" Do you accept this mission, Agent "+user.username+"?";
		})
	},

	MISSION_1: (user, userInput) => {

	},

	QUERY_HIATUS: () =>{return ""}

}





let not_lookup = function(userNum, userInput) {
	// lookup userNum in userStatus table for currentState
	
	return "Hello Agent"+userInput

	let currentState = {};
	// lookup currentState and userInput in stateTransition table for nextState
	let nextState = {};
	// if lookup for nextState fails, return "sorry, the Agency's automated text processing has epic failed"
	// lookup nextState in stateMessage table for message
	let message = {};
	return message;
}
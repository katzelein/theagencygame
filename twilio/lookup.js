const User = require('../models/user')

module.exports = function(phoneNumber, userInput) {
	return User.findOne({where: {phoneNumber}})
	.then(user => {
		if (user) return fetchMessage(user, userInput);
		else {
			console.log("Did not find user")
			return User.create({
				phoneNumber,
				messageState: 'NEED_USERNAME'
			})
			.then (newUser => {
				return "Ah, it's seems the agency has a new recruit! And what is your name, trainee?  Feel free to use an alias, we respect the secrets of our agents."
			})
		}
	})
}

const fetchMessage = (user, userInput) => {
	
	const simpleInput = userInput.toLowerCase();
	switch(userInput) {
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
		case 'TUTORIAL_MISSION_1':
			str = whichMessage[user.messageState] (user, userInput);
			break;
		default:
			str = "Sorry!"
			break;
	}

	return str;
}


const whichMessage = {
	NEED_USERNAME: (user, userInput) => {
		let re = new RegExp("^[A-Za-z0-9]+$");
		if (re.test(userInput)) {
		    console.log("Valid username");
		} else {
		    console.log("Invalid username");
		}
	
		user.update({username: userInput, messageState: 'TUTORIAL_MISSION_1'})
		
		return "Welcome to the Agency, Agent "+userInput+"! Would you like to participate in a training mission?"
	},

	TUTORIAL_MISSION_1: (user, userInput) => {
		userInput = userInput.toLowerCase()
		if(userInput == 'no') {
			user.update({messageState: 'TUTORIAL_MISSION_0'});
			return "A little busy at the moment? We understand, no need to blow your cover.  Well, whenever you have a free hour, just text us ‘mission’ and we can get started."
		} else if (userInput == 'yes') {
			user.update({messageState: 'TUTORIAL_MISSION_2'});
			return "The main purpose of this training mission is to get you, our newest recruit, used to our system.  Now first things first, before every mission you will be encouraged to send in your location. This enables us to tailor our missions to your location, perhaps even assign you missions that require interactions with other agents.  Most smartphones have the ability to send or share your current location through text.  Please send your current location to the Agency now."
		}
	},

	TUTORIAL_MISSION_0: () => {return ""}

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
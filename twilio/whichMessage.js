const {chooseMission} = require('./chooser')
const {getChallenge} = require('./chooser')
const {getLocation} = require('./location')
const getPhotoTags = require('./clarifai')
const {adventureDetails, missionChooser, partnerChooser} = require('./missionChooser')
const User = require('../models/user')
const {accountSid, authToken} = require('../variables')
var client = require('twilio')(accountSid, authToken);
const UserMission = require('../models/userMission')
const Challenge = require('../models/challenge')


const whichMessage = {

	CONFIRM_JOIN: (username, userInput) => {
		if((/(join)/i).test(userInput)){
  			console.log("IT FOUND JOIN")
  			return {
  				state: {
  					messageState: 'NEED_USERNAME'
				},
				message: "Ah, it's seems The Agency has a new recruit! And what is your name, Trainee?  Feel free to use an alias, we respect the secrets of our agents."
			}
		}
	},

	NEED_USERNAME: (username, userInput) => {
		//let re = new RegExp("^[A-Za-z0-9]+$");
		let re = new RegExp("^[\\w\\s]+$", "g");
		if (re.test(userInput)) {
		    console.log("Valid username");
		    return User.findOne({
				where: {
					username: userInput
				}
			})
			.then(user => {
				if(user){
					return {
						message: "That username is taken. Please try again."
					}
				}
				else{
					console.log("NEED_USERNAME")
					return {
						state: {
							username: userInput,
							messageState: 'TUTORIAL_MISSION_1'
						},
						message: "Welcome to the Agency, Agent "+userInput+"! Would you like to participate in a training mission?"
					}}
			})

		} else {
		    console.log("Invalid username");
		    return {
		    	message: "Invalid username. Usernames can include numbers, letters, spaces, and underscores '_'."
		    }}
	},

	TUTORIAL_MISSION_1: (username, userInput) => {
		//can't expect just a yes or no
		var userInput = userInput.toLowerCase()
		console.log("userInput: ", userInput)
		if(userInput == 'no') {
			return {
				state: {
					messageState: 'TUTORIAL_MISSION_0'
				},
				message: "A little busy at the moment? We understand, no need to blow your cover.  Well, whenever you have a free hour, just text us ‘mission’ and we can get started."
			}
		} else if (userInput == 'yes') {
			return {
				state: {
					messageState: 'TUTORIAL_MISSION_2'
				},
				message: "The main purpose of this training mission is to get you, our newest recruit, used to our system.  Now first things first, before every mission you will be encouraged to send in your location. This enables us to tailor our missions to your location, perhaps even assign you missions that require interactions with other agents.  Most smartphones have the ability to send or share your current location through text.  Please send your current location to The Agency now."
			}
		}
	},

	TUTORIAL_MISSION_0: (username) => {
		return {
			state: {messageState: 'TUTORIAL_MISSION_1'},
			message: "Ready for your training mission, Trainee "+username+"?"
		}
	},

	TUTORIAL_MISSION_2: (username, message) => {
		var coordinatesPromise = getLocation(message)
		console.log("coordinatesPromise: ", coordinatesPromise)
		return coordinatesPromise
		.then(coordinates => {
			if(typeof coordinates === 'object'){
				console.log("found coordinates, .then")
				return {
					state: {
						messageState: 'TUTORIAL_MISSION_3',
						location: {type: 'Point', coordinates: coordinates}
					},
					message: "Thank you for sending in your location.  Next step: Ensure your phone has a functioning camera.  This is important as many of the challenges in our missions require taking a picture of something and sending it to The Agency for processing.  Go on and take of picture of something - anything you like - and send it in."
				}
			} else {
				console.log("coordinates is not an array")
				return {
					message: "Sorry, The Agency's message processor was not able to parse your location from that message.  Please send in your street address instead."
				}
			}
		})


		// THIS WORKS FOR APPLE AND GOOGLE PHONES WHEN THERE IS A RESULT
		// console.log("coordinates: ", coordinates)
		// 	if(typeof coordinates === 'object'){
		// 		return user.update({
		// 				messageState: 'TUTORIAL_MISSION_3',
		// 				latitude: coordinates[0],
		// 				longitude: coordinates[1]
		// 		})
		// 		.then(user => {
		// 			console.log("found coordinates, .then")
		// 			return "Thank you for sending in your location.  Next step: Ensure your phone has a functioning camera.  This is important as many of the challenges in our missions require taking a picture of something and sending it to The Agency for processing.  Go on and take of picture of something - anything you like - and send it in."
		// 		})
		// 	}
		// 	else{
		// 		console.log("coordinates is not an array")
		// 		return user.update({})
		// 		.then(user => {
		// 			return coordinates
		// 		})
		// 	}


		// return coordinatesPromise
		// .then(coordinates => {
		// 	console.log("res from getLocation: ", coordinates)
		// 	console.log("type of coordinates: ", typeof coordinates)
		// 	if(typeof coordinates === "object"){
		// 		console.log("coordinates is an array")
		// 		return user.update({
		// 			messageState: 'TUTORIAL_MISSION_3',
		// 			latitude: coordinates[0],
		// 			longitude: coordinates[1]
		// 		})
		// 		.then(user => {
		// 			console.log("found coordinates, .then")
		// 			return "Thank you for sending in your location.  Next step: Ensure your phone has a functioning camera.  This is important as many of the challenges in our missions require taking a picture of something and sending it to The Agency for processing.  Go on and take of picture of something - anything you like - and send it in."
		// 		})
		// 	}
		// 	else{
		// 		console.log("coordinates is not an array")
		// 		return coordinates
		// 	}
		// })

	},

	TUTORIAL_MISSION_3: (username, message) => {
		// assuming they sent in a picture

		let success = {
			state: {messageState: 'STANDBY'},
			message: "Congratulations, Trainee, you have completed your training mission!  Your name has been added to our list of active field agents.  Text in 'new mission' whenever you have the time to request your first mission!"
		}
		let fail = {
			message: "That ... wasn't a picture ...."
		}
		// put clarifai function here!!!
		/*
		 * parameters:	currentChallenge.targetTags // array of target tags
		 * 				message // whole body of twilio request
		 * returns: true / false
		 */
		return getPhotoTags(message)
		.then (actualTags => {
			console.log(actualTags);
			if (actualTags.length) return success;
			else return fail;
		})
	},

	// STANDBY: (username, userInput) => {
	// 	if (userInput == 'no') {
	// 		return {
	// 			state: {messageState: 'QUERY_HIATUS'},
	// 			message: "Agent "+username+", you are currently between missions. Do you wish to take a hiatus from missions?"
	// 		}
	// 	} else if (userInput == 'new' || userInput == 'new mission') {
	// 		return {
	// 			state: {messageState: 'QUERY_MISSION'},
	// 			message: "Ah, Agent "+username+", good of you to call in! Before we assign you a new mission, please send in your location."
	// 		}
	// 	}
	// },

	STANDBY: (username, userInput) => {
		if (userInput == 'no') {
			return {
				state: {messageState: 'QUERY_HIATUS'},
				message: "Agent "+username+", you are currently between missions. Do you wish to take a hiatus from missions?"
			}
		} else if (userInput == 'new' || userInput == 'new mission') {
			return {
				state: {messageState: 'SOLO_YN'},
				message: "Ah, Agent "+username+", good of you to call in! Before we assign you a new mission, please send in your location."
			}
		}
	},



	SOLO_YN: (username, message) => {
		var coordinatesPromise = getLocation(message)
		console.log("coordinatesPromise: ", coordinatesPromise)
		return coordinatesPromise
		.then(coordinates => {
			if(typeof coordinates === 'object'){
				console.log("found coordinates, .then")
				return {
					state: {
						messageState: 'QUERY_MISSION',
						location: {type: 'Point', coordinates: coordinates}
					},
					message: "Thank you for sending in your location.  Would you prefer to partner up for your next mission, or go it alone? Respond with 'lone wolf' or 'eager beaver'. "
				}
			} else {
				console.log("coordinates is not an array")
				return {
					message: "Sorry, The Agency's message processor was not able to parse your location from that message.  Please send in your street address instead."
				}
			}
		})
	},

	SOLO_OK: (username, location, userInput) => {

	},

	QUERY_MISSION: (user, userInput) => {
		// assume we were able to access and process location
		let coordinates = user.location.coordinates
		let soloAdventurePromise, pairAdventurePromise;
		if(userInput === 'lone wolf'){
			return missionChooser(coordinates)
			.then(newMission => {
					return {
						state: {
							messageState: 'FETCH_CHALLENGE',
							currentMission: newMission.id,
						},
						message: newMission.title+": "+newMission.description+" Do you accept this mission, Agent "+user.username+"?"
					}
				})
		}

		else if(userInput === 'eager beaver'){
			return Promise.all([partnerChooser(user.location.coordinates), missionChooser(user.location.coordinates)])
			.then(response => {
				let partners = response[0]
				//console.log("USERS: ", partners)
				let newMission = response[1];
				console.log(partners);
				if(!partners || !partners.length){
					return {message: 'There are no agents currently available.  Please wait a few minutes ...'}
				}
				else{
					let partner = partners[0]

					console.log("ABOU TO SEND MESSAGE")
					return client.sendMessage({

		              to: partner.phoneNumber, // Any number Twilio can deliver to
		              from: '+12027593387', // A number you bought from Twilio and can use for outbound communication
		              body: `We have found a partner for you. Agent ${user.username} is ready to go. Your mission is ${newMission.title}: ${newMission.description} \n\nPlease meet at ${newMission.meetingPlace}.\n\nText "ready" when you have both arrived.` // body of the SMS message

		          	})
		          	.then(() => {
		          		return UserMission.bulkCreate([
		          			{userId: user.id, missionId: newMission.id, partnerId: partner.id},
		          			{userId: partner.id, missionId: newMission.id , partnerId: user.id}])
		          	})
					.then(() => {
						console.log("ABOUT TO UPDATE PARTNER")
						return partner.update({
						messageState: 'FETCH_CHALLENGE',
						currentMission: newMission.id,
						lastMessageTo: Date()
					})})
					.then(() => {
						return {
							state: {
								messageState: 'FETCH_CHALLENGE',
								currentMission: newMission.id,
							},
							message: `Agent ${partner.username} will be your partner. Your mission is ${newMission.title}: ${newMission.description} \n\nPlease meet at ${newMission.meetingPlace}.\n\nText "ready" when you have both arrived.`
						}
					})
					.catch(err => console.log(err))
				}
		})}

		else return {
			message: "We did not recognize your preference, please respond with 'lone wolf' or 'eager beaver'."
		}



	},

	// QUERY_MISSION: (username, message) => {
	// 	// assume we were able to access and process location
	// 	var coordinatesPromise = getLocation(message)
	// 	console.log("coordinatesPromise: ", coordinatesPromise)
	// 	return coordinatesPromise
	// 	.then(coordinates => {
	// 		if(typeof coordinates === 'object'){
	// 			return chooseMission()
	// 			.then(newMission => {
	// 				return {
	// 					state: {
	// 						messageState: 'FETCH_CHALLENGE',
	// 						currentMission: newMission.id,
	// 						location: {type: 'Point', coordinates: coordinates}
	// 					},
	// 					message: newMission.title+": "+newMission.description+" Do you accept this mission, Agent "+username+"?"
	// 				}
	// 			})
	// 		}
	// 		else{
	// 			console.log("coordinates is not an array")
	// 			return {
	// 				message: "Sorry, The Agency's message processor was not able to parse your location from that message.  Please send in your street address instead."
	// 			}
	// 		}
	// 	})
	// },

	FETCH_CHALLENGE: (currentMissionId, currentChallengeId, userInput) => {
		// still need to adjust based on userInput
		return getChallenge(currentMissionId, currentChallengeId)
		.then(newChallenge => {
			if (newChallenge) {
				return {
					state:{
						messageState: 'CHALLENGE_ANSWER',
						currentChallenge: newChallenge.id
					},
					message: newChallenge.objective+": "+newChallenge.summary
				}
			} else {
				return {
					state: {
						messageState: 'STANDBY',
						currentMission: 0,
						currentChallenge: 0
					}
				}
			}
		})
	},

	CHALLENGE_ANSWER: (currentChallengeId, message) => {
		return Challenge.findById(currentChallengeId)
		.then(currentChallenge => {
			let success;

			if (currentChallenge.hasNext) {
				success = {
					state: {messageState: 'FETCH_CHALLENGE'},
					message: currentChallenge.conclusion + " | Are you ready for your next challenge?"
				}
			} else {
				success = {
					state: {
						messageState: 'STANDBY',
						currentMission: 0,
						currentChallenge: 0
					},
					message: currentChallenge.conclusion + "| You have completed your mission.  Text 'new mission' to start a new mission"
				}
			}
			let fail = {message: "Your answer doesn't quite match ...."}

			switch (currentChallenge.type) {
				case 'text':
					if (currentChallenge.targetText.toLowerCase() == message.body.toLowerCase()) return success;
					else return fail;
				case 'image':
					// put clarifai function here!!!
					/*
					 * parameters:	currentChallenge.targetTags // array of tags
					 * 				message // whole body of twilio request
					 * returns: true / false
					 */
					// let actualTags = [] // clarifai stuff

					return getPhotoTags(message)
					.then (actualTags => {
						// console.log(actualTags);
						if (checkTags(currentChallenge.targetTags, actualTags)) return success;
						else return fail;
					})
				case 'voice':
					// put Kat's voice stuff here!!
					/*
					 * parameters:	currentChallenge.targetText // target words
					 * 				message // whole body of twilio request
					 * returns: true / false
					 */
					 if(true) return success;
					 else return fail;
				default:
					return success;
			}
		})
	},

	QUERY_HIATUS: () =>{return ""},

	QUERY_TUTORIAL: (user, userInput) => {
		if (userInput == 'no') return {
			state: {
				messageState: user.prevState,
				prevState: null,
			},
			message: "You have declined repeating your training mission."
		}
	},

	QUERY_SKIP_CHALLENGE: () => {},

	QUERY_QUIT_MISSION: () => {},

	QUERY_RESIGN: () => {},
}

const checkTags = (expectedTags, actualTags) => {
	// at least one of expectedTags exists in actualTags

	if (!Array.isArray(expectedTags) || !Array.isArray(actualTags)) return false;

	let tagExists = false;
	expectedTags.forEach(element => {
		if(actualTags.includes(element)) tagExists = true;
	})

	return tagExists
}


module.exports = {whichMessage, checkTags};

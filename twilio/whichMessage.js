const {chooseMission} = require('./chooser')
const {getChallenge} = require('./chooser')
const {getLocation} = require('./location')
const getPhotoTags = require('./clarifai')
const {adventureDetails, missionChooser, partnerChooser} = require('./missionChooser')

const {checkWatsonPromise} = require('./watson');

const User = require('../models/user')
const {accountSid, authToken} = require('../variables')
const client = require('twilio')(accountSid, authToken);
const UserMission = require('../models/userMission')
const UserChallenge = require('../models/userChallenge')
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
		console.log("userInput: ", userInput)
		if(userInput == 'no') {
			return {
				state: {
					messageState: 'STANDBY'
				},
				message: `Agent ${username}, you have chosen to skip the training mission.  If you wish to do the training mission at any point, just text 'tutorial'.  If you wish to start real missions immediately, text 'new mission'.`
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

	SOLO_OK: (user, message) => {
		
		if(message === 'wait'){
			return{
				state: {
					status: 'ready',
					readyAt: Date()
					// ask team what to do if user decides to quit waiting???
					// set new messagestate????
				},
				message: 'Ok, we will contact you when a partner becomes available.'
			}
		}
		else if(message === 'go'){
			return whichMessage.QUERY_MISSION(user, 'lone wolf')
		}
		else{
			return {
				message: "We did not recognize that input. Respond with 'wait' or 'go'."
			}
		}

	},

	QUERY_MISSION: (user, userInput) => {
		// assume we were able to access and process location
		let coordinates = user.location.coordinates
		let soloAdventurePromise, pairAdventurePromise;
		if(userInput === 'lone wolf'){
			return missionChooser(coordinates)
			.then(newMission => {
				UserMission.create({
					userId: user.id,
					missionId: newMission.id,
					partnerId: null
				})
				return {
					state: {
						messageState: 'FETCH_CHALLENGE',
						currentMission: newMission.id,
						status: 'active_solo'
					},
					message: newMission.title+": "+newMission.description+" Do you accept this mission, Agent "+user.username+"?"
				}
			})
		}

		else if(userInput === 'eager beaver'){
			return Promise.all([partnerChooser(user.id, user.location.coordinates), missionChooser(user.location.coordinates)])
			.then(response => {
				let partners = response[0]
				//console.log("USERS: ", partners)
				let newMission = response[1];
				if(!partners || !partners.length){
					return {
							state: {
								messageState: 'SOLO_OK',
							},
							message: "There are no agents currently available.  Text 'wait' if you would like to wait for a partner or 'go' if you would like to fly solo instead."
						}
				}
				else{
					let partner = partners[0]

					console.log("ABOUT TO SEND MESSAGE")
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
						lastMessageTo: Date(),
						status: 'active_pair',
						readyAt: null
					})})
					.then(() => {
						return {
							state: {
								messageState: 'FETCH_CHALLENGE',
								currentMission: newMission.id,
								status: 'active_pair',
								readyAt: null
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

	FETCH_CHALLENGE: (user, currentMissionId, currentChallengeId, userInput) => {
		// still need to adjust based on userInput
		return getChallenge(user.currentMissionId, user.currentChallengeId)
		.then(newChallenge => {
			if (newChallenge) {
				UserChallenge.create({
					userId: user.id,
					challengeId: newChallenge.id
				})
				if(user.status == 'active_pair') {
					fetchPartnerFromUserMission(user,{})
				}
				return {
					state:{
						messageState: 'CHALLENGE_ANSWER',
						currentChallenge: newChallenge.id
					},
					message: newChallenge.objective+": "+newChallenge.summary,
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
					message: currentChallenge.conclusion + "\n\nAre you ready for your next challenge?",
					userChallengeState: {status: 'complete'}
				}
			} else {
				success = {
					state: {
						messageState: 'STANDBY',
						currentMission: 0,
						currentChallenge: 0,
						status: 'standby'
					},
					message: currentChallenge.conclusion + "\n\nYou have completed your mission.  Text 'new mission' to start a new mission",
					userMissionState: {status: 'complete'}
				}
			}
			let fail = {message: "Your answer doesn't quite match The Agency's records.  Please try again."}

			switch (currentChallenge.category) {
				case 'text':
					if (currentChallenge.targetText.toLowerCase() == message.Body.toLowerCase()) return success;
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
					let scriptPromise = checkWatsonPromise(message);
					return scriptPromise
					.then((transcript) => {
						console.log('transcript',transcript);
						if (transcript == currentChallenge.targetText) return success;
						else {
							let newMessage = "Not quite what we were looking for, but the Agency will manage. " + success.message
							success.message = newMessage;
							return success;
						}
					})
					// if(true) return success;
					// else return fail;
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

	QUERY_SKIP_CHALLENGE: (prevState, userInput) => {

	},

	QUERY_QUIT_MISSION: () => {
		if (userInput == 'yes') return {
			state: {
				messageState: 'STANDBY'
			},
			message: "Skipping mission ...."
		}
		else return {
			state: {
				messageState: prevState
			},
			message: "Returning ..."
		}
	},

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

/* 
 * allTheStates:
 * 		{
 *			user: {} // update state of  partner's user model
 *			userMission: {} // update state of partner's userMission model
 *			userChallenge: {} // update state of partner's userChallenge model
 *		 }
 */
const fetchPartnerFromUserMission = (user, allTheStates) => {
	return UserMission.findOne({
		where: {
			userId: user.id,
			missionId: user.currentMission
		}
	})
	.then(foundUserMission => {
		// console.log(foundUserMission)
		return User.findById(foundUserMission.partnerId)
	})
	.then(partner => {
		let allUpdates = [];
		let temp;

		if (allTheStates.user) {
			temp = partner.update(allTheStates.user);
			allUpdates.push(temp);
		}
		if (allTheStates.userMission) {
			temp = UserMission.findOne({
				where: {
					userId: partner.id,
					missionId: user.currentMission
				}
			})
			.then(foundPartnerMission => {
				foundPartnerMission.update(allTheStates.userMission)
			})
			allUpdates.push(temp);
		}
		if (allTheStates.userChallenge) {
			temp = UserChallenge.findOrCreate({
				where: {
					userId: partner.id,
					challengeId: user.currentChallenge
				}
			})
			.then(foundPartnerChallenge => {
				foundPartnerChallenge.update(allTheStates.userChallenge)
			})
			allUpdates.push(temp);
		}
		return Promise.all(allUpdates)
	})
}

module.exports = {whichMessage, checkTags, fetchPartnerFromUserMission};

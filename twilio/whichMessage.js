const {chooseMission} = require('./chooser')
const {getChallenge} = require('./chooser')
const {getLocation} = require('./location')
const getPhotoTags = require('./clarifai')
const {missionChooser, partnerChooser} = require('./missionChooser')

const {checkWatsonPromise} = require('./watson');

const User = require('../models/user')
const {accountSid, authToken} = require('../variables')
const client = require('twilio')(accountSid, authToken);
const UserMission = require('../models/userMission')
const UserChallenge = require('../models/userChallenge')
const Challenge = require('../models/challenge')


// console.log("SHARE MISSION: ", sharedMission([1, 2, 3], [1, 2]))


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

		// put clarifai function here!!!
		/*
		 * parameters:	currentChallenge.targetTags // array of target tags
		 * 				message // whole body of twilio request
		 * returns: true / false
		 */
		return getPhotoTags(message)
		.then (actualTags => {
			console.log(actualTags);
			if (actualTags.length) {
				return {
					state: {messageState: 'STANDBY'},
					message: `Image registers as: [${actualTags[0]}, ${actualTags[1]}, ${actualTags[2]}]\n\nCongratulations, Trainee, you have completed your training mission!  Your name has been added to our list of active field agents.  Text in 'new mission' whenever you have the time to request your first mission!`
				}
			}
			else return {
				message: "That ... wasn't a picture ...."
			}
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
					message: "Thank you for sending in your location.  Would you prefer to partner up for your next mission, or go it alone? Respond with 'lone wolf' or 'eager beaver'."
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
				message: 'Ok, we will contact you when a partner becomes available. Text \'go\' if you run out of patience and would rather go it alone.'
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

			return missionChooser(user, coordinates)
			.then(potentialMissions => {
				let newMission = potentialMissions;
				if(potentialMissions.length) newMission = potentialMissions[0]
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
			}
			else{
				return {
					message: "There are no missions in this area, or you have completed all of them! Try again later or when you have relocated."
				}
			}
			})
		}

		else if(userInput === 'eager beaver'){
			console.log(" IN EAGER BEAVER")
			return Promise.all([partnerChooser(user.id, user.location.coordinates), missionChooser(user, user.location.coordinates)])
			.then(response => {
				let partners = response[0]
				//console.log("USERS: ", partners)
				let potentialMissions = response[1];

				console.log("PARTNERS LENGTH: ", partners.length)
				console.log("POTENTIAL MISSIONS LENGTH: ", potentialMissions.length)
				if(!partners || !partners.length){
					return {
							state: {
								messageState: 'SOLO_OK',
							},
							message: "There are no agents currently available.  Text 'wait' if you would like to wait for a partner or 'go' if you would like to fly solo instead."
						}
				}
				else{
					console.log("IN ELSE BC PARTNERS WERE FOUND")
					let parterId, partner = null;
					let newMission = null;

					//check if every mission the user HAS NOT done is in this list of every mission the partner HAS done
					let partnerFound = partners.some(function(potPartner, i){
						newMission = sharedMission(potentialMissions, potPartner.userMissions)
						console.log("NEW MISSION: ", newMission)

						if(/*sharedMission(potentialMissions, potPartner.userMissions)*/ newMission){
							partner = potPartner
							console.log("TRUE! This is partner: ", partner.username)
							return true;
						}
						else{
							console.log(`PARTNER ${potPartner.username} FALSE`)
						}
					})

					console.log("PARTNER BEFORE UPDATES: ", partner)
					console.log("MISSION BEFORE UPDATES: ", newMission)
					if(partnerFound){
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
					else{
						console.log("PARTNERS WERE FOUND, BUT NO MISSIONS IN COMMON")
						return {
								state: {
									messageState: 'SOLO_OK',
									},
								message: "There are no agents currently available.  Text 'wait' if you would like to wait for a partner or 'go' if you would like to fly solo instead."
						}
					}
				}
			})
		}
	},

	FETCH_CHALLENGE: (user, userInput) => {
		// still need to adjust based on userInput
		console.log('FETCH_CHALLENGE')
		return getChallenge(user.currentMission, user.currentChallenge)
		.then(newChallenge => {
			if (newChallenge) {
				if(user.status == 'active_pair') {
					fetchPartnerFromUserMission(
						{
							id: user.id,
							currentMission: user.currentMission,
							currentChallenge: newChallenge.id
						},{
							user: {
								messageState: 'CHALLENGE_ANSWER',
								currentChallenge: newChallenge.id
							},
							userChallenge: {}
						}
					)
				}
				return UserChallenge.create({
					userId: user.id,
					challengeId: newChallenge.id
				})
				.then(newUserChallenge => {
					// console.log(newUserChallenge)
					return {
						state:{
							messageState: 'CHALLENGE_ANSWER',
							currentChallenge: newChallenge.id
						},
						message: newChallenge.objective+": "+newChallenge.summary,
					}
				})

			} else {
				if(user.status == 'active_pair') {
					return fetchPartnerFromUserMission(
						user,
						{
							user: {
								messageState: 'STANDBY',
								currentMission: 0,
								currentChallenge: 0
							},
						}
					)
					.then(() => {
						return {
							state: {
								messageState: 'STANDBY',
								currentMission: 0,
								currentChallenge: 0
							}
						}
					})
				}
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

	CHALLENGE_ANSWER: (user, message) => {

		let returnMessage = "";
		let currentChallenge;
		return Challenge.findById(user.currentChallenge)
		.then(foundChallenge => {
			currentChallenge = foundChallenge;
			let goodAnswer = false;

			switch (currentChallenge.category) {
				case 'text':
					if (currentChallenge.targetText.toLowerCase() == message.Body.toLowerCase()) goodAnswer = true;
					break;
				case 'image':
					// put clarifai function here!!!
					/*
					 * parameters:	currentChallenge.targetTags // array of tags
					 * 				message // whole body of twilio request
					 * returns: true / false
					 */
					// let actualTags = [] // clarifai stuff

					// goodAnswer = getPhotoTags(message)
					// .then (actualTags => {
					// 	// console.log(actualTags);
					// 	if (checkTags(currentChallenge.targetTags, actualTags)) return true;
					// 	else return false;
					// })
					// break;
				case 'voice':
					// put Kat's voice stuff here!!
					/*
					 * parameters:	currentChallenge.targetText // target words
					 * 				message // whole body of twilio request
					 * returns: true / false
					 */
					// goodAnswer = checkWatsonPromise(message)
					// .then((transcript) => {
					// 	console.log('transcript:',transcript);
					// 	if (transcript != currentChallenge.targetText) 
					// 		returnMessage = "Not quite what we were looking for, but the Agency will manage. ";
					// 	return true;
					// })
					// break;
				default:
					goodAnswer = true;
			}

			return goodAnswer;
		})
		.then(success => {

			if(!success) return {message: "Your answer doesn't quite match The Agency's records.  Please try again."};

			// if program reaches here, answer is correct
			let waitForThese = []
			let temp = UserChallenge.findOne({
				where: {
					userId: user.id,
					challengeId: user.currentChallenge
				}
			})
			.then(foundUserChallenge => {
				if (foundUserChallenge)
					return foundUserChallenge.update({status: 'complete'});
			})
			waitForThese.push(temp);

			let returnObj, partnerObj;

			if(currentChallenge.hasNext) {
				returnObj = {
					state: {messageState: 'FETCH_CHALLENGE'},
					message: currentChallenge.conclusion + "\n\nAre you ready for your next challenge?"
				}

				partnerObj = {
					user: {messageState: 'FETCH_CHALLENGE'},
					userChallenge: {status: 'complete'}
				}
			} else {
				// finished last challenge of mission, set mission to complete

				temp = UserMission.findOne({
					where: {
						userId: user.id,
						missionId: user.currentMission
					}
				})
				.then(foundUserMission => {
					return foundUserMission.update({status: 'complete'})
				})
				waitForThese.push(temp)

				returnObj = {
					state: {
						messageState: 'STANDBY',
						currentMission: 0,
						currentChallenge: 0,
						status: 'standby'
					},
					message: currentChallenge.conclusion + "\n\nYou have completed your mission.  Text 'new mission' to start a new mission",
				}

				partnerObj = {
					user: {
						messageState: 'STANDBY',
						currentMission: 0,
						currentChallenge: 0,
						status: 'standby'
					},

					userChallenge: {status: 'complete'},
					userMission: {status: 'complete'}
				}
			}

			if (user.status == 'active_pair') {
				temp = fetchPartnerFromUserMission(user, partnerObj);
				waitForThese.push(temp);
			}

			return Promise.all(waitForThese)
			.then(() => {
				return returnObj;
			})
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

function sharedMission(userNonMissions, partnerMissions){
	//there is at least one mission in userMissions that is NOT in partnerMissions
	let newMission = null;
	partnerMissions = partnerMissions.map(mission => (mission.missionId))
	console.log("PARTNER MISSION IDS: ", partnerMissions)
	userNonMissions.some(function(mission, i){
		console.log("looking at mission: ", mission.id, " ", partnerMissions.includes(mission.id))
		if(!partnerMissions.includes(mission.id)) {newMission = mission};
		if(newMission) {console.log("NEW MISSION ID: ", newMission.id)}

		return !partnerMissions.includes(mission)
	})
	return newMission;
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
 * user:
 * 		// user who your are searching for
 * 		// assumes user is up-to-date, so will sometimes need to tweak
 *		// important properties: {id, currentMission, currentChallenge}
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
				foundPartnerChallenge[0].update(allTheStates.userChallenge)
			})
			allUpdates.push(temp);
		}
		return Promise.all(allUpdates)
	})
}

module.exports = {whichMessage, checkTags, fetchPartnerFromUserMission};

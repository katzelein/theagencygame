
const {chooseMission} = require('./chooser')
const {getChallenge} = require('./chooser')
const {getLocation} = require('./location')

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
		let re = new RegExp("^[A-Za-z0-9]+$");
		if (re.test(userInput)) {
		    console.log("Valid username");
		} else {
		    console.log("Invalid username");
		}
	
		return {
			state: {
				username: userInput, 
				messageState: 'TUTORIAL_MISSION_1'
			},
			message: "Welcome to the Agency, Agent "+userInput+"! Would you like to participate in a training mission?"
		}
	},

	TUTORIAL_MISSION_1: (username, userInput) => {
		//can't expect just a yes or no
		// var userInput = message.Body.toLowerCase()
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
						latitude: coordinates[0],
						longitude: coordinates[1]
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

	TUTORIAL_MISSION_3: () => {
		// assuming they sent in a picture
		return {
			state: {messageState: 'STANDBY'},
			message: "Congratulations, Trainee, you have completed your training mission!  Your name has been added to our list of active field agents.  Text in 'new mission' whenever you have the time to request your first mission!"
		}
	},

	STANDBY: (username, userInput) => {
		if (userInput == 'no') {
			return {
				state: {messageState: 'QUERY_HIATUS'},
				message: "Agent "+username+", you are currently between missions. Do you wish to take a hiatus from missions?"
			}
		} else if (userInput == 'new' || userInput == 'new mission') {
			return {
				state: {messageState: 'QUERY_MISSION'},
				message: "Ah, Agent "+username+", good of you to call in! Before we assign you a new mission, please send in your location."
			}
		}
	},

	QUERY_MISSION: (username, message) => {
		// assume we were able to access and process location
		var coordinatesPromise = getLocation(message)
		console.log("coordinatesPromise: ", coordinatesPromise)
		return coordinatesPromise
		.then(coordinates => {
			if(typeof coordinates === 'object'){
				return chooseMission()
				.then(newMission => {
					return {
						state: {
							messageState: 'FETCH_CHALLENGE', 
							currentMission: newMission.id
						},
						message: newMission.title+": "+newMission.description+" Do you accept this mission, Agent "+username+"?"
					}
				})
			}
			else{
				console.log("coordinates is not an array")
				return {
					message: "Sorry, The Agency's message processor was not able to parse your location from that message.  Please send in your street address instead."
				}
			}

		})

		
	},

	FETCH_CHALLENGE: (currentMission, currentChallengeId, userInput) => {
		return getChallenge(currentMission, currentChallengeId)
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

	CHALLENGE_ANSWER: (currentChallengeId, userInput) => {
		return Challenge.findById(currentChallengeId)
		.then(currentChallenge => {
			if (!currentChallenge.answer || userInput == currentChallenge.answer) {
				return {
					state: {
						messageState: 'FETCH_CHALLENGE',
					},
					message: currentChallenge.conclusion + " | Text back when you are ready for the next challenge."
				}
			} else {
				return {
					message: "Your answer doesn't quite match ...."
				}
			}
		})
	},

	QUERY_HIATUS: () =>{return ""}

}

module.exports = whichMessage;
const {expect} = require('chai');

const db = require('../../models/index')
const User = require('../../models/user')
const Mission = require('../../models/mission');
const Challenge = require('../../models/challenge');
const UserMission = require('../../models/userMission');
const UserChallenge = require('../../models/userChallenge')

const {fetchMessage} = require('../lookup')

describe('Game Play', () => {
	describe('single player', () => {
		let spiderUser, missionId, challengeIds;

		before('Create user, fetch important id\'s', () => {
			return User.create({
				username: 'Chernaya Vdovda',
				status: 'standby',
				currentMission: 0,
				currentChallenge: 0,
				messageState: 'QUERY_MISSION',
				location: {type: 'Point', coordinates: [40.705691, -74.009342]}
			})
			.then(newUser => {
				spiderUser = newUser;
				return Mission.findOne({
					where:{place: 'Grace Hopper'}, 
					include: [Challenge]
				})
			})
			.then(foundMission => {
				// console.log(foundMission)
				missionId = foundMission.id;
				challengeIds = [
					foundMission.challenges[0].id,
					foundMission.challenges[1].id,
					foundMission.challenges[2].id,
					foundMission.challenges[3].id,
					foundMission.challenges[4].id
				]
			})
		})

		beforeEach('Fetch fresh copy of user', () => {
			return User.findById(spiderUser.id)
			.then(foundUser => {
				spiderUser = foundUser;
			})
		})

		xit('user starts on STANDBY', () => {
			expect(spiderUser.messageState).to.be.equal('STANDBY');
			expect(spiderUser.status).to.be.equal('standby');
		})

		xit('user texts in \'new\' to start a mission | server asks for location', () => {
			return fetchMessage(spiderUser, {Body: 'new'})
			.then(message => {
				expect(message).to.be.equal("Ah, Agent Chernaya Vdovda, good of you to call in! Before we assign you a new mission, please send in your location.")
			})
		})

		xit('user status on standby, messageState at SOLO_YN', () => {
			expect(spiderUser.messageState).to.be.equal('SOLO_YN');
			expect(spiderUser.status).to.be.equal('standby')
		})

		xit('user texts in location | server asks lone wolf or eager beaver', () => {
			return fetchMessage(spiderUser, {Body: 'manhattan'})
			.then(message => {
				expect(message).to.be.equal("Thank you for sending in your location.  Would you prefer to partner up for your next mission, or go it alone? Respond with 'lone wolf' or 'eager beaver'.")
			})
		})

		it('user messageState at QUERY_MISSION', () => {
			expect(spiderUser.messageState).to.be.equal('QUERY_MISSION')
			expect(spiderUser.status).to.be.equal('standby');
			expect(spiderUser.currentMission).to.be.equal(0)
			expect(spiderUser.currentChallenge).to.be.equal(0)

			return UserMission.findOne({
				where: {
					userId: spiderUser.id,
					missionId: missionId
				}
			})
			.then(foundUserMission => {
				expect(foundUserMission).to.be.null;
			})
		})

		it('user texts in \'lone wolf\' | server sends mission description: Grace Hopper', () => {
			return fetchMessage(spiderUser, {Body: 'lone wolf'})
			.then(message => {
				expect(message).to.be.equal("Grace Hopper and the Missing Bone: Ben, one of Grace Hopper Academy's proudest members, has had his favorite bone stolen out from under his nose. Can you identify the thief? Do you accept this mission, Agent Chernaya Vdovda?")
			})
		})

		it('user messageState at FETCH_CHALLENGE', () => {
			expect(spiderUser.messageState).to.be.equal('FETCH_CHALLENGE')
			expect(spiderUser.status).to.be.equal('active_solo');
			expect(spiderUser.currentMission).to.be.equal(missionId)
			expect(spiderUser.currentChallenge).to.be.equal(0)

			return UserMission.findOne({
				where: {
					userId: spiderUser.id,
					missionId: missionId
				}
			})
			.then(foundUserMission => {
				expect(foundUserMission).to.not.be.null;
				expect(foundUserMission.status).to.be.equal('incomplete')
				expect(foundUserMission.partnerId).to.be.null;
				
				return UserChallenge.findOne({
					where: {
						userId: spiderUser.id,
						challengeId: challengeIds[0]
					}
				})
			})
			.then(foundUserChallenge => {
				expect(foundUserChallenge).to.be.null
			})
		})

		it('user texts in to accept mission | server sends challenge description: Ben\'s Bowl', () => {
			return fetchMessage(spiderUser, {Body: 'yes'})
			.then(message => {
				expect(message).to.be.equal("Find GHA\'s Newest Hero, Ceren: Ceren, Ben\'s doting mom who, in an incredible feat of strength and love, pulled him from the grips of an oncoming subway just a few weeks ago, spends her days in the CSS room. Find her office where Ben\'s orange water bowl sits and send us a picture; we need a warrant to dust the bowl for fingerprints.")
			})
		})

		it('user messageState at CHALLENGE_ANSWER', () => {
			expect(spiderUser.messageState).to.be.equal('CHALLENGE_ANSWER')
			expect(spiderUser.status).to.be.equal('active_solo');
			expect(spiderUser.currentMission).to.be.equal(missionId)
			expect(spiderUser.currentChallenge).to.be.equal(challengeIds[0])

			UserChallenge.findOne({
				where: {
					userId: spiderUser.id,
					challengeId: challengeIds[0]
				}
			})
			.then(foundUserChallenge => {
				expect(foundUserChallenge).to.not.be.null
				expect(foundUserChallenge.status).to.be.equal('incomplete')
			})
		})

		it('user texts in a picture of the bowl | server asks to continue to next challenge', () => {
			let answer = {
				MediaUrl0: 'https://api.twilio.com/2010-04-01/Accounts/ACc41e6487bcf3da0f8bdde627b28740d2/Messages/MM26aa8d1a6ee78d96e0579ee0d2b797df/Media/ME97234e6fe389ca73761e882278b4aeb3',
				MediaContentType0: 'image/jpeg', 
			} // bowl
			return fetchMessage(spiderUser, answer)
			.then(message => {
				expect(message).to.be.equal("Great work. We\'re picking up the scent of our thief.\n\nAre you ready for your next challenge?")
			})
		})

		it('user messageState at FETCH_CHALLENGE', () => {
			expect(spiderUser.messageState).to.be.equal('FETCH_CHALLENGE')
			expect(spiderUser.status).to.be.equal('active_solo');
			expect(spiderUser.currentMission).to.be.equal(missionId)
			expect(spiderUser.currentChallenge).to.be.equal(challengeIds[0])

			return UserChallenge.findOne({
				where: {
					userId: spiderUser.id,
					challengeId: challengeIds[0]
				}
			})
			.then(foundUserChallenge => {
				expect(foundUserChallenge).to.not.be.null
				expect(foundUserChallenge.status).to.be.equal('complete')
			})
		})

		it('user texts in \'yes\' | server sends challenge description: Fire Extinguisher', () => {
			return fetchMessage(spiderUser, {Body: 'yes'})
			.then(message => {
				expect(message).to.be.equal("Putting Out Kitchen Fires: Ben loves to wander the hallways of Grace Hopper, finding the occasional student eager to scratch his belly, or scooping up the remains of a forgotten blueberry muffin. On the day of the theft, Ben was seen more than usual around the kitchen yesterday during an incoming shipment of cereal; we think this may be where the thief saw their opportunity. Please send the license number for the fire extinguisher on the left by the passcoded door. We believe the thief may use this as the passcode for their own office.")
			})
		})

		it('user messageState at CHALLENGE_ANSWER', () => {
			expect(spiderUser.messageState).to.be.equal('CHALLENGE_ANSWER')
			expect(spiderUser.status).to.be.equal('active_solo');
			expect(spiderUser.currentMission).to.be.equal(missionId)
			expect(spiderUser.currentChallenge).to.be.equal(challengeIds[1])

			return UserChallenge.findOne({
				where: {
					userId: spiderUser.id,
					challengeId: challengeIds[1]
				}
			})
			.then(foundUserChallenge => {
				expect(foundUserChallenge).to.not.be.null
				expect(foundUserChallenge.status).to.be.equal('incomplete')
			})
		})

		it('user texts in \'133w\' | server asks to continue to next challenge', () => {
			return fetchMessage(spiderUser, {Body: '133w'})
			.then(message => {
				expect(message).to.be.equal("You\'re on the mark, shouldn\'t be long now.\n\nAre you ready for your next challenge?")
			})
		})

		it('user messageState at FETCH_CHALLENGE', () => {
			expect(spiderUser.messageState).to.be.equal('FETCH_CHALLENGE')
			expect(spiderUser.status).to.be.equal('active_solo');
			expect(spiderUser.currentMission).to.be.equal(missionId)
			expect(spiderUser.currentChallenge).to.be.equal(challengeIds[1])

			return UserChallenge.findOne({
				where: {
					userId: spiderUser.id,
					challengeId: challengeIds[1]
				}
			})
			.then(foundUserChallenge => {
				expect(foundUserChallenge).to.not.be.null
				expect(foundUserChallenge.status).to.be.equal('complete')
			})
		})

		it('user texts in \'yes\' | server sends challenge description: Voice call', () => {
			return fetchMessage(spiderUser, {Body: 'yes'})
			.then(message => {
				expect(message).to.be.equal("Tracking the Teacher: We have a list of all the offices linked to the passcode you found, and one of the teachers of Grace Hopper and Fullstack Academy, Ashi Krishnan, spent the day in the office implicated during the theft of Ben\'s bone. Find Ashi and find out the name of her childhood dog -- but do it covertly. She can\'t know that she\'s a suspect. Then call this number, speak the name of the dog when prompted, and quickly hang up. Secrecy is key.")
			})
		})

		it('user messageState at CHALLENGE_ANSWER', () => {
			expect(spiderUser.messageState).to.be.equal('CHALLENGE_ANSWER')
			expect(spiderUser.status).to.be.equal('active_solo');
			expect(spiderUser.currentMission).to.be.equal(missionId)
			expect(spiderUser.currentChallenge).to.be.equal(challengeIds[2])

			return UserChallenge.findOne({
				where: {
					userId: spiderUser.id,
					challengeId: challengeIds[2]
				}
			})
			.then(foundUserChallenge => {
				expect(foundUserChallenge).to.not.be.null
				expect(foundUserChallenge.status).to.be.equal('incomplete')
			})
		})

		it('user calls in | servers sends a text message to continue', () => {
			let answer = {
				RecordingUrl: "https://api.twilio.com/2010-04-01/Accounts/ACc41e6487bcf3da0f8bdde627b28740d2/Recordings/RE75eed5e89a494ce14683e246b38a3928"
			}
			return fetchMessage(spiderUser, answer)
			.then(message => {
				expect(message).to.be.equal("Ashi may not be the thief, but our progress has been strong. Well done, agent. The future looks bright.\n\nAre you ready for your next challenge?");
			})
		})

		it('user messageState at FETCH_CHALLENGE', () => {
			expect(spiderUser.messageState).to.be.equal('FETCH_CHALLENGE')
			expect(spiderUser.status).to.be.equal('active_solo');
			expect(spiderUser.currentMission).to.be.equal(missionId)
			expect(spiderUser.currentChallenge).to.be.equal(challengeIds[2])

			return UserChallenge.findOne({
				where: {
					userId: spiderUser.id,
					challengeId: challengeIds[2]
				}
			})
			.then(foundUserChallenge => {
				expect(foundUserChallenge).to.not.be.null
				expect(foundUserChallenge.status).to.be.equal('complete')
			})
		})

		it('user texts in \'yes\' | server sends challenge description: GHA Logo', () => {
			return fetchMessage(spiderUser, {Body: 'yes'})
			.then(message => {
				expect(message).to.be.equal("Grace Hopper Academy\'s Secret Storage: We think that the thief may have an even bigger profile at the school than we thought possible. The corruption runs deep. The thief may have been so smart as to code a clue into the Grace Hopper logo in plain sight. Head to the lobby of the school and send us a picture of the logo.")
			})
		})

		it('user messageState at CHALLENGE_ANSWER', () => {
			expect(spiderUser.messageState).to.be.equal('CHALLENGE_ANSWER')
			expect(spiderUser.status).to.be.equal('active_solo');
			expect(spiderUser.currentMission).to.be.equal(missionId)
			expect(spiderUser.currentChallenge).to.be.equal(challengeIds[3])

			return UserChallenge.findOne({
				where: {
					userId: spiderUser.id,
					challengeId: challengeIds[3]
				}
			})
			.then(foundUserChallenge => {
				expect(foundUserChallenge).to.not.be.null
				expect(foundUserChallenge.status).to.be.equal('incomplete')
			})
		})

		it('user texts in image of the GHA logo | server asks to continue to next challenge', () => {
			let answer = {
				MediaUrl0: 'https://api.twilio.com/2010-04-01/Accounts/ACc41e6487bcf3da0f8bdde627b28740d2/Messages/MM28717150f4aa31afbfceb4d7e15af8e0/Media/MEf55921bbfc74d012ca5ecc11a472493d',
				MediaContentType0: 'image/jpeg'
			} // gha logo
			return fetchMessage(spiderUser, answer)
			.then(message => {
				expect(message).to.be.equal("Our intel was correct; the logo contained vital information. One last step and we should be able to catch the thief red-handed.\n\nAre you ready for your next challenge?")
			})
		})

		it('user messageState at FETCH_CHALLENGE', () => {
			expect(spiderUser.messageState).to.be.equal('FETCH_CHALLENGE')
			expect(spiderUser.status).to.be.equal('active_solo');
			expect(spiderUser.currentMission).to.be.equal(missionId)
			expect(spiderUser.currentChallenge).to.be.equal(challengeIds[3])

			return UserChallenge.findOne({
				where: {
					userId: spiderUser.id,
					challengeId: challengeIds[3]
				}
			})
			.then(foundUserChallenge => {
				expect(foundUserChallenge).to.not.be.null
				expect(foundUserChallenge.status).to.be.equal('complete')
			})
		})

		it('user texts in \'yes\' | server sends challenge description: Cereal', () => {
			return fetchMessage(spiderUser, {Body: 'yes'})
			.then(message => {
				expect(message).to.be.equal("The Voice of Ultimate Betrayal: This is where the rubber meets the road, agent. You will need to be your most stealthy. Find David Yang; he is never far away. We believe his taste in cereal could confirm whether or not he was interested in Ben\'s bone. Find out which cereal he is most excited to see in the Grace Hopper kitchen, and text it to us.")
			})
		})

		it('user messageState at CHALLENGE_ANSWER', () => {
			expect(spiderUser.messageState).to.be.equal('CHALLENGE_ANSWER')
			expect(spiderUser.status).to.be.equal('active_solo');
			expect(spiderUser.currentMission).to.be.equal(missionId)
			expect(spiderUser.currentChallenge).to.be.equal(challengeIds[4])

			return UserChallenge.findOne({
				where: {
					userId: spiderUser.id,
					challengeId: challengeIds[4]
				}
			})
			.then(foundUserChallenge => {
				expect(foundUserChallenge).to.not.be.null
				expect(foundUserChallenge.status).to.be.equal('incomplete')
			})
		})

		it('user texts in \'fruity pebbles\' | server sends end of mission', () => {
			return fetchMessage(spiderUser, {Body: 'fruity pebbles'})
			.then(message => {
				expect(message).to.be.equal("We have a match. David Yang is the thief of the missing bone. It is a dark day for Grace Hopper, but a proud day for the Agency. Well done, agent. Your country, and Ben, thanks you.\n\nYou have completed your mission.  Text \'new mission\' to start a new mission")
			})
		})

		it('user messageState at STANDBY', () => {
			expect(spiderUser.messageState).to.be.equal('STANDBY')
			expect(spiderUser.status).to.be.equal('standby');
			expect(spiderUser.currentMission).to.be.equal(0);
			expect(spiderUser.currentChallenge).to.be.equal(0);

			return UserChallenge.findOne({
				where: {
					userId: spiderUser.id,
					challengeId: challengeIds[4]
				}
			})
			.then(foundUserChallenge => {
				expect(foundUserChallenge).to.not.be.null
				expect(foundUserChallenge.status).to.be.equal('complete')
				return UserMission.findOne({
					where: {
						userId: spiderUser.id,
						missionId: missionId
					}
				})
			})
			.then(foundUserMission => {
				expect(foundUserMission).to.not.be.null
				expect(foundUserMission.status).to.be.equal('complete')
			})
		})
	})

	
	describe('pair player', () => {
		let spiderUser, spiderPartner, missionId, challengeIds;

		before('Create user, fetch important id\'s', () => {
			return User.create({
				username: 'Natalia Romanova',
				status: 'standby',
				currentMission: 0,
				currentChallenge: 0,
				messageState: 'QUERY_MISSION',
				location: {type: 'Point', coordinates: [40.705691, -74.009342]}
			})
			.then(newUser => {
				spiderUser = newUser;
				return User.create({
					username: 'Clint Barton',
					status: 'standby',
					currentMission: 0,
					currentChallenge: 0,
					messageState: 'QUERY_MISSION',
					location: {type: 'Point', coordinates: [40.705691, -74.009342]}
				})
			})
			.then(newUser => {
				spiderPartner = newUser;
				return Mission.findOne({
					where:{place: 'Grace Hopper'}, 
					include: [Challenge]
				})
			})
			.then(foundMission => {
				// console.log(foundMission)
				missionId = foundMission.id;
				challengeIds = [
					foundMission.challenges[0].id,
					foundMission.challenges[1].id,
					foundMission.challenges[2].id,
					foundMission.challenges[3].id,
					foundMission.challenges[4].id
				]
			})
		})

		beforeEach('Fetch fresh copy of user', () => {
			return User.findById(spiderUser.id)
			.then(foundUser => {
				spiderUser = foundUser;
				return User.findById(spiderPartner.id)
			})
			.then(foundUser => {
				spiderPartner = foundUser;
			})
		})

		xit('user starts on STANDBY', () => {
			expect(spiderUser.messageState).to.be.equal('STANDBY');
			expect(spiderUser.status).to.be.equal('standby');
		})

		xit('user texts in \'new\' to start a mission | server asks for location', () => {
			return fetchMessage(spiderUser, {Body: 'new'})
			.then(message => {
				expect(message).to.be.equal("Ah, Agent Chernaya Vdovda, good of you to call in! Before we assign you a new mission, please send in your location.")
			})
		})

		xit('user status on standby, messageState at SOLO_YN', () => {
			expect(spiderUser.messageState).to.be.equal('SOLO_YN');
			expect(spiderUser.status).to.be.equal('standby')
		})

		xit('user texts in location | server asks lone wolf or eager beaver', () => {
			return fetchMessage(spiderUser, {Body: 'manhattan'})
			.then(message => {
				expect(message).to.be.equal("Thank you for sending in your location.  Would you prefer to partner up for your next mission, or go it alone? Respond with 'lone wolf' or 'eager beaver'.")
			})
		})

		it('user messageState at QUERY_MISSION', () => {
			expect(spiderUser.messageState).to.be.equal('QUERY_MISSION')
			expect(spiderUser.status).to.be.equal('standby');
			expect(spiderUser.currentMission).to.be.equal(0)
			expect(spiderUser.currentChallenge).to.be.equal(0)

			return UserMission.findOne({
				where: {
					userId: spiderUser.id,
					missionId: missionId
				}
			})
			.then(foundUserMission => {
				expect(foundUserMission).to.be.null;
			})
		})

		it('user texts in \'lone wolf\' | server sends mission description: Grace Hopper', () => {
			return fetchMessage(spiderUser, {Body: 'lone wolf'})
			.then(message => {
				expect(message).to.be.equal("Grace Hopper and the Missing Bone: Ben, one of Grace Hopper Academy's proudest members, has had his favorite bone stolen out from under his nose. Can you identify the thief? Do you accept this mission, Agent Chernaya Vdovda?")
			})
		})

		it('user messageState at FETCH_CHALLENGE', () => {
			expect(spiderUser.messageState).to.be.equal('FETCH_CHALLENGE')
			expect(spiderUser.status).to.be.equal('active_solo');
			expect(spiderUser.currentMission).to.be.equal(missionId)
			expect(spiderUser.currentChallenge).to.be.equal(0)

			return UserMission.findOne({
				where: {
					userId: spiderUser.id,
					missionId: missionId
				}
			})
			.then(foundUserMission => {
				expect(foundUserMission).to.not.be.null;
				expect(foundUserMission.status).to.be.equal('incomplete')
				expect(foundUserMission.partnerId).to.be.null;
				
				return UserChallenge.findOne({
					where: {
						userId: spiderUser.id,
						challengeId: challengeIds[0]
					}
				})
			})
			.then(foundUserChallenge => {
				expect(foundUserChallenge).to.be.null
			})
		})

		it('user texts in to accept mission | server sends challenge description: Ben\'s Bowl', () => {
			return fetchMessage(spiderUser, {Body: 'yes'})
			.then(message => {
				expect(message).to.be.equal("Find GHA\'s Newest Hero, Ceren: Ceren, Ben\'s doting mom who, in an incredible feat of strength and love, pulled him from the grips of an oncoming subway just a few weeks ago, spends her days in the CSS room. Find her office where Ben\'s orange water bowl sits and send us a picture; we need a warrant to dust the bowl for fingerprints.")
			})
		})

		it('user messageState at CHALLENGE_ANSWER', () => {
			expect(spiderUser.messageState).to.be.equal('CHALLENGE_ANSWER')
			expect(spiderUser.status).to.be.equal('active_solo');
			expect(spiderUser.currentMission).to.be.equal(missionId)
			expect(spiderUser.currentChallenge).to.be.equal(challengeIds[0])

			UserChallenge.findOne({
				where: {
					userId: spiderUser.id,
					challengeId: challengeIds[0]
				}
			})
			.then(foundUserChallenge => {
				expect(foundUserChallenge).to.not.be.null
				expect(foundUserChallenge.status).to.be.equal('incomplete')
			})
		})

		it('user texts in a picture of the bowl | server asks to continue to next challenge', () => {
			let answer = {
				MediaUrl0: 'https://api.twilio.com/2010-04-01/Accounts/ACc41e6487bcf3da0f8bdde627b28740d2/Messages/MM26aa8d1a6ee78d96e0579ee0d2b797df/Media/ME97234e6fe389ca73761e882278b4aeb3',
				MediaContentType0: 'image/jpeg', 
			} // bowl
			return fetchMessage(spiderUser, answer)
			.then(message => {
				expect(message).to.be.equal("Great work. We\'re picking up the scent of our thief.\n\nAre you ready for your next challenge?")
			})
		})

		it('user messageState at FETCH_CHALLENGE', () => {
			expect(spiderUser.messageState).to.be.equal('FETCH_CHALLENGE')
			expect(spiderUser.status).to.be.equal('active_solo');
			expect(spiderUser.currentMission).to.be.equal(missionId)
			expect(spiderUser.currentChallenge).to.be.equal(challengeIds[0])

			return UserChallenge.findOne({
				where: {
					userId: spiderUser.id,
					challengeId: challengeIds[0]
				}
			})
			.then(foundUserChallenge => {
				expect(foundUserChallenge).to.not.be.null
				expect(foundUserChallenge.status).to.be.equal('complete')
			})
		})

		it('user texts in \'yes\' | server sends challenge description: Fire Extinguisher', () => {
			return fetchMessage(spiderUser, {Body: 'yes'})
			.then(message => {
				expect(message).to.be.equal("Putting Out Kitchen Fires: Ben loves to wander the hallways of Grace Hopper, finding the occasional student eager to scratch his belly, or scooping up the remains of a forgotten blueberry muffin. On the day of the theft, Ben was seen more than usual around the kitchen yesterday during an incoming shipment of cereal; we think this may be where the thief saw their opportunity. Please send the license number for the fire extinguisher on the left by the passcoded door. We believe the thief may use this as the passcode for their own office.")
			})
		})

		it('user messageState at CHALLENGE_ANSWER', () => {
			expect(spiderUser.messageState).to.be.equal('CHALLENGE_ANSWER')
			expect(spiderUser.status).to.be.equal('active_solo');
			expect(spiderUser.currentMission).to.be.equal(missionId)
			expect(spiderUser.currentChallenge).to.be.equal(challengeIds[1])

			return UserChallenge.findOne({
				where: {
					userId: spiderUser.id,
					challengeId: challengeIds[1]
				}
			})
			.then(foundUserChallenge => {
				expect(foundUserChallenge).to.not.be.null
				expect(foundUserChallenge.status).to.be.equal('incomplete')
			})
		})

		it('user texts in \'133w\' | server asks to continue to next challenge', () => {
			return fetchMessage(spiderUser, {Body: '133w'})
			.then(message => {
				expect(message).to.be.equal("You\'re on the mark, shouldn\'t be long now.\n\nAre you ready for your next challenge?")
			})
		})

		it('user messageState at FETCH_CHALLENGE', () => {
			expect(spiderUser.messageState).to.be.equal('FETCH_CHALLENGE')
			expect(spiderUser.status).to.be.equal('active_solo');
			expect(spiderUser.currentMission).to.be.equal(missionId)
			expect(spiderUser.currentChallenge).to.be.equal(challengeIds[1])

			return UserChallenge.findOne({
				where: {
					userId: spiderUser.id,
					challengeId: challengeIds[1]
				}
			})
			.then(foundUserChallenge => {
				expect(foundUserChallenge).to.not.be.null
				expect(foundUserChallenge.status).to.be.equal('complete')
			})
		})

		it('user texts in \'yes\' | server sends challenge description: Voice call', () => {
			return fetchMessage(spiderUser, {Body: 'yes'})
			.then(message => {
				expect(message).to.be.equal("Tracking the Teacher: We have a list of all the offices linked to the passcode you found, and one of the teachers of Grace Hopper and Fullstack Academy, Ashi Krishnan, spent the day in the office implicated during the theft of Ben\'s bone. Find Ashi and find out the name of her childhood dog -- but do it covertly. She can\'t know that she\'s a suspect. Then call this number, speak the name of the dog when prompted, and quickly hang up. Secrecy is key.")
			})
		})

		it('user messageState at CHALLENGE_ANSWER', () => {
			expect(spiderUser.messageState).to.be.equal('CHALLENGE_ANSWER')
			expect(spiderUser.status).to.be.equal('active_solo');
			expect(spiderUser.currentMission).to.be.equal(missionId)
			expect(spiderUser.currentChallenge).to.be.equal(challengeIds[2])

			return UserChallenge.findOne({
				where: {
					userId: spiderUser.id,
					challengeId: challengeIds[2]
				}
			})
			.then(foundUserChallenge => {
				expect(foundUserChallenge).to.not.be.null
				expect(foundUserChallenge.status).to.be.equal('incomplete')
			})
		})

		it('user calls in | servers sends a text message to continue', () => {
			let answer = {
				RecordingUrl: "https://api.twilio.com/2010-04-01/Accounts/ACc41e6487bcf3da0f8bdde627b28740d2/Recordings/RE75eed5e89a494ce14683e246b38a3928"
			}
			return fetchMessage(spiderUser, answer)
			.then(message => {
				expect(message).to.be.equal("Ashi may not be the thief, but our progress has been strong. Well done, agent. The future looks bright.\n\nAre you ready for your next challenge?");
			})
		})

		it('user messageState at FETCH_CHALLENGE', () => {
			expect(spiderUser.messageState).to.be.equal('FETCH_CHALLENGE')
			expect(spiderUser.status).to.be.equal('active_solo');
			expect(spiderUser.currentMission).to.be.equal(missionId)
			expect(spiderUser.currentChallenge).to.be.equal(challengeIds[2])

			return UserChallenge.findOne({
				where: {
					userId: spiderUser.id,
					challengeId: challengeIds[2]
				}
			})
			.then(foundUserChallenge => {
				expect(foundUserChallenge).to.not.be.null
				expect(foundUserChallenge.status).to.be.equal('complete')
			})
		})

		it('user texts in \'yes\' | server sends challenge description: GHA Logo', () => {
			return fetchMessage(spiderUser, {Body: 'yes'})
			.then(message => {
				expect(message).to.be.equal("Grace Hopper Academy\'s Secret Storage: We think that the thief may have an even bigger profile at the school than we thought possible. The corruption runs deep. The thief may have been so smart as to code a clue into the Grace Hopper logo in plain sight. Head to the lobby of the school and send us a picture of the logo.")
			})
		})

		it('user messageState at CHALLENGE_ANSWER', () => {
			expect(spiderUser.messageState).to.be.equal('CHALLENGE_ANSWER')
			expect(spiderUser.status).to.be.equal('active_solo');
			expect(spiderUser.currentMission).to.be.equal(missionId)
			expect(spiderUser.currentChallenge).to.be.equal(challengeIds[3])

			return UserChallenge.findOne({
				where: {
					userId: spiderUser.id,
					challengeId: challengeIds[3]
				}
			})
			.then(foundUserChallenge => {
				expect(foundUserChallenge).to.not.be.null
				expect(foundUserChallenge.status).to.be.equal('incomplete')
			})
		})

		it('user texts in image of the GHA logo | server asks to continue to next challenge', () => {
			let answer = {
				MediaUrl0: 'https://api.twilio.com/2010-04-01/Accounts/ACc41e6487bcf3da0f8bdde627b28740d2/Messages/MM28717150f4aa31afbfceb4d7e15af8e0/Media/MEf55921bbfc74d012ca5ecc11a472493d',
				MediaContentType0: 'image/jpeg'
			} // gha logo
			return fetchMessage(spiderUser, answer)
			.then(message => {
				expect(message).to.be.equal("Our intel was correct; the logo contained vital information. One last step and we should be able to catch the thief red-handed.\n\nAre you ready for your next challenge?")
			})
		})

		it('user messageState at FETCH_CHALLENGE', () => {
			expect(spiderUser.messageState).to.be.equal('FETCH_CHALLENGE')
			expect(spiderUser.status).to.be.equal('active_solo');
			expect(spiderUser.currentMission).to.be.equal(missionId)
			expect(spiderUser.currentChallenge).to.be.equal(challengeIds[3])

			return UserChallenge.findOne({
				where: {
					userId: spiderUser.id,
					challengeId: challengeIds[3]
				}
			})
			.then(foundUserChallenge => {
				expect(foundUserChallenge).to.not.be.null
				expect(foundUserChallenge.status).to.be.equal('complete')
			})
		})

		it('user texts in \'yes\' | server sends challenge description: Cereal', () => {
			return fetchMessage(spiderUser, {Body: 'yes'})
			.then(message => {
				expect(message).to.be.equal("The Voice of Ultimate Betrayal: This is where the rubber meets the road, agent. You will need to be your most stealthy. Find David Yang; he is never far away. We believe his taste in cereal could confirm whether or not he was interested in Ben\'s bone. Find out which cereal he is most excited to see in the Grace Hopper kitchen, and text it to us.")
			})
		})

		it('user messageState at CHALLENGE_ANSWER', () => {
			expect(spiderUser.messageState).to.be.equal('CHALLENGE_ANSWER')
			expect(spiderUser.status).to.be.equal('active_solo');
			expect(spiderUser.currentMission).to.be.equal(missionId)
			expect(spiderUser.currentChallenge).to.be.equal(challengeIds[4])

			return UserChallenge.findOne({
				where: {
					userId: spiderUser.id,
					challengeId: challengeIds[4]
				}
			})
			.then(foundUserChallenge => {
				expect(foundUserChallenge).to.not.be.null
				expect(foundUserChallenge.status).to.be.equal('incomplete')
			})
		})

		it('user texts in \'fruity pebbles\' | server sends end of mission', () => {
			return fetchMessage(spiderUser, {Body: 'fruity pebbles'})
			.then(message => {
				expect(message).to.be.equal("We have a match. David Yang is the thief of the missing bone. It is a dark day for Grace Hopper, but a proud day for the Agency. Well done, agent. Your country, and Ben, thanks you.\n\nYou have completed your mission.  Text \'new mission\' to start a new mission")
			})
		})

		it('user messageState at STANDBY', () => {
			expect(spiderUser.messageState).to.be.equal('STANDBY')
			expect(spiderUser.status).to.be.equal('standby');
			expect(spiderUser.currentMission).to.be.equal(0);
			expect(spiderUser.currentChallenge).to.be.equal(0);

			return UserChallenge.findOne({
				where: {
					userId: spiderUser.id,
					challengeId: challengeIds[4]
				}
			})
			.then(foundUserChallenge => {
				expect(foundUserChallenge).to.not.be.null
				expect(foundUserChallenge.status).to.be.equal('complete')
				return UserMission.findOne({
					where: {
						userId: spiderUser.id,
						missionId: missionId
					}
				})
			})
			.then(foundUserMission => {
				expect(foundUserMission).to.not.be.null
				expect(foundUserMission.status).to.be.equal('complete')
			})
		})
	})

})


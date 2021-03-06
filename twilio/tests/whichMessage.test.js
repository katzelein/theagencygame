const {expect} = require('chai');

const {getChallenge, chooseMission} = require('../chooser')
const db = require('../../models/index')
const User = require('../../models/user')
const Mission = require('../../models/mission');
const Challenge = require('../../models/challenge');
const UserMission = require('../../models/userMission');
const UserChallenge = require('../../models/userChallenge')

const {
	whichMessage, 
	checkTags, 
	fetchPartnerFromUserMission
} = require('../whichMessage');

describe('Game Logic', () => {

	// let newUser;

	// beforeEach ('create User', () => {
	// 	newUser = {
	// 		phoneNumber : '+5556667777'
	// 	}
	// })
	
	describe('state: FETCH_CHALLENGE (PROBLEM: cannot read property challenges of null)',() => {
		describe('preceding message: [Do you accept this mission?, Are you ready for your next challenge?]', () => {

			let missionId, challengeId, firstChallenge, secondChallenge, programmerUser;
			
			before('create mission and challenges', () => {
				const newMission = Mission.create({
					title: "MISSION TITLE",
					description: "Your mission, should you choose to accept it, is to get this program working.",
					location: null /*middle of the atlantic ocean*/,
					place: "here",
					numChallenges: 2
				})
				const newChallenge1 = Challenge.create({
					objective: "Fix the errors",
					summary: "Do testing!",
					targetText: "fixed",
					category: "text",
					order: 1,
					hasNext: true
				})
				const newChallenge2 = Challenge.create({
					objective: "Run the program",
					summary: "npm start",
					targetText: "started",
					category: "text",
					order: 2,
					hasNext: true
				})
				
				return Promise.all([
					newMission,
					newChallenge1,
					newChallenge2
				])
				.then(promiseList => {
					let mission = promiseList[0];
					firstChallenge = promiseList[1];
					secondChallenge = promiseList[2];
					missionId = mission.id;
					return mission.setChallenges([firstChallenge,secondChallenge])
				})
				
			})

			beforeEach('create new user', () => {
				return User.create({
					currentMission: missionId
				})
				.then(newUser => {
					programmerUser = newUser;
				})
			})

			it('returns a promise that resolves to a state object', () => {
				const returnObj = whichMessage.FETCH_CHALLENGE(programmerUser, 'yes')
				return returnObj
				.then(result => {
					let keys = Object.keys(result);
					expect(keys.length).to.be.equal(2);
					expect(result.state).to.not.be.null;
				})
			})

			it('should fetch first challenge', () => {
				return whichMessage.FETCH_CHALLENGE(programmerUser, 'yes')
				.then(result => {
					challengeId = result.state.currentChallenge
					expect(result.state.currentChallenge).to.be.equal(firstChallenge.id);
				})
			})

			it('should fetch second challenge', () => {
				programmerUser.update({currentChallenge: firstChallenge})
				.then(updatedUser => {
					programmerUser = updatedUser;
					return whichMessage.FETCH_CHALLENGE(programmerUser, 'yes')
				})
				.then(result => {
					challengeId = result.state.currentChallenge
					expect(result.state.currentChallenge).to.be.equal(secondChallenge.id);
				})
			})

			it ('should reset mission and challenge if there are no more challenges', () => {
				programmerUser.update({currentChallenge: firstChallenge})
				.then(updatedUser => {
					programmerUser = updatedUser;
					return whichMessage.FETCH_CHALLENGE(programmerUser, 'yes')
				})
				.then(result => {
					// console.log(result)
					expect(result.state.messageState).to.be.equal('STANDBY')
					expect(result.state.currentMission).to.be.equal(0)
					expect(result.state.currentChallenge).to.be.equal(0)
				})
			})
		})
	})

	describe('state: CHALLENGE_ANSWER',() => {
		describe('preceding message: [<Challenge text> Send back a photo, Send back a text, make a voice call]', () => {
			let textChallenge, imageChallenge, voiceChallenge, nightwishMission, nightwishUser;

			before('create challenges', () => {
				let zeroth = Mission.create({
					title: 'Shudder Before the Beautiful',
					description: 'Endless Forms Most Beautiful',
					place: 'Nightwish',
					numChallenges: 2
				})
				let first = Challenge.create({
					objective: 'The music of this awe',
					summary: 'Deep silence between the notes',
					targetText: 'Deafens me with endless love',
					category: 'text',
					conclusion: 'This vagrant island earth',
					order: 1,
					hasNext: true
				})

				let second = Challenge.create({
					objective: 'This pilgrim shining bright',
					summary: 'We are shuddering',
					targetTags: ['gha_logo'],
					category: 'image',
					conclusion: 'Before the beautiful',
					order: 2,
					hasNext: true
				})

				let third = Challenge.create({
					objective: 'Before the plentiful',
					summary: 'We the voyagers',
					targetText: 'hello',
					category: 'voice',
					conclusion: 'The deepest solace lies in understanding',
					order: 3,
					hasNext: false
				})


				return Promise.all([zeroth, first, second, third])
				.then((promiseAnswers) => {
					nightwishMission = promiseAnswers[0];
					textChallenge = promiseAnswers[1];
					imageChallenge = promiseAnswers[2];
					voiceChallenge = promiseAnswers[3];
					// console.log(promiseAnswers)

					return User.create({
						username: 'Floor Jansen',
						currentMission: nightwishMission.id,
						currentChallenge: 0,
						status: 'standby',
						messageState: 'CHALLENGE_ANSWER'
					})
				})
				.then(newUser => {
					nightwishUser = newUser;
					return UserMission.create({
						userId: nightwishUser.id,
						missionId: nightwishMission.id,
					})
				})
				// return Promise.resolve(createAll)
			})

			describe('text input: ', () => {

				before('set user\'s currentChallenge to textChallenge', () => {
					return User.findById(nightwishUser.id)
					.then(foundUser => {
						return foundUser.update({currentChallenge: textChallenge.id})
					})
					.then(updatedUser => {
						nightwishUser = updatedUser;
					})
				})

				it('should return conclusion if text is correct', () => {
					let message = {Body: 'Deafens me with endless love'}

					return whichMessage.CHALLENGE_ANSWER(nightwishUser, message)
					.then(result => {
						let resultConclusion = result.message.slice(0,25);
						// console.log(resultConclusion);
						expect(resultConclusion).to.be.equal(textChallenge.conclusion)
					})
				})

				it('should return error message if text is incorrect', () => {
					let message = {Body: 'Nemo my name forevermore'}
					return whichMessage.CHALLENGE_ANSWER(nightwishUser, message)
					.then(result => {
						let resultConclusion = result.message.slice();
						// console.log(resultConclusion);
						expect(resultConclusion).to.be.equal("Your answer doesn't quite match The Agency's records.  Please try again.")
					})
				})
			})

			xdescribe ('image input: (success - don\'t overuse Clarifai in testing)', () => {

				before('set user\'s currentChallenge to imageChallenge', () => {
					return User.findById(nightwishUser.id)
					.then(foundUser => {
						return foundUser.update({currentChallenge: imageChallenge.id})
					})
					.then(updatedUser => {
						nightwishUser = updatedUser;
					})
				})

				it('should return conclusion if image is correct', () => {
					let message = {
						MediaUrl0: 'https://api.twilio.com/2010-04-01/Accounts/ACc41e6487bcf3da0f8bdde627b28740d2/Messages/MM28717150f4aa31afbfceb4d7e15af8e0/Media/MEf55921bbfc74d012ca5ecc11a472493d',
						MediaContentType0: 'image/jpeg', // gha logo
					}

					return whichMessage.CHALLENGE_ANSWER(nightwishUser, message)
					.then(result => {
						let resultConclusion = result.message.slice(0,20);
						// console.log(resultConclusion);
						expect(resultConclusion).to.be.equal(imageChallenge.conclusion)
					})
				})

				it('should return error message if image is incorrect', () => {
					let message = {
						MediaUrl0: 'https://api.twilio.com/2010-04-01/Accounts/ACc41e6487bcf3da0f8bdde627b28740d2/Messages/MMf83db10bb0caba9a75aeee2e3d8a5612/Media/ME217735d4d981bcb4ad9c314455319b82', // steampunk sign
						MediaContentType0: 'image/jpeg',
					}
					
					return whichMessage.CHALLENGE_ANSWER(nightwishUser, message)
					.then(result => {
						let resultConclusion = result.message.slice();
						// console.log(resultConclusion);
						expect(resultConclusion).to.be.equal("Your answer doesn't quite match The Agency's records.  Please try again.")
					})
				})
			})

			xdescribe('voice input: (PROBLEM: timing out)', () => {
				it('should return conclusion if voice message is correct', () => {
					let message = {RecordingUrl: "https://api.twilio.com/2010-04-01/Accounts/ACc41e6487bcf3da0f8bdde627b28740d2/Recordings/RE75eed5e89a494ce14683e246b38a3928"} // 'hello'
					return whichMessage.CHALLENGE_ANSWER(nightwishUser, message)
					.then(result => {
						let resultConclusion = result.message.slice(0,40);
						console.log(resultConclusion);
						expect(resultConclusion).to.be.equal(voiceChallenge.conclusion)
					})
				})

				it('should return error message if voice message is incorrect', () => {
					let message = {RecordingUrl: 'https://api.twilio.com/2010-04-01/Accounts/ACc41e6487bcf3da0f8bdde627b28740d2/Recordings/REe4ae4c77a5aa2c7d866a6494ff8a3318'}
					return whichMessage.CHALLENGE_ANSWER(nightwishUser, message)
					.then(result => {
						console.log(result)
						let resultConclusion = result.message.slice(0,34);
						console.log(resultConclusion);
						expect(resultConclusion).to.be.equal("Not quite what we were looking for")
					})
				})
			})

			xdescribe('voice input: (trying something different) (PROBLEM: timing out)', () => {

				// need to replace checkWatsonPromise with a spy
				it('should return conclusion if voice message is correct', () => {
					let message = {RecordingUrl: "https://api.twilio.com/2010-04-01/Accounts/ACc41e6487bcf3da0f8bdde627b28740d2/Recordings/RE75eed5e89a494ce14683e246b38a3928"} // 'hello'
					return whichMessage.CHALLENGE_ANSWER(nightwishUser, message)
					.then(result => {
						let resultConclusion = result.message.slice(0,40);
						console.log(resultConclusion);
						expect(resultConclusion).to.be.equal(voiceChallenge.conclusion)
					})
				})

				it('should return error message if voice message is incorrect', () => {
					let message = {RecordingUrl: 'https://api.twilio.com/2010-04-01/Accounts/ACc41e6487bcf3da0f8bdde627b28740d2/Recordings/REe4ae4c77a5aa2c7d866a6494ff8a3318'}
					return whichMessage.CHALLENGE_ANSWER(nightwishUser, message)
					.then(result => {
						console.log(result)
						let resultConclusion = result.message.slice(0,34);
						console.log(resultConclusion);
						expect(resultConclusion).to.be.equal("Not quite what we were looking for")
					})
				})
			})
		})
	})

	xdescribe('helper functions:', () => {
		describe('checkTags', () => {
			 
			it('returns true if at least one of expected tags exists in actual tags', () => {

				let expectedTags = ['yes'];
				let actualTags = ['yes', 'no', 'fun'];

				let answer = checkTags(expectedTags, actualTags);

				expect(answer).to.be.true
			})

			it ('returns false if none of expected tags exists in actual tags', () => {

				let expectedTags = ['yes'];
				let actualTags = ['not this', 'no', 'fun'];

				let answer = checkTags(expectedTags, actualTags);

				expect(answer).to.be.false
			})
		})

		describe('fetchPartnerFromUserMission', () => {
			let elanMission, elanChallenge, elanUser, elanPartner
			before('create users, missions, challenges', () => {
				const newMission = Mission.create({
					title: 'Leave the sleep and let the springtime talk',
					description: 'In tones from the time before man'
				})
				const newChallenge = Challenge.create({
					objective: 'Listen to a daffodil tell the tale',
					summary: 'Let the guest in, walk out, be the first to greet the morn',
				})

				return Promise.all([
					newMission,
					newChallenge
				])
				.then(promiseList => {
					elanMission = promiseList[0];
					elanChallenge = promiseList[1];

					const newUser = User.create({
						username: 'Tuomas Holopainen',
						currentMission: elanMission.id,
						currentChallenge: elanChallenge.id
					})
					const newPartner = User.create({
						username: 'Floor Jansen',
						currentMission: elanMission.id,
						currentChallenge: 0
					})
				
					return Promise.all([newUser, newPartner])
				})
				.then(promiseList => {
					elanUser = promiseList[0];
					elanPartner = promiseList[1];

					const newUserMission = UserMission.create({
						userId: elanUser.id,
						missionId: elanMission.id,
						partnerId: elanPartner.id
					})
					const newPartnerMission = UserMission.create({
						userId: elanPartner.id,
						missionId: elanMission.id,
						partnerId: elanUser.id
					})

					return Promise.all([newUserMission, newPartnerMission])
				})
			})

			beforeEach('fetch fresh copy of user', () => {
				let findUser = User.findById(elanUser.id);
				let findPartner = User.findById(elanPartner.id);
				return Promise.all([findUser, findPartner])
				.then(promiseList => {
					elanUser = promiseList[0];
					elanPartner = promiseList[1];
				})
			})

			it('should find and update partner based on user', () => {
				expect(elanPartner.currentMission).to.be.equal(elanMission.id)
				
				let allTheStates = {
					user: {
						currentMission: 0,
						currentChallenge: 0
					}
				}

				return fetchPartnerFromUserMission(elanUser, allTheStates)
				.then(() => {
					return User.findById(elanPartner.id)
				})
				.then(partner => {
					expect(partner.currentMission).to.be.equal(0)
					console.log('partner',partner)
					console.log('elanPartner', elanPartner)
				})
			})

			it('should find and update partner\'s UserMission model (fifty-fifty chance of failing - something to do with promises???)', () => {
				
				let allTheStates = {
					userMission: {status: 'complete'}
				}

				return UserMission.findOne({
					where: {
						userId: elanPartner.id,
						missionId: elanMission.id
					}
				})
				.then(foundPartnerMission => {
					// console.log(foundPartnerMission)
					expect(foundPartnerMission.status).to.be.equal('incomplete')
					let temp = fetchPartnerFromUserMission(elanUser, allTheStates)
					// console.log(temp)
					return Promise.resolve(temp)
				})
				.then(returned => {
					// console.log(returned);
					return UserMission.findOne({
						where: {
							userId:elanPartner.id,
							missionId: elanMission.id
						}
					})
					.then(foundPartnerMission => {
						console.log(foundPartnerMission.status)
						expect(foundPartnerMission.status).to.be.equal('complete')
					})
				})

			})

			it('should create partner\'s UserChallenge model', () => {

				let allTheStates = {
					userChallenge: {}
				}

				return UserChallenge.findOne({
					where: {
						userId: elanPartner.id,
						challengeId: elanChallenge.id
					}
				})
				.then(foundPartnerChallenge => {
					expect(foundPartnerChallenge).to.be.null;

					return fetchPartnerFromUserMission(elanUser, allTheStates)
				})
				.then(() => {
					return UserChallenge.findOne({
						where: {
							userId: elanPartner.id,
							challengeId: elanChallenge.id
						}
					})
				})
				.then(foundPartnerChallenge => {
					// console.log(foundPartnerChallenge)
					expect(foundPartnerChallenge.status).to.be.equal('incomplete');
				})
			})
		})
	})
}) 


// this is for clarifai
// { ToCountry: 'US',
//   MediaContentType0: 'image/jpeg',
//   ToState: 'NJ',
//   SmsMessageSid: 'MMf83db10bb0caba9a75aeee2e3d8a5612',
//   NumMedia: '1',
//   SmsSid: 'MMf83db10bb0caba9a75aeee2e3d8a5612',
//   FromState: 'NJ',
//   SmsStatus: 'received',
//   Body: '',
//   FromCountry: 'US',
//   MessagingServiceSid: 'MG2575ddfed9822f7d1e8d73e0dd9a4771',
//   ToZip: '07004',
//   NumSegments: '1',
//   MessageSid: 'MMf83db10bb0caba9a75aeee2e3d8a5612',
//   MediaUrl0: 'https://api.twilio.com/2010-04-01/Accounts/ACc41e6487bcf3da0f8bdde627b28740d2/Messages/MMf83db10bb0caba9a75aeee2e3d8a5612/Media/ME217735d4d981bcb4ad9c314455319b82',
//   ApiVersion: '2010-04-01' }

// this is for voice
/*

{ Called: '+19738745304',
  Digits: 'hangup',
  RecordingUrl: 'https://api.twilio.com/2010-04-01/Accounts/ACc41e6487bcf3da0f8bdde627b28740d2/Recordings/RE65d3b4f9b3872b4db9f5d914d8b36473',
  ToState: 'NJ',
  CallerCountry: 'US',
  Direction: 'inbound',
  CallerState: 'NJ',
  ToZip: '07004',
  CallSid: 'CA5a0fca87480147e7a1d94b166c455d89',
  To: '+19738745304',
  CallerZip: '07416',
  ToCountry: 'US',
  ApiVersion: '2010-04-01',
  CalledZip: '07004',
  CalledCity: 'FAIRFIELD',
  CallStatus: 'completed',
  RecordingSid: 'RE65d3b4f9b3872b4db9f5d914d8b36473',
  From: '+19739975239',
  CalledCountry: 'US',
  CallerCity: 'FRANKLIN',
  Caller: '+19739975239',
  FromCountry: 'US',
  ToCity: 'FAIRFIELD',
  FromCity: 'FRANKLIN',
  CalledState: 'NJ',
  FromZip: '07416',
  FromState: 'NJ',
  RecordingDuration: '5' }

{ Called: '+19738745304',
  Digits: 'hangup',
  RecordingUrl: 'https://api.twilio.com/2010-04-01/Accounts/ACc41e6487bcf3da0f8bdde627b28740d2/Recordings/REec02618bc904e81bc06227dfa21581d8',
  ToState: 'NJ',
  CallerCountry: 'US',
  Direction: 'inbound',
  CallerState: 'NJ',
  ToZip: '07004',
  CallSid: 'CA4308c8a1d6af09c7d9747f7f461e02cb',
  To: '+19738745304',
  CallerZip: '07416',
  ToCountry: 'US',
  ApiVersion: '2010-04-01',
  CalledZip: '07004',
  CalledCity: 'FAIRFIELD',
  CallStatus: 'completed',
  RecordingSid: 'REec02618bc904e81bc06227dfa21581d8',
  From: '+19739975239',
  CalledCountry: 'US',
  CallerCity: 'FRANKLIN',
  Caller: '+19739975239',
  FromCountry: 'US',
  ToCity: 'FAIRFIELD',
  FromCity: 'FRANKLIN',
  CalledState: 'NJ',
  FromZip: '07416',
  FromState: 'NJ',
  RecordingDuration: '9' }

'https://api.twilio.com/2010-04-01/Accounts/ACc41e6487bcf3da0f8bdde627b28740d2/Recordings/RE75eed5e89a494ce14683e246b38a3928',
// hello

'https://api.twilio.com/2010-04-01/Accounts/ACc41e6487bcf3da0f8bdde627b28740d2/Recordings/REe4ae4c77a5aa2c7d866a6494ff8a3318',
// welcome to the agents

// gha logo
{
	MediaUrl0: 'https://api.twilio.com/2010-04-01/Accounts/ACc41e6487bcf3da0f8bdde627b28740d2/Messages/MM28717150f4aa31afbfceb4d7e15af8e0/Media/MEf55921bbfc74d012ca5ecc11a472493d',
	MediaContentType0: 'image/jpeg', // gha logo
}
'{"MediaUrl0": "https://api.twilio.com/2010-04-01/Accounts/ACc41e6487bcf3da0f8bdde627b28740d2/Messages/MM28717150f4aa31afbfceb4d7e15af8e0/Media/MEf55921bbfc74d012ca5ecc11a472493d","MediaContentType0": "image/jpeg"}'

// bowl
{
	MediaUrl0: 'https://api.twilio.com/2010-04-01/Accounts/ACc41e6487bcf3da0f8bdde627b28740d2/Messages/MM26aa8d1a6ee78d96e0579ee0d2b797df/Media/ME97234e6fe389ca73761e882278b4aeb3',
	MediaContentType0: 'image/jpeg', 
}
'{"MediaUrl0": "https://api.twilio.com/2010-04-01/Accounts/ACc41e6487bcf3da0f8bdde627b28740d2/Messages/MM26aa8d1a6ee78d96e0579ee0d2b797df/Media/ME97234e6fe389ca73761e882278b4aeb3", "MediaContentType0": "image/jpeg"}'
*/
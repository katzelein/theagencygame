const {expect} = require('chai');

const {getChallenge, chooseMission} = require('./chooser')
const db = require('../models/index')
const User = require('../models/user')
const Mission = require('../models/mission');
const Challenge = require('../models/challenge');

const {whichMessage, checkTags} = require('./whichMessage');

describe('Game Logic', () => {

	// let newUser;

	// beforeEach ('create User', () => {
	// 	newUser = {
	// 		phoneNumber : '+5556667777'
	// 	}
	// })
	
	describe('state: FETCH_CHALLENGE',() => {
		describe('preceding message: [Do you accept this mission?, Are you ready for your next challenge?]', () => {

			let missionId, challengeId, firstChallenge, secondChallenge, newUser;
			
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
					type: "text",
					order: 1,
					hasNext: true
				})
				const newChallenge2 = Challenge.create({
					objective: "Run the program",
					summary: "npm start",
					targetText: "started",
					type: "text",
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

			beforeEach('create user', () => {
				newUser = {
					messageState: 'FETCH_CHALLENGE',
					currentMission: missionId
				}
			})

			it('should return a promise', () => {
				let ch = whichMessage.FETCH_CHALLENGE(missionId, null, 'yes');
				// console.log(ch)
				expect(ch.constructor.name).to.be.equal('Promise')
			})

			it('returns a promise that resolves to a state object', () => {
				return whichMessage.FETCH_CHALLENGE(missionId, null, 'yes')
				.then(result => {
					let keys = Object.keys(result);
					expect(keys.length).to.be.equal(2);
					expect(result.state)
				})
			})

			it('should fetch first challenge', () => {
				return whichMessage.FETCH_CHALLENGE(missionId, null, 'yes')
				.then(result => {
					challengeId = result.state.currentChallenge
					expect(result.state.currentChallenge).to.be.equal(firstChallenge.id);
				})
			})

			it('should fetch second challenge', () => {
				return whichMessage.FETCH_CHALLENGE(missionId, challengeId, 'yes')
				.then(result => {
					challengeId = result.state.currentChallenge
					expect(result.state.currentChallenge).to.be.equal(secondChallenge.id);
				})
			})

			it ('should reset mission and challenge if there are no more challenges', () => {
				return whichMessage.FETCH_CHALLENGE(missionId, challengeId)
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
			let textChallenge, imageChallenge, nightwishMission;


			before('create challenges', () => {
				let zeroth = Mission.create({
					title: 'Shudder Before the Beautiful',
					description: 'Floor Jansen',
					place: 'Nightwish',
					numChallenges: 2
				})
				let first = Challenge.create({
					objective: 'The music of this awe',
					summary: 'Deep silence between the notes',
					targetText: 'Deafens me with endless love',
					type: 'text',
					conclusion: 'This vagrant island earth',
					order: 1,
					hasNext: true
				})

				let second = Challenge.create({
					object: 'This pilgrim shining bright',
					summary: 'We are shuddering',
					targetTags: ['gha_logo'],
					type: 'image',
					conclusion: 'Before the beautiful',
					order: 2,
					hasNext: false
				})

				return Promise.all([zeroth, first, second])
				.then((promiseAnswers) => {
					nightwishMission = promiseAnswers[0];
					textChallenge = promiseAnswers[1];
					imageChallenge = promiseAnswers[2];
					// console.log(promiseAnswers)
				})

				// return Promise.resolve(createAll)
			})

			describe('text input:', () => {
				it('should return conclusion if text is correct', () => {
					let message = {body: 'Deafens me with endless love'}
					return whichMessage.CHALLENGE_ANSWER(textChallenge.id, message)
					.then(result => {
						let resultConclusion = result.message.slice(0,25);
						// console.log(resultConclusion);
						expect(resultConclusion).to.be.equal(textChallenge.conclusion)
					})
				})

				it('should return error message if text is incorrect', () => {
					let message = {body: 'Nemo my name forevermore'}
					return whichMessage.CHALLENGE_ANSWER(textChallenge.id, message)
					.then(result => {
						let resultConclusion = result.message.slice();
						// console.log(resultConclusion);
						expect(resultConclusion).to.be.equal("Your answer doesn't quite match ....")
					})
				})
			})

			describe ('image input:', () => {
				it('should return conclusion if image is correct', () => {
					let message = {
						MediaUrl0: 'https://api.twilio.com/2010-04-01/Accounts/ACc41e6487bcf3da0f8bdde627b28740d2/Messages/MM28717150f4aa31afbfceb4d7e15af8e0/Media/MEf55921bbfc74d012ca5ecc11a472493d',
						MediaContentType0: 'image/jpeg', // gha logo
					}

					return whichMessage.CHALLENGE_ANSWER(imageChallenge.id, message)
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
					
					return whichMessage.CHALLENGE_ANSWER(imageChallenge.id, message)
					.then(result => {
						let resultConclusion = result.message.slice();
						// console.log(resultConclusion);
						expect(resultConclusion).to.be.equal("Your answer doesn't quite match ....")
					})
				})
			})
		})
	})

	describe('helper functions:', () => {
		describe('checkTags', () => {
			xit('returns false if inputs are not arrays', () => {

			})

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

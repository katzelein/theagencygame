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
					console.log(result)
					expect(result.state.messageState).to.be.equal('STANDBY')
					expect(result.state.currentMission).to.be.equal(0)
					expect(result.state.currentChallenge).to.be.equal(0)
				})
			})
		})
	})

	describe('state: CHALLENGE_ANSWER',() => {
		xdescribe('preceding message: [<Challenge text> Send back a photo, Send back a text, make a voice call]', () => {
			let missionId, challengeId;

			before('create mission and challenges', () => {
			})

			it('should fetch first challenge', () => {
			})

			it('should fetch next challenge', () => {
			})

			it ('should return null if there are no more challenges', () => {
			})
		})
	})

	describe('helper functions:', () => {
		describe('checkTags', () => {
			it('returns false if inputs are not arrays', () => {

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


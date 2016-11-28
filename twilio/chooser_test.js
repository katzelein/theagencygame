const {expect} = require('chai');

const {getChallenge, chooseMission} = require('./chooser')
const db = require('../models/index')
const Mission = require('../models/mission');
const Challenge = require('../models/challenge');

describe('Selecting a mission / challenge', () => {
	let missionId, challengeId;

	before ('create mission and challenges', () => {
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
		// const newChallenge3 = Challenge.create({
		// 	objective: "Publish your program",
		// 	summary: "post on github",
		// 	targetText: "posted",
		// 	type: "text",
		// 	order: 3,
		// 	hasNext: false
		// })
		return Promise.all([
			newMission,
			newChallenge1,
			newChallenge2
		])
		.then(promiseList => {
			let mission = promiseList[0];
			let challenge1 = promiseList[1];
			let challenge2 = promiseList[2];
			missionId = mission.id;
			return mission.setChallenges([challenge1,challenge2])
		})
	})
	
	describe('getChallenge', () => {
		it('should fetch first challenge', () => {

			let ch = getChallenge(missionId);

			return ch
			.then(result => {
				challengeId = result.id

				expect(result.order).to.be.equal(1);
			})
		})

		it('should fetch next challenge', () => {

			let ch = getChallenge(missionId, challengeId);

			return ch
			.then(result => {
				challengeId = result.id

				expect(result.order).to.be.equal(2);
			})
		})

		it ('should return null if there are no more challenges', () => {

			let ch = getChallenge(missionId, challengeId);

			return ch
			.then(result => {
				expect(result).to.be.null
			})
		})
	})

	xdescribe('chooseMission', () => {
		it ('should choose mission based on location', () => {
			let m = chooseMission(/*coordinates of mission*/)

			return m
			.then(result => {
				expect(result.id).to.be.equal(missionId)
			})
		})

		it ('should choose closest mission, if coordinates do not match', () => {
			let m;

			return Mission.create({
				title: 'Mission far away',
				description: 'mission that should not be chosen',
				location: /*coordinates far away*/ null,
				place: 'far far away',
				numChallenges: 0
			})
			.then(newM => {
				m = newM;
				return chooseMission(/*coordinates closer to missionId than m*/)
			})
			.then(result => {
				expect(result.id).to.not.be.equal(m.id)
			})
		})

		it ('should choose mission within 5 miles', () => {
			return chooseMission(/*coordinates within 5 miles of missionId*/)
			.then(result => {
				expect(result.id).to.be.equal(missionId)
			})
		})

		it ('should be able to choose mission based on labelled place', () => {
			return chooseMission(null, 'here')
			.then(result => {
				expect(result.id).to.be.equal(missionId);
			})
		})
	})
}) 


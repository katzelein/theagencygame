const {getChallenge, chooseMission} = require('./chooser')
const db = require('../models/index')
const Mission = require('../models/mission');
const Challenge = require('../models/challenge');

const {expect} = require('chai');

describe('Selecting a mission / challenge', () => {
	let missionId, challengeId;

	before ('create mission and challenges', () => {
		const newMission = Mission.create({
			title: "MISSION TITLE",
			description: "Your mission, should you choose to accept it, is to get this program working.",
			location: "here",
			numChallenges: 3
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
		const newChallenge3 = Challenge.create({
			objective: "Publish your program",
			summary: "post on github",
			targetText: "posted",
			type: "text",
			order: 3,
			hasNext: false
		})
		return Promise.all([
			newMission,
			newChallenge1,
			newChallenge2
		])
		.then(promiseList => {
			mission = promiseList[0];
			challenge1 = promiseList[1];
			challenge2 = promiseList[2];
			missionId = mission.id;
			return mission.setChallenges([challenge1,challenge2])
		})
	})
	
	describe('getChallenge', () => {
		it('should fetch first challenge', () => {
			// Mission.findById(missionId)
			// .then(mission =>{
			// 	console.log(mission);
			// })

			let ch = getChallenge(missionId);
			console.log(ch);

			return ch
			.then(result => {
				console.log(result);
				challengeId = result.id
			})
		})

		it('should fetch next challenge', () => {
			// Mission.findById(missionId)
			// .then(mission =>{
			// 	console.log(mission);
			// })

			let ch = getChallenge(missionId, challengeId);
			console.log(ch);

			return ch
			.then(result => {
				console.log(result);
				challengeId = result.id
			})
		})
	})
}) 

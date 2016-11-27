'use strict'

const Mission = require('../models/mission');
const Challenge = require('../models/challenge');

const chooseMission = (lat, long) => {
	// filter all missions based on location
	// randomly choose a mission

	return Mission.findOne({where: {location: 'Grace Hopper'}})
}

// currentMission and currentChallenge extracted from user
const getChallenge = (currentMissionId, currentChallengeId) => {

	// return Challenge.findById(1);

	return Mission.findById(currentMissionId, {include:[Challenge]})
	.then(mission => {
		// console.log(mission);
		let challengeList = mission.challenges;

		let chooseOrder = 1;

		if (currentChallengeId){
			let foundChallenge = -1;
			challengeList.forEach((element, index) => {
				if (element.id == currentChallengeId) foundChallenge = index;
			})
			if (challengeList[foundChallenge].hasNext) {
				chooseOrder = challengeList[foundChallenge].order + 1;
			} else {
				chooseOrder = 0;
			}
		}

		if (!chooseOrder) return null;

		let foundIndex = -1;
		challengeList.forEach((element, index) => {
			if (element.order == chooseOrder) foundIndex = index;
		})

		return challengeList[foundIndex];
	})
}

module.exports = {chooseMission, getChallenge}
'use strict'

const Mission = require('../models/mission');
const Challenge = require('../models/challenge');

const chooseMission = (location, place) => {
	// filter all missions based on location
	// randomly choose a mission


	// can also fetch mission based on labelled place
	// set default to return Grace Hopper mission
	if (!place) place = "Grace Hopper"; 
	return Mission.findOne({where: {place: place}})
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

		if (foundIndex + 1) return challengeList[foundIndex];
		else return null;
	})
}

module.exports = {chooseMission, getChallenge}
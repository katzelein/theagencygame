'use strict'

const Mission = require('../models/mission');
const Challenge = require('../models/challenge');

const chooseMission = (lat, long) => {
	// filter all missions based on location
	// randomly choose a mission

	return Mission.findOne({where: {location: 'Grace Hopper'}})
}

// currentMission and currentChallenge extracted from user
const getChallenge = (currentMission, currentChallenge) => {

	return Challenge.findById(1);

	return Mission.findById(chooseMission, {include})
	.then(mission => {
		return 0
	})
}

module.exports = {chooseMission}
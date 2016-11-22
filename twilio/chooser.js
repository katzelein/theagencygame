'use strict'

const Mission = require('../models/mission');
const Challenge = require('../models/challenge');

const chooseMission = (lat, long) => {
	// filter all missions based on location
	// randomly choose a mission

	return Mission.findOne({where: {location: 'Grace Hopper'}})
}

const getChallenge = (user) => {
	// extract current mission from user info
	// extract current challenge from user infor
	let currentMission = user.currentMission;
	let currentChallenge = user.currentChallenge;

	Mission.findById(chooseMission, {include})
	.then(mission => {

	})
}

module.exports = {chooseMission}
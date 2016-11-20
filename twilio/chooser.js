'use strict'

const Mission = require('../models/mission');
const Challenge = require('../models/challenge');

const chooseMission = (lat, long) => {
	// filter all missions based on location
	// randomly choose a mission

	return Mission.findOne({where: {location: 'Grace Hopper'}})
}

module.exports = {chooseMission}
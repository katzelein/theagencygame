'use strict'

const Sequelize = require('sequelize')
const db = require('./_db')

const Mission = db.define('missions', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  place: Sequelize.STRING,
  missionLocation: {
  	type: Sequelize.GEOGRAPHY
  },
  numChallenges: {
  	type: Sequelize.INTEGER,
  	defaultValue: 0
	}
}
)

module.exports = Mission





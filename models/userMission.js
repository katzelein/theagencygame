'use strict'

const Sequelize = require('sequelize')
const db = require('./_db')

const UserMissions = db.define('userMissions', {
	status: {
		type: Sequelize.ENUM('complete', 'incomplete'),
		defaultValue: 'incomplete'
	},
  	partnerId: Sequelize.INTEGER
})

module.exports = UserMissions

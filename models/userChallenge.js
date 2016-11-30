'use strict'

const Sequelize = require('sequelize')
const db = require('./_db')

const UserChallenges = db.define('userChallenges', {
  status: {
  	type: Sequelize.ENUM('complete', 'incomplete'),
  	defaultValue: 'incomplete'
  }
})

module.exports = UserChallenges

'use strict'

const Sequelize = require('sequelize')
const db = require('./_db')

const UserChallenges = db.define('userChallenges', {
  status: Sequelize.ENUM('complete', 'incomplete')
})

module.exports = UserChallenges

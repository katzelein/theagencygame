'use strict'

const Sequelize = require('sequelize')
const db = require('./_db')

const MissionChallenges = db.define('missionChallenges', {
  theme: Sequelize.STRING
})

module.exports = MissionChallenges

'use strict'

const Sequelize = require('sequelize')
const db = require('./_db')

const UserMissions = db.define('userMissions', {
  status: Sequelize.ENUM('complete', 'incomplete')
})

module.exports = UserMissions

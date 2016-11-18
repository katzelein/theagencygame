'use strict'

const Sequelize = require('sequelize')
const db = require('./_db')

const User = db.define('users', {
  name: Sequelize.STRING,
  phoneNumber: Sequelize.STRING, 
  status: Sequelize.ENUM('active', 'hiatus', 'retired'),
  currentMission: Sequelize.INTEGER,
  currentChallenge: Sequelize.INTEGER
})

module.exports = User

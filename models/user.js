'use strict'

const Sequelize = require('sequelize')
const db = require('./_db')

const User = db.define('users', {
  username: Sequelize.STRING,
  phoneNumber: Sequelize.STRING, 
  status: Sequelize.ENUM('active', 'hiatus', 'retired'),
  currentMission: Sequelize.INTEGER,	
  currentChallenge: Sequelize.INTEGER,
  messageState: {
  	type: Sequelize.STRING,
  	defaultValue: 'STANDBY'
  },
  latitude: {
  	type: Sequelize.FLOAT,
  	defaultValue: 0
  },
  longitude: {
  	type: Sequelize.FLOAT,
  	defaultValue: 0
  }
})

module.exports = User



// req.body.from = User's phone number
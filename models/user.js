'use strict'

const Sequelize = require('sequelize')
const db = require('./_db')



const User = db.define('users', {
  username: Sequelize.STRING,
  phoneNumber: Sequelize.STRING, 
  status: Sequelize.ENUM('active', 'hiatus', 'retired'),
  currentMission: Sequelize.INTEGER,	
  currentChallenge: Sequelize.INTEGER,
  isAdmin: Sequelize.BOOLEAN,
  messageState: {
  	type: Sequelize.STRING,
  	defaultValue: 'STANDBY'
  },
  location: {
  	type: Sequelize.GEOMETRY
  },
  lastMessageAt: Sequelize.DATE
})

module.exports = User



// req.body.from = User's phone number
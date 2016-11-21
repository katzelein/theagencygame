'use strict'

const Sequelize = require('sequelize')
const db = require('./_db')

const User = db.define('users', {
  username: Sequelize.STRING,
  phoneNumber: Sequelize.STRING, 
  status: Sequelize.ENUM('active', 'hiatus', 'retired'),
  currentMission: Sequelize.INTEGER,	
  currentChallenge: Sequelize.INTEGER,
  messageState: Sequelize.STRING,
  latitude: Sequelize.FLOAT,
  longitude: Sequelize.FLOAT

})

module.exports = User



// req.body.from = User's phone number
'use strict'

const Sequelize = require('sequelize')
const db = require('./_db')



const User = db.define('users', {
  username: Sequelize.STRING,
  phoneNumber: Sequelize.STRING, 
  status: Sequelize.ENUM('standby', 'ready', 'active_solo', 'active_pair', 'retired'),
    /*
     * standby: between missions
     * ready: waiting for a partner
     * active_solo: on a mission alone
     * active_pair: on a mission with a partner
     * retired: user has permanently quit
     */
  currentMission: Sequelize.INTEGER,	
  currentChallenge: Sequelize.INTEGER,
  isAdmin: Sequelize.BOOLEAN,
  messageState: {
  	type: Sequelize.STRING,
  	defaultValue: 'STANDBY'
  },
  prevState: Sequelize.STRING,
  location: {
  	type: Sequelize.GEOGRAPHY
  },
  lastMessageTo: Sequelize.DATE, 
  lastMessageFrom: Sequelize.DATE,
  readyAt: Sequelize.DATE
})

module.exports = User



// req.body.from = User's phone number
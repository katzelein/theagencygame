'use strict'

const Sequelize = require('sequelize')
const db = require('./_db')



const User = db.define('users', {
  username: Sequelize.STRING,
  phoneNumber: Sequelize.STRING, 
  status: Sequelize.ENUM('standby', 'ready', 'active', 'retired'),
    /*
     * standy: between missions
     * ready: waiting for a partner
     * active: on a mission
     * retired: user has permanently quit
     *    maybe have a separate status 'partnered' for being on a mission with a partner????
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
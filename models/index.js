'use strict'

var db = require('./_db');

const User = require('./user')
const Mission = require('./mission')
const Challenge = require('./challenge')

User.belongsToMany(Mission, {through: 'UserMissions'})
Mission.belongsToMany(User, {through: 'UserMissions'})
User.belongsToMany(Challenge, {through: 'UserChallenges'})
Challenge.belongsToMany(User, {through: 'UserChallenges'})
Mission.belongsToMany(Challenge, {through: 'MissionChallenges'})
Challenge.belongsToMany(Mission, {through: 'MissionChallenges'})

module.exports = db;

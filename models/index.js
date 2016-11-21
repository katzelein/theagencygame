'use strict'

var db = require('./_db');

const User = require('./user')
const Mission = require('./mission')
const Challenge = require('./challenge')
const Message = require('./message')
const MissionChallenges = require('./missionChallenge')
const UserMissions = require('./userMission')
const UserChallenges = require('./userChallenge')
const UserMessages = require('./userMessage')


User.belongsToMany(Mission, {through: UserMissions})
Mission.belongsToMany(User, {through: UserMissions})
User.belongsToMany(Challenge, {through: UserChallenges})
Challenge.belongsToMany(User, {through: UserChallenges})
Mission.belongsToMany(Challenge, {through: MissionChallenges})
Challenge.belongsToMany(Mission, {through: MissionChallenges})
User.belongsToMany(Message, {through: UserMessages})


module.exports = db;

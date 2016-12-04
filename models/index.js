'use strict'
const appEnv = typeof global.it === 'function'
var db = require('./_db');
var name = appEnv ? "theagencytest" : "theagency"

const User = require('./user')
const Mission = require('./mission')
const Challenge = require('./challenge')
const UserMissions = require('./userMission')
const UserChallenges = require('./userChallenge')


User.belongsToMany(Mission, {through: UserMissions})
Mission.belongsToMany(User, {through: UserMissions})
User.belongsToMany(Challenge, {through: UserChallenges})
Challenge.belongsToMany(User, {through: UserChallenges})
Mission.hasMany(Challenge)
Challenge.belongsTo(Mission)
UserMissions.belongsTo(Mission)
UserMissions.belongsTo(User)
User.hasMany(UserMissions)

// sync the db, creating it if necessary
function sync(force = appEnv) {
  return db.sync({})
   .then(ok => console.log(`Synced models to db ${name}`))
}

db.didSync = sync();

module.exports = db;

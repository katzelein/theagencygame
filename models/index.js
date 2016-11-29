'use strict'
const appEnv = typeof global.it === 'function'
var db = require('./_db');
var name = appEnv ? "theagencytest" : "agencytest"

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
// Mission.hasMany(Challenge, {foreignKey: challenge_id})
// Challenge.belongsToMany(Mission, {through: MissionChallenges})
Challenge.belongsTo(Mission)

// sync the db, creating it if necessary
function sync(force=appEnv) { //appEnv
  return db.sync({force: false})
   .then(ok => console.log(`Synced models to db ${name}`))
}

db.didSync = sync()
// if (appEnv) { //appEnv
// 	console.log("SEED isTesting")
//   db.didSeed = require('./seed')(false)
// }
module.exports = db;

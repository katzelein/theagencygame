// const db = require('./_db')

// const seedUsers = () => db.Promise.map([
//   { username: 'secretagentman', phoneNumber: '+5555555555' }, { username: 'hotguy', phoneNumber: '+5555555556'},
//   { username: 'blackwidow', phoneNumber: '+5555555557'},
//   { username: 'philcoulson', phoneNumber: '+5555555558'}
// ], user => db.model('users').create(user))

// const seedMissions = () => db.Promise.map([
//   { title: 'Intrigue on Wall Street', description: 'One of our agents disappeared somewhere into the depths of the Trump Building on Wall Street. We need you to investigate his disappearance, which may be ever more dire with the upcoming inauguration.'},
//   { title: 'The Dark Underbelly of Broadway\'s Bright Lights', description: 'Agent Natasha Klimikov was a rising star in the 1950s during Rodgers and Hammerstein\'s golden age. You\'ll be heading towards 42nd Street to retrace Natasha\'s steps and to see if her mission remains active.'}
// ], mission => db.model('missions').create(mission))

// const seedChallenges = () => db.Promise.map([
//   { objective: 'Head to the Trump Building', summary: 'We need photographic evidence of the specific street address assigned to this building. We believe that the etchings on the gold may somehow contain his fingerprints. When found, send photograph to this number. Show no others', conclusion: 'Great work. The fingerprints are being to the lab for analysis. In the meantime, we have another task for you.' }, { objective: objective: 'Origins of the Open Market', summary: 'According to our surveillance, agent SoAndSo bought an omelette with spinach and broccoli every morning at the Open Market. Head to the store and talk to Vinnie, the guy behind the omelette counter. Give him the passcode and, if he deems you trustworthy, send us his return passcode.', targetText: 'What are you talking about', conclusion: 'Vinnie may be connected to the mob. He trusted you with the right passcode, so our way deeper into the depths may be open. Please await your next mission.'}
// ], challenge => db.model('challenges').create(challenge))


// const seedUserMissions = () => db.Promise.map([
//   {},
// ], userMission => db.model('userMissions').create(userMission))

// const seedUserChallenges = () => db.Promise.map([
//   {},
// ], userChallenge => db.model('userChallenges').create(userChallenge))

// const seedMissionChallenges = () => db.Promise.map([
//   {}
// ], missionChallenges => db.model('missionChallenges').create(missionsChallenge))

// db.didSync
//   .then(() => db.sync({force: true}))
//   .then(seedUsers)
//   .then(users => console.log(`Seeded ${users.length} users OK`))
//   .then(seedMissions)
//   .then(missions => console.log(`Seeded ${missions.length} missions OK`))
//   .then(seedChallenges)
//   .then(challenges => console.log(`Seeded ${challenges.length} challenges OK`))
//   .then(seedUserMissions)
//   .then(userMissions => console.log(`Seeded ${userMissions.length} userMissions OK`))
//   .then(seedUserChallenges)
//   .then(userChallenges => console.log(`Seeded ${userChallenges.length} userChallenges OK`))
//   .then(seedMissionChallenges)
//   .then(missionChallenges => console.log(`Seeded ${missionChallenges.length} missionChallenges OK`))
//   .catch(error => console.error(error))
//   .finally(() => db.close())

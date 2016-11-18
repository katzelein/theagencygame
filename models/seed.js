const db = require('./_db')
const Promise = require('bluebird');
const User = require('./user')
const Challenge = require('./challenge')
const Mission = require('./mission')
const MissionChallenge = require('./missionChallenge')
const UserMission = require('./userMission')
const UserChallenge = require('./userChallenge')


const data = {
  user: [
    { username: 'secretagentman', 
      phoneNumber: '+5555555555' }, 
    { username: 'hawkeye', 
      phoneNumber: '+5555555556'},
    { username: 'blackwidow', 
      phoneNumber: '+5555555557'},
    { username: 'philcoulson', 
      phoneNumber: '+5555555558'}
  ], 
  mission: [
    { title: 'Intrigue on Wall Street', 
    description: 'One of our agents disappeared somewhere into the depths of the Trump Building on Wall Street. We need you to investigate his disappearance, which may be ever more dire with the upcoming inauguration.'},
    { title: 'The Dark Underbelly of Broadway\'s Bright Lights', 
      description: 'Agent Natasha Klimikov was a rising star in the 1950s during Rodgers and Hammerstein\'s golden age. You\'ll be heading towards 42nd Street to retrace Natasha\'s steps and to see if her mission remains active.'},
    { title: 'Grace Hopper and the Missing Dog', 
      description: 'Ben, one of Grace Hopper Academy\'s proudest members, has had his favorite bone stolen out from under his nose. Can you identify the thief?'}
  ],
  challenge: [
    { objective: 'Head to the Trump Building', 
    summary: 'We need photographic evidence of the specific street address assigned to this building. We believe that the etchings on the gold may somehow contain his fingerprints. When found, send photograph to this number. Show no others', 
    conclusion: 'Great work. The fingerprints are being to the lab for analysis. In the meantime, we have another task for you.' }, 
    { objective: 'Origins of the Open Market', 
      summary: 'According to our surveillance, agent SoAndSo bought an omelette with spinach and broccoli every morning at the Open Market. Head to the store and talk to Vinnie, the guy behind the omelette counter. Give him the passcode and, if he deems you trustworthy, send us his return passcode.', targetText: 'What are you talking about', 
      conclusion: 'Vinnie may be connected to the mob. He trusted you with the right passcode, so our way deeper into the depths may be open. Please await your next mission.'}, 
    { objective: 'Find Ceren', 
      summary: 'Ceren, Ben\'s doting mom who, in an incredible feat of strength and love, pulled him from the grips of an oncoming subway just a few weeks ago, spends her days in the CSS room. Head to the office and take a picture of her sign; we need photographic evidence for a warrant to dust the sign for fingerprints.', 
      conclusion: 'Great work. We\'re picking up the scent of our thief; upcoming instructions to follow.' }, 
    { objective: 'The kitchen awaits', 
      summary: 'Ben loves to wander the hallways of Grace Hopper, finding the occasional student eager to scratch his belly, or scooping up the remains of a forgotten blueberry muffin. On the day of the theft, Ben was seen more than usual around the kitchen yesterday during an incoming shipment of cereal; we think this may be where the thief saw their opportunity. Please send the license number for the fire extinguisher on the left by the passcoded door. We believe the thief may use this as the passcode for their own office.', 
      conclusion: 'You\'re on the mark, shouldn\'t be long now. Await further instructions'}, 
    { objective: 'Finding the teacher', 
      summary: 'We have a list of all the offices linked to the passcode you found, and one of the teachers of Grace Hopper and Fullstack Academy, Ashi Krishnan, spent the day in the office implicated during the theft of Ben\'s bone. Find Ashi and find out the name of her childhood dog. Then send us a voice snippet of the name; the information is too dangerous to be hardcoded.', 
      conclusion: 'Ashi may not be the thief, but our progress has been strong. Well done, agent. The future looks bright.'}
  ],
  missionChallenge: [
    {missionId: 1, challengeId: 1}, 
    {missionId: 1, challengeId: 2}, 
    {missionId: 3, challengeId: 3}, 
    {missionId: 3, challengeId: 4}, 
    {missionId: 3, challengeId: 5},
  ],
  userMission: [
    {userId: 1, missionId: 1}, 
    {userId: 2, missionId: 2}, 
    {userId: 2, missionId: 3}, 
    {userId: 3, missionId: 1}
  ],
  userChallenge: [
    {userId: 1, challengeId: 1}, 
    {userId: 1, challengeId: 2},
    {userId: 2, challengeId: 3},
    {userId: 2, challengeId: 4}, 
    {userId: 2, challengeId: 5}
  ]
};

db.sync({force: true})
.then(() =>
  User.bulkCreate(data.user))
  .then(users => console.log(`Seeded ${users.length} users OK`))
.then(() => 
  Mission.bulkCreate(data.mission))
  .then(missions => console.log(`Seeded ${missions.length} missions OK`))
.then(() => 
  Challenge.bulkCreate(data.challenge))
  .then(missions => console.log(`Seeded ${missions.length} challenges OK`))
.then(() => 
  MissionChallenge.bulkCreate(data.missionChallenge))
  .then(missionChallenges => console.log(`Seeded ${missionChallenges.length} missionChallenges OK`))
.then(() => 
  UserMission.bulkCreate(data.userMission))
  .then(userMissions => console.log(`Seeded ${userMissions.length} userMissions OK`))
.then(() => 
  UserChallenge.bulkCreate(data.userChallenge))
  .then(userChallenges => console.log(`Seeded ${userChallenges.length} userChallenges OK`))



//   .then(seedMissions)
//   .then(missions => console.log(`Seeded ${missions.length} missions OK`))
//   .then(seedChallenges)
//   .then(challenges => console.log(`Seeded ${challenges.length} challenges OK`))
//   .then(seedMissionChallenges)
//   .then(missionChallenges => console.log(`Seeded ${missionChallenges.length} missionChallenges OK`))
//   .then(seedUserMissions)
//   .then(userMissions => console.log(`Seeded ${userMissions.length} userMissions OK`))
//   .then(seedUserChallenges)
//   .then(userChallenges => console.log(`Seeded ${userChallenges.length} userChallenges OK`))
//   .catch(error => console.error(error))
//   .finally(() => db.close())

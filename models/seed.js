const Promise = require('bluebird');


const data = {
  user: [
    { username: 'secretagentman',
      phoneNumber: '+5555555555' },
    { username: 'hawkeye',
      phoneNumber: '+5555555556'},
    { username: 'blackwidow',
      phoneNumber: '+5555555557'},
    { username: 'philcoulson', 
      phoneNumber: '+5555555558',
      location: {type: 'Point', coordinates: [0, 0]}},
    { username: 'operagirl',
      phoneNumber: '+18607485586', 
      isAdmin: true},
    { username: 'Gator',
      phoneNumber: '+19146469702',
      isAdmin: true, 
    },
    { username: 'Karin',
      phoneNumber: '+19739975239',
      isAdmin: true,
      status: 'ready',
      location: {type: 'Point', coordinates: [40.705691, -74.009342]}
    }
  ],

  mission: [
    { title: 'Intrigue on Wall Street',  // mission 1
      description: 'One of our agents disappeared somewhere into the depths of the Trump Building on Wall Street. We need you to investigate his disappearance, which may be ever more dire with the upcoming inauguration.'},
    { title: 'The Dark Underbelly of Broadway\'s Bright Lights', // mission 2
      description: 'Agent Natasha Klimikov was a rising star in the 1950s during Rodgers and Hammerstein\'s golden age. You\'ll be heading towards 42nd Street to retrace Natasha\'s steps and to see if her mission remains active.'},
    { title: 'Grace Hopper and the Missing Bone', // mission 3
      description: 'Ben, one of Grace Hopper Academy\'s proudest members, has had his favorite bone stolen out from under his nose. Can you identify the thief?',
      place: 'Grace Hopper',
      meetingPlace: '5 Hanover Square by the elevators on the 11th floor',
      numChallenges: 5
    }
  ],

  challenge: [
    { objective: 'Head to the Trump Building', // mission 1
      summary: 'We need photographic evidence of the specific street address assigned to this building. We believe that the etchings on the gold may somehow contain his fingerprints. When found, send photograph to this number. Show no others.',
      conclusion: 'Great work. The fingerprints are being to the lab for analysis. In the meantime, we have another task for you.',
    },
    { objective: 'Dine with the Finest', // mission 1
      summary: 'Cipriani on Wall St is as classy as it gets. Go to the restaurant and find out what the special of the day is.',
      conclusion: 'That does sound special. Might as well treat yourself to some grub while you are there'
    },
    { objective: 'Origins of the Open Market', // mission 1
      summary: 'According to our surveillance, agent SoAndSo bought an omelette with spinach and broccoli every morning at the Open Market. Head to the store and talk to Vinnie, the guy behind the omelette counter. Give him the passcode and, if he deems you trustworthy, send us his return passcode.', targetText: 'What are you talking about', 
      category: 'voice',
      conclusion: 'Vinnie may be connected to the mob. He trusted you with the right passcode, so our way deeper into the depths may be open. Please await your next mission.',
    },

    { objective: 'Find GHA\'s Newest Hero, Ceren', // mission 3
      summary: 'Ceren, Ben\'s doting mom who, in an incredible feat of strength and love, pulled him from the grips of an oncoming subway just a few weeks ago, spends her days in the CSS room. Find her office where Ben\'s orange water bowl sits and send us a picture; we need a warrant to dust the bowl for fingerprints.',
      category: 'image',
      targetTags: ['bowl'],
      conclusion: 'Great work. We\'re picking up the scent of our thief; upcoming instructions to follow.' ,
      order: 1,
      hasNext: true
    },
    { objective: 'Putting Out Kitchen Fires', // mission 3
      summary: 'Ben loves to wander the hallways of Grace Hopper, finding the occasional student eager to scratch his belly, or scooping up the remains of a forgotten blueberry muffin. On the day of the theft, Ben was seen more than usual around the kitchen yesterday during an incoming shipment of cereal; we think this may be where the thief saw their opportunity. Please send the license number for the fire extinguisher on the left by the passcoded door. We believe the thief may use this as the passcode for their own office.',
      // category: 'text',
      // targetText: 'something',
      conclusion: 'You\'re on the mark, shouldn\'t be long now. Await further instructions',
      order: 2,
      hasNext: true
    },
    { objective: 'Tracking the Teacher', // mission 3
      summary: 'We have a list of all the offices linked to the passcode you found, and one of the teachers of Grace Hopper and Fullstack Academy, Ashi Krishnan, spent the day in the office implicated during the theft of Ben\'s bone. Find Ashi and find out the name of her childhood dog -- but do it covertly. She can\'t know that she\'s a suspect. Then call this number, speak the name of the dog when prompted, and quickly hang up. Secrecy is key.',
      category: 'voice',
      targetText: 'gorp',
      conclusion: 'Ashi may not be the thief, but our progress has been strong. Well done, agent. The future looks bright.',
      order: 3,
      hasNext: true
    }, // imaginary friend-monster: gorp
    { objective: 'Grace Hopper Academy\'s Secret Storage', // mission 3
      summary: 'We think that the thief may have an even bigger profile at the school than we thought possible. The corruption runs deep. The thief may have been so smart as to code a clue into the Grace Hopper logo in plain sight. Head to the lobby of the school and send us a picture of the logo.',
      category: 'image',
      targetTags: ['gha_logo'],
      conclusion: 'Our intel was correct; the logo contained vital information. One last step and we should be able to catch the thief red-handed.',
      order: 4,
      hasNext: true
    },
    { objective: 'The Voice of Ultimate Betrayal', // mission 3
      summary: "This is where the rubber meets the road, agent. You will need to be your most stealthy. Find David Yang; he is never far away. We believe his taste in cereal could confirm whether or not he was interested in Ben's bone. Find out which cereal he is most excited to see in the Grace Hopper kitchen, and text it to us.",
      category: 'text',
      targetText: 'fruity pebbles',
      conclusion: 'We have a match. David Yang is the thief of the missing bone. It is a dark day for Grace Hopper, but a proud day for the Agency. Well done, agent. Your country, and Ben, thanks you.',
      order:5
    }
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
    {userId: 2, challengeId: 1},
    {userId: 2, challengeId: 2},
    {userId: 2, challengeId: 3},
    {userId: 2, challengeId: 4},
    {userId: 2, challengeId: 5},
    {userId: 2, challengeId: 6},
    {userId: 2, challengeId: 7}
  ],

  challengeMission: missions => {
    return {
      'Head to the Trump Building': missions['Intrigue on Wall Street'],
      'Dine with the Finest': missions['Intrigue on Wall Street'],
      'Origins of the Open Market': missions['Intrigue on Wall Street'],
      'Find GHA\'s Newest Hero, Ceren': missions['Grace Hopper and the Missing Bone'],
      'Putting Out Kitchen Fires': missions['Grace Hopper and the Missing Bone'],
      'Tracking the Teacher': missions['Grace Hopper and the Missing Bone'],
      'Grace Hopper Academy\'s Secret Storage': missions['Grace Hopper and the Missing Bone'],
      'The Voice of Ultimate Betrayal': missions['Grace Hopper and the Missing Bone']
    }
  }

};

const seed = (db) => {
let bool;
if(db){
    console.log("IF DB")
    bool = true;
}
else{
  console.log("IF NOT DB")
  bool = false;
}
if(bool){
console.log("DB PROVIDED")
const User = db.models.users
const Challenge = db.models.challenges
const Mission = db.models.missions
const UserMission = db.models.userMissions
const UserChallenge = db.models.userChallenges
  db.sync()
.then(() => {
  const users = User.bulkCreate(data.user)
    .then(users => {
      console.log(`Seeded ${users.length} users OK`)
    })
  const missions = Mission.bulkCreate(data.mission)
    .then(missions => {
      console.log(`Seeded ${missions.length} missions OK`)
    })

  const challenges = Challenge.bulkCreate(data.challenge)
    .then(challenges => {
      console.log(`Seeded ${challenges.length} challenges OK`)
    })

  return Promise.all([missions, challenges, users])
})
.then(() => {
  const users = User.findAll()
  .then(users =>  {
    return users.reduce((allUsers, user) =>
      Object.assign({}, allUsers, {[user.phoneNumber]: user}), {})
  })

  const challenges = Challenge.findAll()
  .then(challenges => {
    return challenges.reduce(
    (allChallenges, challenge) =>
      Object.assign({}, allChallenges, {[challenge.objective]: challenge}),
        {})
  })

  const missions = Mission.findAll()
  .then(missions => {
    return missions.reduce(
      (allMissions, mission) =>
        Object.assign({}, allMissions, {[mission.title]: mission}),
          {})
  })
  return Promise.all([challenges, missions, users])
})
.then(([challenges, missions, users]) => {
    User.findOne({
      where: {
        username: 'operagirl'
    }})
    .then(user => {
      return user.update({
        currentMission: 3,
        currentChallenge: 7
      })
    })
    .then(user => {
      return user.addChallenges([4, 5, 6, 7])
      .then(() => {
        user.addMission(3)
      })
    })
    .then(() => {
      return UserChallenge.update({
        status: 'complete'},
        { where: {
          challengeId: {$in: [4,5,6]}
        }}
        )
    })
    .then(() => {
      let challengeMission = data.challengeMission(missions);
      let challengeKeys = Object.keys(challenges);
      challengeKeys.forEach(key => {
        return challengeMission[key].addChallenge(challenges[key]);
      })
    })
})
}

else{
console.log("IN ELSE SEED")
db = require('./')
//console.log("DATABSE: ", db)
const User = db.models.users
const Challenge = db.models.challenges
const Mission = db.models.missions
const UserMission = db.models.userMissions
const UserChallenge = db.models.userChallenges

return db.sync({force: true})
.then(() => {
  console.log("SYNCED NOW SEEDING")
  const users = User.bulkCreate(data.user)
    .then(users => {
      console.log(`Seeded ${users.length} users OK`)
    })
  const missions = Mission.bulkCreate(data.mission)
    .then(missions => {
      console.log(`Seeded ${missions.length} missions OK`)
    })

  const challenges = Challenge.bulkCreate(data.challenge)
    .then(challenges => {
      console.log(`Seeded ${challenges.length} challenges OK`)
    })

  return Promise.all([missions, challenges, users])
})
.then(() => {
  const users = User.findAll()
  .then(users =>  {
    return users.reduce((allUsers, user) =>
      Object.assign({}, allUsers, {[user.phoneNumber]: user}), {})
  })

  const challenges = Challenge.findAll()
  .then(challenges => {
    return challenges.reduce(
    (allChallenges, challenge) =>
      Object.assign({}, allChallenges, {[challenge.objective]: challenge}),
        {})
  })

  const missions = Mission.findAll()
  .then(missions => {
    return missions.reduce(
      (allMissions, mission) =>
        Object.assign({}, allMissions, {[mission.title]: mission}),
          {})
  })
  return Promise.all([challenges, missions, users])
})
.then(([challenges, missions, users]) => {
    User.findOne({
      where: {
        username: 'operagirl'
    }})
    .then(user => {
      return user.update({
        currentMission: 3,
        currentChallenge: 7
      })
    })
    .then(user => {
      return user.addChallenges([4, 5, 6, 7])
      .then(() => {
        user.addMission(3)
      })
    })
    .then(() => {
      return UserChallenge.update({
        status: 'complete'},
        { where: {
          challengeId: {$in: [4,5,6]}
        }}
        )
    })
    .then(() => {
      let challengeMission = data.challengeMission(missions);
      let challengeKeys = Object.keys(challenges);
      challengeKeys.forEach(key => {
        return challengeMission[key].addChallenge(challenges[key]);
      })
    })
})

}}

if(module === require.main){
  console.log("MANUALLY CALLED SEED")
  const db = require('./')
  seed(db)
}

module.exports = seed;

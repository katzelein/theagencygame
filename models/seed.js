const db = require('./index')

const Promise = require('bluebird');
const User = require('./user')
const Challenge = require('./challenge')
const Mission = require('./mission')
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
      phoneNumber: '+5555555558'},
    { username: 'operagirl',
      phoneNumber: '+18607485586', 
      isAdmin: true},
    { username: 'Gator',
      phoneNumber: '+19146469702',
      isAdmin: true
    },
    { username: 'kittensgalore',
      phoneNumber: '+19196105358',
      isAdmin: true
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
      numChallenges: 5
    }
  ],

  challenge: [
    { objective: 'Head to the Trump Building', // mission 1
      summary: 'We need photographic evidence of the specific street address assigned to this building. We believe that the etchings on the gold may somehow contain his fingerprints. When found, send photograph to this number. Show no others.',
      conclusion: 'Great work. The fingerprints are being to the lab for analysis. In the meantime, we have another task for you.'
    },
    { objective: 'Origins of the Open Market', // mission 1
      summary: 'According to our surveillance, agent SoAndSo bought an omelette with spinach and broccoli every morning at the Open Market. Head to the store and talk to Vinnie, the guy behind the omelette counter. Give him the passcode and, if he deems you trustworthy, send us his return passcode.', targetText: 'What are you talking about', 
      type: 'voice',
      conclusion: 'Vinnie may be connected to the mob. He trusted you with the right passcode, so our way deeper into the depths may be open. Please await your next mission.'
    },

    { objective: 'Find GHA\'s Newest Hero, Ceren', // mission 3
      summary: 'Ceren, Ben\'s doting mom who, in an incredible feat of strength and love, pulled him from the grips of an oncoming subway just a few weeks ago, spends her days in the CSS room. Find her office where Ben\'s orange water bowl sits and send us a picture; we need a warrant to dust the bowl for fingerprints.',
      targetTags: ['bowl'],
      conclusion: 'Great work. We\'re picking up the scent of our thief; upcoming instructions to follow.' ,
      order: 1
    },
    { objective: 'Putting Out Kitchen Fires', // mission 3
      summary: 'Ben loves to wander the hallways of Grace Hopper, finding the occasional student eager to scratch his belly, or scooping up the remains of a forgotten blueberry muffin. On the day of the theft, Ben was seen more than usual around the kitchen yesterday during an incoming shipment of cereal; we think this may be where the thief saw their opportunity. Please send the license number for the fire extinguisher on the left by the passcoded door. We believe the thief may use this as the passcode for their own office.',
      conclusion: 'You\'re on the mark, shouldn\'t be long now. Await further instructions',
      order: 2
    },
    { objective: 'Tracking the Teacher', // mission 3
      summary: 'We have a list of all the offices linked to the passcode you found, and one of the teachers of Grace Hopper and Fullstack Academy, Ashi Krishnan, spent the day in the office implicated during the theft of Ben\'s bone. Find Ashi and find out the name of her childhood dog -- but do it covertly. She can\'t know that she\'s a suspect. Then call this number, speak the name of the dog when prompted, and quickly hang up. Secrecy is key.',
      conclusion: 'Ashi may not be the thief, but our progress has been strong. Well done, agent. The future looks bright.',
      order: 3
    }, // imaginary friend-monster: gorp
    { objective: 'Grace Hopper Academy\'s Secret Storage', // mission 3
      summary: 'We think that the thief may have an even bigger profile at the school than we thought possible. The corruption runs deep. The thief may have been so smart as to code a clue into the Grace Hopper logo in plain sight. Head to the lobby of the school and send us a picture of the logo.',
      targetTags: ['gha_logo'],
      conclusion: 'Our intel was correct; the logo contained vital information. One last step and we should be able to catch the thief red-handed.',
      order: 4
    },
    { objective: 'The Voice of Ultimate Betrayal', // mission 3
      summary: 'This is where the rubber meets the road, agent. You will need to be your most stealthy. Find David Yang; he is never far away. Capture no more than 10 seconds of his voice to confirm his identity. We need to compare your footage to audio surveillance the Agency maintains for our own safety. Be careful.',
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
  ]
};

db.sync({force: true})
.then(() =>
  User.bulkCreate(data.user))
  .then(users => console.log(`Seeded ${users.length} users OK`))
.then(() =>
  Mission.bulkCreate(data.mission))
  .then(missions => {
    console.log(`Seeded ${missions.length} missions OK`)
    return missions[2];
  })
  .then(mission => {
    console.log(mission)
    console.log('setChallenges', mission.setChallenges)
    mission.setChallenges([3,4,5,6,7])
  })
  .then(() =>  
    Challenge.bulkCreate(data.challenge))
    .then(() => Challenge.update({
    missionId: 3
    },{where: {
      order: {
        $between: [1, 6]
      }
    }
  }))
  .then(missions => console.log(`Seeded ${missions.length} challenges OK`))
.then(() =>
  UserMission.bulkCreate(data.userMission))
  .then(userMissions => console.log(`Seeded ${userMissions.length} userMissions OK`))
.then(() =>
  UserChallenge.bulkCreate(data.userChallenge))
  .then(userChallenges => console.log(`Seeded ${userChallenges.length} userChallenges OK`))

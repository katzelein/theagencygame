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
      description: 'One of our agents disappeared somewhere into the depths of the Trump Building on Wall Street. We need you to investigate his disappearance, which may be ever more dire with the upcoming inauguration.',
      place: 'Financial District',
      meetingPlace: 'NW corner of Wall St and Broad St',
      numChallenges: 3,
      location: {type: 'Point', coordinates: [41.705691, -73.009342]}
    },
    { title: 'The Dark Underbelly of Broadway\'s Bright Lights', // mission 2
      description: 'Agent Natasha Klimikov was a rising star in the 1950s during Rodgers and Hammerstein\'s golden age. You\'ll be heading towards 42nd Street to retrace Natasha\'s steps and to see if her mission remains active.',
      place: 'Theater District',
      meetingPlace: 'The Nederlander Theater',
      location: {type: 'Point', coordinates: [40.7556995,-73.9881632]}
    },
    { title: 'Grace Hopper and the Missing Bone', // mission 3
      description: 'Ben, one of Grace Hopper Academy\'s proudest members, has had his favorite bone stolen out from under his nose. Can you identify the thief?',
      place: 'Grace Hopper',
      meetingPlace: '5 Hanover Square by the elevators on the 11th floor',
      numChallenges: 5,
      location: {type: 'Point', coordinates: [40.705691, -74.009342]}
    },
    { title: 'The Case of the Missing Present', // mission 3
      description: 'Oh no! One of your presents has been taken! It should be easy for you to solve this mission. I\'ve heard you are both very smart. You will have to collect some information and solve some clues in order to figure out where the missing present is.',
      place: 'Bronxville',
      meetingPlace: 'By the tree in the middle of Willow Rd',
      numChallenges: 17,
      location: {type: 'Point', coordinates: [40.9396494, -73.8286284]}
    }
  ],

  challenge: [
    { objective: 'Head to the Trump Building', // mission 1
      summary: 'We need photographic evidence of the specific street address assigned to this building. We believe that the etchings on the gold may somehow contain his fingerprints. When found, send photograph to this number. Show no others.',
      conclusion: 'Great work. The fingerprints are being to the lab for analysis. In the meantime, we have another task for you.',
      order: 1,
      hasNext: true
    },
    { objective: 'Dine with the Finest', // mission 1
      summary: 'Cipriani on Wall St is as classy as it gets. Go to the restaurant and find out what the special of the day is.',
      conclusion: 'That does sound special. Might as well treat yourself to some grub while you are there',
      order: 2,
      hasNext: true
    },
    { objective: 'Origins of the Open Market', // mission 1
      summary: 'According to our surveillance, agent SoAndSo bought an omelette with spinach and broccoli every morning at the Open Market. Head to the store and talk to Vinnie, the guy behind the omelette counter. Give him the passcode and, if he deems you trustworthy, send us his return passcode.', targetText: 'What are you talking about', 
      category: 'voice',
      conclusion: 'Vinnie may be connected to the mob. He trusted you with the right passcode, so our way deeper into the depths may be open. Please await your next mission.',
      order: 3
    },

    { objective: 'Find GHA\'s Newest Hero, Ceren', // mission 3
      summary: 'Ceren, Ben\'s doting mom who, in an incredible feat of strength and love, pulled him from the grips of an oncoming subway just a few weeks ago, spends her days in the CSS room. Find her office where Ben\'s orange water bowl sits and send us a picture; we need a warrant to dust the bowl for fingerprints.',
      category: 'image',
      targetTags: ['bowl'],
      conclusion: 'Great work. We\'re picking up the scent of our thief.' ,
      order: 1,
      hasNext: true
    },
    { objective: 'Putting Out Kitchen Fires', // mission 3
      summary: 'Ben loves to wander the hallways of Grace Hopper, finding the occasional student eager to scratch his belly, or scooping up the remains of a forgotten blueberry muffin. On the day of the theft, Ben was seen more than usual around the kitchen yesterday during an incoming shipment of cereal; we think this may be where the thief saw their opportunity. Please send the license number for the fire extinguisher on the left by the passcoded door. We believe the thief may use this as the passcode for their own office.',
      category: 'text',
      targetText: '133w',
      conclusion: 'You\'re on the mark, shouldn\'t be long now.',
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
      targetText: 'count chocula',
      conclusion: 'We have a match. David Yang is the thief of the missing bone. It is a dark day for Grace Hopper, but a proud day for the Agency. Well done, agent. Your country, and Ben, thanks you.',
      order:5
    },
    { objective: 'The Day it Disappeared', // mission 3
      summary: "Ask Aunt Susan when she remembers last seeing the missing present. Maybe that will give us some idea of what happened to it and when! Text us back with the day of the week she saw it last.",
      category: 'text',
      targetText: 'tuesday',
      conclusion: ' ',
      order:1
    },
    { objective: 'Canine Clues', // mission 3
      summary: "Ah! Interesting. She has book club on Tuesday nights. The present must have been taken while she was out that night. Phoebe would have been home then. See if there are any clues on the canine. And send a picture of what you find.",
      category: 'image'
      targetTags: ['key'],
      conclusion: ' ',
      order:2
    },
    { objective: 'Car Color', // mission 3
      summary: "A key! That doesn't look much like the key to a house or lock. Maybe it is a car key! Ask Gwen if she knows what car that key belongs to and text us back with the color of the car.",
      category: 'text',
      targetText: 'blue',
      conclusion: ' ',
      order:3
    },
    { objective: 'Cars Have Homes Too', // mission 3
      summary: "Well, where does the blue car live?",
      category: 'text',
      targetText: 'garage',
      conclusion: ' ',
      order:4
    },
    { objective: 'Open Sesame 1', // mission 3
      summary: "Ok, I guess we have to find the garage opener so we can get inside and figure out why the robber is leading us to the car. Maybe they left something there. The garage opener is usually kept in the goose bowl by the front door. Did you find it?",
      category: 'text',
      targetText: 'no',
      conclusion: ' ',
      order:5
    }
    { objective: 'Fishy Fruit', // mission 3
      summary: "What?! Where could it be? Did you find something else unusual in the goose bowl? Send a picture of what you found.",
      category: 'image',
      targetTags: ['orange'],
      conclusion: ' ',
      order:6
    },
    { objective: 'Find Fruit', // mission 3
      summary: "A clementine? That's odd. Well maybe the garage opener is wherever the clementines usually are. Try to find the other clementines, but ask for help if you need it. Text back 'found it' if you find the garage opener or 'not found' if you don't.",
      category: 'text',
      targetText: 'found it',
      conclusion: ' ',
      order:7
    },
    { objective: 'Open Sesame 2', // mission 3
      summary: "Great! So let's go to the garage and see what\'s there. Send in a picture of what you find.",
      category: 'image',
      targetTags: ['paper'], //what will the image tags be?
      conclusion: ' ',
      order:8
    },
    { objective: 'That is Greek to Me', // mission 3
      summary: "A note! That definitely is not english. I think we are going to need a language specialist to translate this note. I think I know where to find one, but I'll need your help. The language specialist lives at an 2-digit address, but we need to find out what the numbers are. What is 2*4 - 7?",
      category: 'text',
      targetText: '1',
      conclusion: ' ',
      order:9
    },
    { objective: 'Math Madness', // mission 3
      summary: "You are smart! Ok and what is (16 - 10)/ 2?",
      category: 'text',
      targetText: '3',
      conclusion: ' ',
      order:10
    },
    { objective: 'To the Translator', // mission 3
      summary: " Man, that was fast! Ok so we have 1 and 3. That means we have to go to 13 Field Court to find the language specialist. Let me know what the note says once you figure it out.",
      category: 'text',
      targetText: 'map',
      conclusion: ' ',
      order:11
    },
    { objective: 'X Marks the Spot', // mission 3
      summary: "Ok, so we need to find a map. Have you ever seen a map at the Cody's house? Do you remember where it is? Text in the place that is marked on the map.",
      category: 'text',
      targetText: 'Scotland',
      conclusion: ' ',
      order:12
    },
    { objective: 'Grandfather Knows All', // mission 3
      summary: "Scotland, huh? What Scottish things do the Cody's have in their house? Maybe Grampy knows. Text in the item he says.",
      category: 'text',
      targetText: 'curling stone',
      conclusion: ' ',
      order:13
    },
    { objective: 'Scottish Sports', // mission 3
      summary: "Well I guess we better go see what's near the curling stone, or underneath it... they are heavy though, so be safe! Send a picture of what you find!",
      category: 'image',
      targetText: ['paper'],
      conclusion: ' ',
      order:14
    },
    { objective: 'Letter Puzzle', // mission 3
      summary: "Another note? We actually found a note at The Ageny Headquarters, but it's missing a bunch of letters. Maybe if you can solve the puzzle in your note, we can figure out what our note says. Send us the missing letters without spaces between them.",
      category: 'text',
      targetText: 'bcpt',
      conclusion: ' ',
      order:15
    },
    { objective: 'The Final Riddle', // mission 3
      summary: "Ok we filled in the note with the letters you gave us. This is what our note says:\n\nThis thing I speak of\nholds you up off the floor\nSome people can't help it\nbut try not to snore\n\nyou go to this place\nwhen the moon comes out\neyes closed, dreams flow\nI wonder what they're about\n\nYou lay on top of this\nto rest your tired head\nbut when was the last time\nyou checked under the _____",
      category: 'text',
      targetText: 'bed',
      conclusion: ' ',
      order:16
    },
    { objective: 'Lost and Found', // mission 3
      summary: "You figured it out! We better go look under the beds then! Did you find anything? Respond with a 'yes' or 'no'",
      category: 'text',
      targetText: 'yes',
      conclusion: 'Way to go, guys! You cracked the case and proved that you are incredible agents. We are lucky to have you and you deserve your present after all your hard work! Enjoy it and Merry Christmas!',
      order:17
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
      'The Voice of Ultimate Betrayal': missions['Grace Hopper and the Missing Bone'],
      'The Day it Disappeared': missions['The Case of the Missing Present'],
      'Canine Clues': missions['The Case of the Missing Present'],
      'Car Color': missions['The Case of the Missing Present'],
      'Cars Have Homes Too': missions['The Case of the Missing Present'],
      'Open Sesame 1': missions['The Case of the Missing Present'],
      'Fishy Fruit': missions['The Case of the Missing Present'],
      'Find Fruit': missions['The Case of the Missing Present'],
      'Open Sesame 2': missions['The Case of the Missing Present'],
      'Math Madness': missions['The Case of the Missing Present'],
      'To the Translator': missions['The Case of the Missing Present'],
      'That is Greek to Me': missions['The Case of the Missing Present'],
      'X Marks the Spot': missions['The Case of the Missing Present'],
      'Grandfather Knows All': missions['The Case of the Missing Present'],
      'Scottish Sports': missions['The Case of the Missing Present'],
      'Letter Puzzle': missions['The Case of the Missing Present'],
      'The Final Riddle': missions['The Case of the Missing Present'],
      'Lost and Found': missions['The Case of the Missing Present']
    }
  }

};

const seed = (db) => {

if(db){
console.log("DB PROVIDED")
const User = db.models.users
const Challenge = db.models.challenges
const Mission = db.models.missions
const UserMission = db.models.userMissions
const UserChallenge = db.models.userChallenges
  db.sync({force: true})
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
        username: 'Gator'
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
        username: 'Gator'
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
      return challengeKeys.forEach(key => {
        return challengeMission[key].addChallenge(challenges[key]);
      })
    })
    .then(() => console.log("******************   DONE   ******************"))
})

}}

if(module === require.main){
  console.log("MANUALLY CALLED SEED")
  const db = require('./')
  seed(db)
}

module.exports = seed;

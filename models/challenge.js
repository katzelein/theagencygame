'use strict'

const Sequelize = require('sequelize')
const db = require('./_db')

const Challenge = db.define('challenges', {
  objective: Sequelize.STRING,
  summary: Sequelize.TEXT,
  targetTags: Sequelize.ARRAY(Sequelize.STRING),
  targetText: Sequelize.TEXT,
  conclusion: Sequelize.TEXT,
  category: Sequelize.ENUM('text', 'image', 'voice'),
  order: Sequelize.INTEGER,
  hasNext: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
}, {
  hooks: {
    beforeDestroy: function(challenge, options) {
      let challengeOrder = challenge.order
      challenge.getMission()
        .then(mission => {
          console.log("MISSION BEFORE DESTORY: ", mission)
          if (mission) {
            mission.removeChallenge(challenge.id)
              .then(() => {
                mission.decrement("numChallenges")
                  .then(() => {
                    mission.getChallenges()
                      // {where: {
                      // order: {$gt: challenge.order}}}
                  
                    .then(challenges => {
                      console.log("CHALLENGES: ", challenges)
                      console.log("numChallenges: ", challenges.length - 1)
                      let promiseArr = []
                      challenges.forEach(challenge => {
                        if(challenge.order > challengeOrder){
                          promiseArr.push(challenge.decrement('order'))
                        }
                      })
                      promiseArr.push(challenges[challenges.length - 1].update({hasNext: false}))
                      return Promise.all(promiseArr)
                    })
                    .then(() => console.log("UPDATED MISSION BEFORE DESTROY"))
                  })
              })
          } else {
            console.log("NO MISSION")
          }
        })
    }
  }
})


module.exports = Challenge

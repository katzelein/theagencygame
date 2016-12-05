'use strict'

const Sequelize = require('sequelize')
const db = require('./_db')

const Challenge = db.define('challenges', {
  objective: Sequelize.STRING,
  summary: Sequelize.TEXT,
  // latitude: {
  //   type: Sequelize.FLOAT,
  //   defaultValue: 0,
  //   validate: { min: -90, max: 90 }
  // },
  // longitude: {
  //   type: Sequelize.FLOAT,
  //   defaultValue: 0,
  //   validate: { min: -180, max: 180 }
  // },
  targetTags: Sequelize.ARRAY(Sequelize.STRING),
  targetText: Sequelize.TEXT,
  conclusion: Sequelize.TEXT,
  category: Sequelize.ENUM('text', 'image', 'voice'),
  order: Sequelize.INTEGER,
  hasNext: Sequelize.BOOLEAN
}, {
  hooks: {
    // afterUpdate: function(challenge, options) {
    //     challenge.getMission()
    //     .then(mission => {
    //       console.log("mission: ", mission)
    //       mission.getChallenges()
    //       .then(challenges => {
    //       console.log("MISSION ASSOCIATIONS: ", challenges)
    //       return mission.update
    //   })
    //   .then(() => console.log("hook done"))
    //   })
    // }
    afterCreate: function(challenge, options){
      console.log("AFTER CREATE ******************")
      if(challenge.order === null){
        console.log("CHALLENGE ORDER IS NULL")
        challenge.getMission()
        .then(mission => {
          console.log("MY MISSION: ", mission)
          if(mission){
            console.log("found mission!")
            let numOrder = mission.numChallenges
            console.log("NUM ORDER: ", numOrder)
            challenge.update({order: numChallenges})
          }
      })
    }
    },

    beforeDestroy: function(challenge, options) {
      challenge.getMission()
        .then(mission => {
          console.log("MISSION BEFORE DESTORY: ", mission)
          if (mission) {
            mission.removeChallenge(challenge.id)
              .then(() => {
                mission.decrement("numChallenges")
                  .then(() => console.log("UPDATED MISSION BEFORE DESTROY"))
              })
          } else {
            console.log("NO MISSION")
          }
        })
    }
  }
})

module.exports = Challenge

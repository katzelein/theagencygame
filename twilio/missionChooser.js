'use strict'
const sequelize = require('sequelize')
const Mission = require('../models/mission');
const Challenge = require('../models/challenge');
const db = require('../models')
const User = db.models.users


const partnerChooser = (coordinates) => {
// 	db.query("SELECT * FROM users WHERE ST_DWithin(user.location, 'POINT(1000 1000)', 100.0)", 
// 		{ type: sequelize.QueryTypes.SELECT }).then(function (results) {

// 			console.log("RESULTS: ", results)
// })
let coordString = `POINT(${coordinates[0]} ${coordinates[1]})`
User.findAll({
	where: sequelize.and(
		sequelize.where(sequelize.fn(
			'ST_DWithin',
			sequelize.col('users.location'), sequelize.fn('ST_GeographyFromText', `SRID=4326;${coordString}`), 100), true
		),
		//sequelize.where(sequelize.col('users.status'), 'ready')
		{status: 'ready'}
		)
	
})
.then(res => console.log("RES: ", res))
.catch(err => console.log(err))
}

const missionChooser = (location, place) => {
	// filter all missions based on location
	// randomly choose a mission


	// can also fetch mission based on labelled place
	// set default to return Grace Hopper mission
	if (!place) place = "Grace Hopper"; 
	return Mission.findOne({where: {place: place}})
}

console.log("PARTNER CHOOSER: ", partnerChooser([40, 70]))

// return Neighborhood.findById(id).then(neighborhood => {
//   return neighborhood.getAddress().then(address => {
//     return Address.findAll({
//       where: sequelize.where(
//         sequelize.fn(
//           'ST_DWithin',
//           sequelize.fn(
//             'ST_Transform',
//             address.position,
//             26986),
//           sequelize.fn('ST_Transform',
//             sequelize.col('position'),
//             26986),
//           distance),
//         true
//       )
//     })
//   })
// }).catch(err => new Error(err));

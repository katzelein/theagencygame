var express = require('express');
var router = express.Router();
// var Hotel = require('../models/hotel');
// var Restaurant = require('../models/restaurant');
// var Activity = require('../models/activity');
// var Place = require('../models/place');
// var Promise = require('bluebird');


router.get('/', function (req, res, next) {
  console.log('You found my GET!')
})


var twilio = require('twilio');

// var app = require('../app')

router.post('/sms', function(req, res) {
  var twilio = require('twilio');
  var twiml = new twilio.TwimlResponse();
  twiml.message('The Robots are coming! Head for the hills!');
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

// router.get('/', function(req, res, next) {

//   var findingHotels = Hotel.findAll({
//     include: [Place]
//   });

//   var findingActivities = Activity.findAll({
//     include: [Place]
//   });

//   var findingRestaurants = Restaurant.findAll({
//     include: [Place]
//   });

//   Promise.all([
//     findingHotels,
//     findingActivities,
//     findingRestaurants
//   ])
//   .spread(function(hotels, activities, restaurants) {
//     res.render('index', {
//       hotels: hotels,
//       activities: activities,
//       restaurants: restaurants
//     });
//   })
//   .catch(next);

// });

module.exports = router;

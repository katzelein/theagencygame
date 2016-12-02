var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var constants = require('../variables');
var User = require('../models/user');

// router.get('/', function (req, res, next) {
//   res.send("I'm working!")
// })

var phoneReg = require('../phone_verification')(constants.authyKey);

// https://github.com/seegno/authy-client
const Client = require('authy-client').Client;
const authy = new Client({key: constants.authyKey});


router.post('/verification/start', function(req, res, next){
	var phone_number = req.body.phoneNumber.trim();
    var country_code = req.body.countryCode;
    var via = req.body.via;

    console.log("body: ", req.body);
    console.log('THIS IS AN ARBITRARY CONSOLE LOG')
    console.log("THIS IS THE AUTHY KEY IN VERIFICATION START", constants.authyKey);

    if (phone_number && country_code && via) {
        phoneReg.requestPhoneVerification(phone_number, country_code, via, function (err, response) {
            if (err) {
                console.log('error creating phone reg request', err);
                res.status(500).json(err);
            } else {
                console.log('Success register phone API call: ', response);
                res.status(200).json(response);
            }
        });
    } else {
        console.log('Failed in Register Phone API Call', req.body);
        res.status(500).json({error: "Missing fields"});
    }
})


router.post('/verification/verify', function(req, res, next){
	 var country_code = req.body.countryCode;
    var phone_number = req.body.phoneNumber;
    var token = req.body.token;
		console.log('THE REQ.BODY.TOKEN INSIDE OF VERIFY', req.body.token)

    if (phone_number && country_code && token) {
        phoneReg.verifyPhoneToken(phone_number, country_code, token, function (err, response) {
            if (err) {
                console.log('error creating phone reg request', err);
                res.json({verified: false});
            } else {
                console.log('Confirm phone success confirming code: ', response);
                if (response.success) {
                	console.log("REQ.SESSION: ", req.session)
                    req.session.ph_verified = true;
                    let number = "+" + country_code + phone_number
                    User.findOne({
                        where: {
                            phoneNumber: number
                        }
                    })
                    .then(user => {
                        req.session.user = user
                        res.json({verified: true, number})
                    })
                }
                else{
                	res.json({verified: false});
            	}
            }

        });
    } else if(phone_number && country_code && !token){
        console.log('Failed in Confirm Phone request body: ', req.body);
        res.json({error: "Please enter your token."});
    }
    else{
        res.json({error: "Error. Please request a new code."})
    }
})

module.exports = router;

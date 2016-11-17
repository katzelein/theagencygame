var vCard = require("vcard")
var util = require("util")
var card = new vCard();
card.readFile("https://api.twilio.com/2010-04-01/Accounts/AC8b6aeccc3229dc3db665208f22c1e3c7/Messages/MM7c9a6a399c39cd8c92147475b61115c5/Media/MEceda61786a02687157b6be4a83f8b1f1", function(err, json) {
	console.log("inspect result: ", util.inspect(json));
})
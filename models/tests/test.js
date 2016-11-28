const sendMessage = {
	NEED_USERNAME: (userInput) => {
		let re = new RegExp("^[A-Za-z0-9]+$");
		if (re.test(userInput)) {
		    console.log("Valid username");
		} else {
		    console.log("Invalid username");
		}

		return "Welcome to the Agency, Agent "+userInput+"! Would you like to participate in training mission?"
	}
}

//let temp = getUser ('', 'something');

let x = sendMessage.NEED_USERNAME('evie')

console.log(x);

x
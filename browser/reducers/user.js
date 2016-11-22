import axios from 'axios';
export const SET_USER = "SET_USER";

export const setUser = (user) => ({
	type: SET_USER,
	user
})

export const fetchUser = (number) => ((dispatch) => {
	console.log("dispatching users")
	console.log(typeof number, " : ", number)
	axios.get(`/api/user/${number}`)
    .then(res => res.data)
    .then(user => {
    	console.log("USER in fetchUser: ", user)
    	dispatch(setUser(user))
    });
})

export const user = (user = {}, action) => {
	console.log("user dispatcher")
  switch (action.type) {
    case SET_USER: return action.user;
    default: return user;
  }
}

//


import axios from 'axios';
export const SET_USER = "SET_USER";
export const GET_USER_DATA = "GET_USER_DATA";

export const setUser = (user) => ({
	type: SET_USER,
	user
})

export const getUserData = (data) => ({
  type: GET_USER_DATA,
  user: data.user,
  userMissions: data.userMissions,
  userChallenges: data.userChallenges
})

export const fetchUser = () => ((dispatch) => {
	console.log("dispatching users")
	//console.log(typeof number, " : ", number)
  axios.get('/api/whoami')
  .then(res => res.data)
  .then(user => {
    //console.log("user from whoami: ", user.username)
    if(user.id){
      axios.get(`/api/user/${user.id}/data`)
      .then(res => res.data)
      .then(data => {
        console.log("This came back in our route: ", data)
        dispatch(getUserData(data))
      });
    }
    else {
      console.log("That user has no history with The Agency")
    }
  })
})

export const user = (state, action) => {
	console.log("user dispatcher")
  switch (action.type) {
    case SET_USER: return action.user;
    case GET_USER_DATA: return Object.assign({}, state, {user: action.user, userMissions: action.userMissions, userChallenges:action.userChallenges})
    default: return user;
  }
}


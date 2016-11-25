import axios from 'axios';
export const GET_USER_MISSIONS = "GET_USER_MISSIONS";

export const getUserMissions = (userMissions) => ({
  type: GET_USER_MISSIONS,
  userMissions
})

export const fetchUserMissions = (number) => ((dispatch) => {
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


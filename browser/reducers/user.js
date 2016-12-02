import axios from 'axios';
export const SET_USER = "SET_USER";

export const setUser = (user) => ({
	type: SET_USER,
	user
})

export const fetchUser = () => ((dispatch) => {
	console.log("dispatching users")
  axios.get('/api/whoami')
  .then(res => res.data)
  .then(user => {
    if(user.id){
      axios.get(`/api/user/${user.id}`)
      .then(res => res.data)
      .then(user => {
        console.log("USER in fetchUser: ", user)
        dispatch(setUser(user))
      });
    }
    else{
      dispatch(setUser({}))
    }
  })
})

export const user = (user = {}, action) => {
	console.log("user dispatcher")
  switch (action.type) {
    case SET_USER: return action.user;
    default: return user;
  }
}

//


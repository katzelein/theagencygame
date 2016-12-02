import axios from 'axios';
export const GET_USER_DATA = "GET_USER_DATA";

export const getUserData = (userData) => ({
  type: GET_USER_DATA,
  userData
})

export const fetchUserData = () => ((dispatch) => {
  console.log("dispatching userData")
  axios.get('/api/whoami')
  .then(res => res.data)
  .then(user => {
    if(user.id){
      axios.get(`/api/user/${user.id}/history`)
      .then(res => res.data)
      .then(userData => {
        console.log("USERDATA in fetchUserData: ", userData)
        dispatch(getUserData(userData))
      });
    }
    else{
      dispatch(getUserData([]))
    }
  })
})

export const userData = (userData = [], action) => {
  console.log("userData dispatcher")
  switch (action.type) {
    case GET_USER_DATA: return action.userData
    default: return userData;
  }
}

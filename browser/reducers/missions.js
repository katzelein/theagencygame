import axios from 'axios';
export const SET_MISSIONS = "SET_MISSIONS";

export const setMissions = (missions) => ({
	type: SET_MISSIONS,
	missions
})

export const fetchMissions = () => ((dispatch) => {
	console.log("dispatching missions")
	//console.log(typeof number, " : ", number)
  axios.get('/api/missions')
  .then(res => res.data)
  .then(missions => {
    console.log("missions in fetchmissions: ", missions)
    dispatch(setMissions(missions))
  });
})
    

export const missions = (missions = [], action) => {
	console.log("missions dispatcher")
  switch (action.type) {
    case SET_MISSIONS: return action.missions;
    default: return missions;
  }
}

//


import axios from 'axios';
export const SET_MISSIONS = "SET_MISSIONS";

export const setMissions = (missions) => ({
  type: SET_MISSIONS,
  missions
})

export const fetchMissions = () => ((dispatch) => {
  axios.get('/api/missions')
    .then(res => res.data)
    .then(missions => {
      dispatch(setMissions(missions))
    });
})


export const missions = (missions = [], action) => {
  switch (action.type) {
    case SET_MISSIONS:
      return action.missions;
    default:
      return missions;
  }
}

//

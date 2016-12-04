import axios from 'axios';
export const SET_CHALLENGES = "SET_CHALLENGES";

export const setChallenges = (challenges) => ({
  type: SET_CHALLENGES,
  challenges
})

export const fetchChallenges = () => ((dispatch) => {
  axios.get('/api/challenges')
    .then(res => res.data)
    .then(challenges => {
      dispatch(setChallenges(challenges))
    });
})


export const challenges = (challenges = [], action) => {
  switch (action.type) {
    case SET_CHALLENGES:
      return action.challenges;
    default:
      return challenges;
  }
}
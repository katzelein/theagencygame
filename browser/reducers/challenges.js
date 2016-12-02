import axios from 'axios';
export const SET_CHALLENGES = "SET_CHALLENGES";

export const setChallenges = (challenges) => ({
  type: SET_CHALLENGES,
  challenges
})

export const fetchChallenges = () => ((dispatch) => {
  console.log("dispatching challenges")
    //console.log(typeof number, " : ", number)
  axios.get('/api/challenges')
    .then(res => res.data)
    .then(challenges => {
      console.log("challenges in fetchchallenges: ", challenges)
      dispatch(setChallenges(challenges))
    });
})


export const challenges = (challenges = [], action) => {
  console.log("challenges dispatcher")
  switch (action.type) {
    case SET_CHALLENGES:
      return action.challenges;
    default:
      return challenges;
  }
}

//

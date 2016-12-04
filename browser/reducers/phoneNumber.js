import axios from 'axios';
export const SET_PHONE = "SET_PHONE";

export const setPhoneNumber = (phoneNumber) => ({
  type: SET_PHONE,
  phoneNumber
})

export const fetchPhoneNumber = (number) => ((dispatch) => {
  axios.get(`/api/phoneNumber/${number}`)
    .then(res => res.data)
    .then(phoneNumber => {
      dispatch(setPhoneNumber(phoneNumber))
    });
})

export const phoneNumber = (phoneNumber = {}, action) => {
  switch (action.type) {
    case SET_PHONE:
      return action.phoneNumber;
    default:
      return phoneNumber;
  }
}

//

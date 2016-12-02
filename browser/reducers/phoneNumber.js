import axios from 'axios';
export const SET_PHONE = "SET_PHONE";

export const setPhoneNumber = (phoneNumber) => ({
  type: SET_PHONE,
  phoneNumber
})

export const fetchPhoneNumber = (number) => ((dispatch) => {
  console.log("dispatching users")
  console.log(typeof number, " : ", number)
  axios.get(`/api/phoneNumber/${number}`)
    .then(res => res.data)
    .then(phoneNumber => {
      console.log("PHONE in fetchPhoneNumber: ", phoneNumber)
      dispatch(setPhoneNumber(phoneNumber))
    });
})

export const phoneNumber = (phoneNumber = {}, action) => {
  console.log("phoneNumber dispatcher")
  switch (action.type) {
    case SET_PHONE:
      return action.phoneNumber;
    default:
      return phoneNumber;
  }
}

//

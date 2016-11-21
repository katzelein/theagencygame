
export const SET_USER = "SET_USER";

export function user(user = {}, action) {
  switch (action.type) {
    case SET_USER: return action.user;
    default: return user;
  }
}


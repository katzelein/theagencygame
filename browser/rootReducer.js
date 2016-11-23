import { combineReducers } from 'redux';
import { user } from './reducers/user';
import { phoneNumber } from './reducers/phoneNumber';

const rootReducer = combineReducers({
  user,
  phoneNumber
});

export default rootReducer;
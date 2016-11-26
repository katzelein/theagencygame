import { combineReducers } from 'redux';
import { user } from './reducers/user';
import { phoneNumber } from './reducers/phoneNumber';
import { missions } from './reducers/missions';

const rootReducer = combineReducers({
  user,
  phoneNumber,
  missions
});

export default rootReducer;
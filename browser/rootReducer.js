import { combineReducers } from 'redux';
import { user } from './reducers/user';
import { phoneNumber } from './reducers/phoneNumber';
import { missions } from './reducers/missions';
import { challenges } from './reducers/challenges';

const rootReducer = combineReducers({
  user,
  phoneNumber,
  missions,
  challenges
});

export default rootReducer;
import { combineReducers } from 'redux';
import { user } from './reducers/user';
import { phoneNumber } from './reducers/phoneNumber';
import { missions } from './reducers/missions';
import { challenges } from './reducers/challenges';
import { userData } from './reducers/userData';

const rootReducer = combineReducers({
  user,
  phoneNumber,
  missions,
  challenges,
  userData
});

export default rootReducer;

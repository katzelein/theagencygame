import { createStore, applyMiddleware } from 'redux';
import rootReducer from './rootReducer';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

const loggerMiddleware = createLogger();
const middleware = applyMiddleware(loggerMiddleware, thunkMiddleware);
const store = createStore(rootReducer, middleware);
export default store;

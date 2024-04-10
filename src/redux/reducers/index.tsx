import { combineReducers } from 'redux';

import userReducer from './userReducer';
import saldoReducer from './saldoReducer';
import userRegisterReducer from './userRegisterReducer';
import userRecouverReducer from './userRecouverReducer';

const rootReducer = combineReducers({
	userReducer,
	saldoReducer,
	userRegisterReducer,
	userRecouverReducer,
});

export default rootReducer;

import {
	legacy_createStore as createStore,
	applyMiddleware,
	AnyAction,
	Store,
} from 'redux';
import { logger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import { composeWithDevTools } from 'redux-devtools-extension';

import { constants } from '../../constants';

import rootReducer from '../reducers/index';

const persistConfig = {
	key: 'root',
	storage: storage,
	whitelist: ['userReducer', 'saldoReducer', 'userRegisterReducer'],
	blacklist: [],
	transforms: [
		encryptTransform({
			secretKey: constants.encryptKey,
			onError: function (error) {
				console.log(error);
			},
		}),
	],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

let store: Store<any, AnyAction>;
if (process?.env?.NODE_ENV === 'development') {
	store = createStore(
		persistedReducer,
		composeWithDevTools(applyMiddleware(logger))
	);
} else {
	store = createStore(persistedReducer);
}

const persistor = persistStore(store);

export { store, persistor };

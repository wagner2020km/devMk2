import {
	SET_DATA,
	SET_FIELD,
	RESET_DATA,
} from '../actions/userRegisterActions';

const initialState = {};

const reducer = (state = initialState, action: any) => {
	switch (action.type) {
		case SET_DATA: {
			return {
				...state,
				user: action.user,
			};
		}
		case SET_FIELD: {
			return {
				...state,
				[action.field]: action.value,
			};
		}
		case RESET_DATA: {
			return {};
		}
		default: {
			return state;
		}
	}
};

export default reducer;

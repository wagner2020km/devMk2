import { SET_DATA, RESET_DATA } from '../actions/userActions';

const initialState = {};

const reducer = (state = initialState, action: any) => {
	switch (action.type) {
		case SET_DATA: {
			return {
				...state,
				user: action.user,
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

import { SET_DATA, RESET_DATA } from '../actions/saldoActions';

const initialState = 0;

const reducer = (state = initialState, action: any) => {
	switch (action.type) {
		case SET_DATA: {
			return {
				saldo: action.saldo,
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

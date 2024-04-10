import { boolean } from 'yup';

export const initialState = {
	habilitaSaldo: boolean,
	number: 0,
	modalIsOpen: boolean,
	recebeStadoSaldo: 0,
	blockCard: boolean,
	user: {},
};

export const AppReducer = (state, action) => {
	switch (action.type) {
		case 'add_number': {
			return {
				...state,
				number: action.value + state.number,
			};
		}
		case 'mostraSaldo': {
			return {
				...state,
				habilitaSaldo: (action.value = !state.habilitaSaldo),
			};
		}
		case 'bloqueiaCartao': {
			return {
				...state,
				blockCard: (action.value = !state.blockCard),
			};
		}

		case 'bloqueiaTela': {
			console.log('stado que chegou aqui ', state.modalIsOpen);
			return {
				...state,
				modalIsOpen: (action.value = false),
			};
		}

		case 'recebeSaldo': {
			console.log('stado que chegou aqui ', state.modalIsOpen);
			return {
				...state,
				recebeStadoSaldo: (action.value = state.recebeStadoSaldo),
			};
		}
	}
};

import { setupAPIClient } from '../../services/api';
import { store } from '../../redux/store';

const apiClient = setupAPIClient();

export const getLimit = async () => {
	try {
		const { user } = store.getState().userReducer;
		const response = await apiClient.get(
			`/conta/limite-transacoes/${user.numeroConta}`
		);
		return response;
	} catch (error) {
		console.log('Erro aqui',error);
		return {
			error: error?.response?.status,
			data: error?.response?.data,
			status: error?.response?.status,
		};
	}
};
export const updatetLimit = async (dataPutLimit) => {
	try {
		const { user } = store.getState().userReducer;
		const response = await apiClient.put(
			`/conta/limite-transacoes`, dataPutLimit
		);
		return response;
	} catch (error) {
		console.log('Erro aqui',error);
		return {
			error: error?.response?.status,
			data: error?.response?.data,
			status: error?.response?.status,
		};
	}
};



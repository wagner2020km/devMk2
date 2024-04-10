import { setupAPIClient } from '../../services/api';
import { store } from '../../redux/store';

const apiClient = setupAPIClient();

export const getSaldo = async () => {
	try {
		const { user } = store.getState().userReducer;
		const response = await apiClient.get(
			`/carteira/saldo/${user.docCliente}`
		);
		return response;
	} catch (error) {
		console.log(error);
		return {
			error: error?.response?.status,
			data: error?.response?.data,
			status: error?.response?.status,
		};
	}
};
export const AddSaldo = async (data: any, numerodoconta: string) => {
	try {
		const response = await apiClient.post(
			`/carteira/lancamento/${numerodoconta}`,
			data
		);
	
		return response;
	} catch (error) {
		console.log(error);
		return {
			error: error?.response?.status,
			data: error?.response?.data,
			status: error?.response?.status,
		};
	}
};

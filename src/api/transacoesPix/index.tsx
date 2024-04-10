/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { setupAPIClient } from '../../services/api';
import { store } from '../../redux/store/';

const apiClient = setupAPIClient();
const { user } = store.getState().userReducer;

export const pixCachOut = async (dadosEnviaPix, type: string) => {
	console.log('tipo pagamento aqui ', type);
	console.log('dados para pagamento ', dadosEnviaPix);
	let url = '';
	try {
		if(type == 'sms'){
			url = '-web';
		}
		const response = await apiClient.post(`/cash-out/pix${url}`, dadosEnviaPix);
		console.log('retornoPix', response);
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

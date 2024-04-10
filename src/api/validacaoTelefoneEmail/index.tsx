/* eslint-disable @typescript-eslint/no-unused-vars */
import { setupAPIClient } from '../../services/api';
import { store } from '../../redux/store/';

const apiClient = setupAPIClient();
const { user } = store.getState().userReducer;

export const smsOuEmail = async (tipoEnvio, dadosTelefoneOuEmail) => {
	let data = {};
	if (tipoEnvio == 'sms') {
		data = {
			telefone: `${dadosTelefoneOuEmail.replace('+55', '')}`,
		};
	} else {
		data = {
			email: `${dadosTelefoneOuEmail}`,
		};

		console.log('dados aqui', data);
	}
	try {
		const response = await apiClient.post(`validacao/enviar-token`, data);
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

// eslint-disable-next-line no-unused-vars
export const validaMobile = async (tipoEnvio: string, dataEnvio: string) => {
	let data = {};
	if (tipoEnvio == 'mobile') {
		data = {
			conta: `${user.numeroConta}`,
			//conta: `00014321678`,
			marca: 'Sansung',
			modelo: 'SDM636',
			imei: '864363032940212',
			numero_serie: '12345678910987654',
		};
	}
	try {
		const response = await apiClient.post(
			`seguranca/totp/gerar-autorizacao`,
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

export const veryFiWatZapPhone = async (type: string, dataPhone: string) => {
	console.log(type);
	console.log(dataPhone);
	try {
		const response = await apiClient.get(`validacao/verifica-celular-whatsapp/:${dataPhone}`);
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

export const sendTokenWatZap = async (dataPhone: string) => {

	try {
		const response = await apiClient.post(`validacao/enviar-token-whatsapp/:${dataPhone}`);
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


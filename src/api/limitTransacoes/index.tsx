import { setupAPIClient } from '../../services/api';
import { store } from '../../redux/store';

const apiClient = setupAPIClient();

export const getLimit = async () => {
	try {
		const { user } = store.getState().userReducer;
		const response = await apiClient.get(
			`/conta/limitTransacoes/${user.numeroConta}`
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

export const removerChavePix = async (paramChavePix: string) => {
	try {
		const { user } = store.getState().userReducer;
		const contaDeletarChave = {
			data: {
				conta: `${user.numeroConta}`,
			},
		};
		const response = await apiClient.delete(
			`pix/deletar/chave/${paramChavePix}`,
			contaDeletarChave
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

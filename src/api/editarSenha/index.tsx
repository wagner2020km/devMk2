import { setupAPIClient } from '../../services/api';
import { store } from '../../redux/store';
const apiClient = setupAPIClient();
export const editarSenha = async (senha, email) => {
	try {
		const { user } = store.getState().userReducer;
		const dataChange = {
			email: email,
			senha: senha,
		};
		console.log(dataChange);
		const response = await apiClient.put(
			'/auth/mudar-senha',
			dataChange
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

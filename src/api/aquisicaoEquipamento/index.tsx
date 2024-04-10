import { setupAPIClient } from '../../services/api';
import { store } from '../../redux/store';
import axios from 'axios'

//const apiClient = setupAPIClient();

export const aquisicaoMaquinasPos = async () => {

	try {
		const { user } = store.getState().userReducer;

		const response = await axios.get(`http://localhost:49165/api/v1/ads/machine-acquisition`);
		return response.data;
	} catch (error) {
		console.log(error);
		return {
			error: error?.response?.status,
			data: error?.response?.data,
			status: error?.response?.status,
		};
	}
};

export const planosEquipamentos = async () => {

	try {
		const { user } = store.getState().userReducer;

		const response = await axios.get(`http://localhost:49165/api/v1/ads/lista-plans`);

		return response.data;
	} catch (error) {
		console.log(error);
		return {
			error: error?.response?.status,
			data: error?.response?.data,
			status: error?.response?.status,
		};
	}
};

export const detalhesPlanoMaquina = async (id: string) => {

	try {
		const { user } = store.getState().userReducer;

		const response = await axios.get(`http://localhost:49165/api/v1/ads/plan/${id}`);

		return response.data;
	} catch (error) {
		console.log(error);
		return {
			error: error?.response?.status,
			data: error?.response?.data,
			status: error?.response?.status,
		};
	}
};

export const feesForPlan = async (id: string, idBandeira: string) => {

	try {
		const { user } = store.getState().userReducer;

		const response = await axios.get(`http://localhost:49165/api/v1/ads/fees/${id}/${idBandeira}`);

		return response.data;
	} catch (error) {
		console.log(error);
		return {
			error: error?.response?.status,
			data: error?.response?.data,
			status: error?.response?.status,
		};
	}
};

export const flagPayment = async (idBandeira: string) => {

	try {
		const { user } = store.getState().userReducer;

		const response = await axios.get(`http://localhost:49165/api/v1/ads/flag/${idBandeira}`);

		return response.data;
	} catch (error) {
		console.log(error);
		return {
			error: error?.response?.status,
			data: error?.response?.data,
			status: error?.response?.status,
		};
	}
};

export const getMachine = async () => {

	try {
		const { user } = store.getState().userReducer;

		const response = await axios.get(`http://localhost:49165/api/v1/ads/machine`);

		return response.data;
	} catch (error) {
		console.log(error);
		return {
			error: error?.response?.status,
			data: error?.response?.data,
			status: error?.response?.status,
		};
	}
};

export const addRequestMachine = async (data: any) => {

	try {
		const { user } = store.getState().userReducer;

		const response = await axios.post(`http://localhost:49165/api/v1/ads/createRequstMachine`, data);

		return response.data;
	} catch (error) {
		console.log(error);
		return {
			error: error?.response?.status,
			data: error?.response?.data,
			status: error?.response?.status,
		};
	}
};

export const listAllResquestMachine = async (data: any) => {

	try {
		//const  user.numeroConta = store.getState().userReducer;

		const response = await axios.get(`http://localhost:49165/api/v1/ads/allMachineRequest/${data}`);
	
		return response.data;
	} catch (error) {
		console.log(error);
		return {
			error: error?.response?.status,
			data: error?.response?.data,
			status: error?.response?.status,
		};
	}
};

export const acountNumberMachine = async (data: any) => {

	try {
		//const  user.numeroConta = store.getState().userReducer;

		const response = await axios.get(`http://localhost:49165/api/v1/ads/acountMachine/${data}`);
		
		return response.data;
	} catch (error) {
		console.log(error);
		return {
			error: error?.response?.status,
			data: error?.response?.data,
			status: error?.response?.status,
		};
	}
};

export const typePaymentMachine = async () => {

	try {

		const response = await axios.get(`http://localhost:49165/api/v1/ads/typePayment`);
		
		return response.data;
	} catch (error) {
		console.log(error);
		return {
			error: error?.response?.status,
			data: error?.response?.data,
			status: error?.response?.status,
		};
	}
};
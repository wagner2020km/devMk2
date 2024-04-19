import { setupAPIClient } from '../../services/api';
import { store } from '../../redux/store';

const apiClient = setupAPIClient();

export const getContasGraficas = async (pagePagination, perPage, valorSearch, accountLojista) => {

	let getIdLogista = '';
	let search = '';

	if(accountLojista != '' || accountLojista == undefined){
		getIdLogista = `&accountLojista=${accountLojista}`;
	}
	
	try {
		const { user } = store.getState().userReducer;
		const response = await apiClient.get(
			`/conta-corrente-parceiro?page=${pagePagination}&limit=${perPage}${getIdLogista}`
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

export const getContasGraficasFull = async () => {

	try {
		const { user } = store.getState().userReducer;
		const response = await apiClient.get(
			`/conta-corrente-parceiro-full`
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

export const getDadosContaGrafica = async (numeroConta: any) => {
	try {
		
		const response = await apiClient.get(
			`/dados-conta-corrente/${numeroConta}`
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




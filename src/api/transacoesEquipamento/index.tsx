import { setupAPIClient } from '../../services/api';
import { store } from '../../redux/store';
import axios from 'axios'

//const apiClient = setupAPIClient();

export const extratoEquipamento = async (page: number, perPage: number, dataForm: any) => {
	const pageNumber = page == 0 ? '' : page;
	console.log('dataForm',dataForm)
	const filtroDias = dataForm.filtroDia.isValid ? `&periodo=${dataForm.filtroDia.valor}` : '';
	const filtroBandeira = dataForm.filtroBandeiras.isValid ? `&bandeira=${dataForm.filtroBandeiras.valor}` : '';
	const filtroFormPg = dataForm.filtroFormPg.isValid ? `&formPg=${dataForm.filtroFormPg.valor}` : '';
	const filtroDataIni = dataForm.filtroFormDataIni.isValid ? `&dataIni=${dataForm.filtroFormDataIni.valor}` : '';
	const filtroDataFim = dataForm.filtroDataFim.isValid ? `&dataFim=${dataForm.filtroDataFim.valor}` : '';
	const filtroDataFilialId = dataForm.filtroFilialId.isValid ? `&filialId=${dataForm.filtroFilialId.valor}` : '';

	try {
		const { user } = store.getState().userReducer;

		const response = await axios.get(`http://localhost:49165/api/v1/ads/transaction?page=${pageNumber}&pageSize=${perPage}${filtroDias}${filtroBandeira}${filtroFormPg}${filtroDataIni}${filtroDataFim}${filtroDataFilialId}`);
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


export const simularTaxas = async (filialId: number, bandeiraId: number, valorSimulado: number) => {

	try {
		const { user } = store.getState().userReducer;

		const response = await axios.get(`http://localhost:49165/api/v1/ads/simularion?filialId=${filialId}&bandeiraId=${bandeiraId}&valorSimulado=${valorSimulado}`);
		console.log('retorno', response)
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

export const filiaisTransacaoes = async (numberAcount: string, agencia: string) => {

	try {
		const { user } = store.getState().userReducer;

		const response = await axios.get(`http://localhost:49165/api/v1/ads/filial/${numberAcount}/${agencia}`);
		console.log('retorno', response)
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

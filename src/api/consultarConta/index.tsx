
import { setupAPIClient } from '../../services/api';
const apiClient = setupAPIClient();
import { AxiosError } from 'axios';

type consltaProps ={
	numeroConta: string;
	
}
async function getAcount(numeroConta) {
	console.log('numero aqui', numeroConta)
	try {
		
		const response = await apiClient.get(
			`conta/consulta-conta-por-numero-bancario/${numeroConta}`
		);
		console.log(response.data)
		return response.data;
	} catch (error) {
		console.log(error);
		//console.log('Extrato', error.response)
		return {
			error: error?.response?.data.status,
			data: error?.response?.data,
			status: error?.response?.data.status,
		};
	}
}
export default getAcount;




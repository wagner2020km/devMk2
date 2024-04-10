import { setupAPIClient } from '../services/api';
import { AxiosError } from 'axios';

async function ValidaChaveTokemEmail(props) {
	//console.log('recebe props', props);
	//console.log('valida Token e-mail', props.tipoChaveString);

	const apiClient = setupAPIClient();
	let retornoJsonRequest = {};
	let dadosValidaTokemEmail = {};

	if (props.tipoChaveString == 'email') {
		dadosValidaTokemEmail = {
			//  "email": data.getKeyEmail
			email: props.chave,
			token: props.code,
		};
	} else {
		dadosValidaTokemEmail = {
			//  "email": data.getKeyEmail
			telefone: props.chave,
			token: props.code,
		};
	}

	try {
		const response = await apiClient.post(
			`/validacao/validar-token`,
			dadosValidaTokemEmail
		);
		console.log('Sucesso', response.data);

		retornoJsonRequest = {
			statusCode: response.data.status,
			response: response.data,
			statusErrot: false,
		};
		return retornoJsonRequest;
	} catch (error) {
		if (error instanceof AxiosError) {
			console.log('erro de axios', error);
			//  return error
			retornoJsonRequest = {
				statusCode: error.response.status,
				response: error,
				statusErrot: true,
			};
			return retornoJsonRequest;
		} else {
			console.log('erro de geral', error);
			retornoJsonRequest = {
				statusCode: error.response.status,
				response: error,
				statusErrot: true,
			};

			return retornoJsonRequest;
		}
	}
}
export default ValidaChaveTokemEmail;

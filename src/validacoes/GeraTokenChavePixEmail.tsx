import { setupAPIClient } from '../services/api';
import { AxiosError } from 'axios';

async function GeraTokenChavePixEmail(props, tipoChave) {
	console.log('gera Token e-mail', props);
	const apiClient = setupAPIClient();
	let retornoJsonRequest = {};
	let dadosValodaEmail = {
		//  "email": data.getKeyEmail
	};

	if (tipoChave == 'email') {
		dadosValodaEmail = {
			email: props.getKeyEmail,
		};
	} else {
		dadosValodaEmail = {
			telefone: props.getKeyTelefone,
		};
	}
	console.log('dadosEmail', dadosValodaEmail);
	try {
		const response = await apiClient.post(
			`/validacao/enviar-token`,
			dadosValodaEmail
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
			//return error
			/*
           404 requisição não encontrada
           400 requisição invalida
           */
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
export default GeraTokenChavePixEmail;

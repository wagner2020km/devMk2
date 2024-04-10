import { setupAPIClient } from '../services/api';
import { AxiosError } from 'axios';

async function CadastraChavePix(props) {
	//console.log('recebe props', props);
	//console.log('valida Token e-mail hoje', props.tipo_chave);

	const apiClient = setupAPIClient();

	let retornoJsonRequest = {};
	let dadosValidaTokemEmail = {};
	let trataChave = '';

	if (props.tipo_chave == 'telefone') {
		trataChave = `${props.chave}`;
	} else {
		trataChave = props.chave;
	}
	if (props.tipo_chave == 'aleatoria') {
		dadosValidaTokemEmail = {
			tipo_chave: props.tipo_chave,
		};
	} else {
		dadosValidaTokemEmail = {
			tipo_chave: props.tipo_chave,
			chave: trataChave,
		};
	}
	//const dadosValidaTokemEmail = {
	//  "email": data.getKeyEmail
	//tipo_chave: props.tipo_chave,
	//chave: trataChave,
	//};
	console.log(dadosValidaTokemEmail);
	try {
		const response = await apiClient.post(
			`/conta/${props.numeroDaConta}/pix`,
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
		console.log('erro', error.response);
		if (error instanceof AxiosError) {
			console.log('erro de axios', error.response);
			//  return error
			retornoJsonRequest = {
				statusCode: error?.response?.status,
				response: error,
				statusErrot: true,
			};
			return retornoJsonRequest;
		} else {
			console.log('erro de geral', error.response);
			retornoJsonRequest = {
				statusCode: error?.response?.status,
				response: error,
				statusErrot: true,
			};

			return retornoJsonRequest;
		}
	}
}
export default CadastraChavePix;

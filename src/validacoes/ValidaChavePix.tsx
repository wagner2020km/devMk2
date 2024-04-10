/* eslint-disable no-case-declarations */
import { setupAPIClient } from '../services/api';
import { AxiosError } from 'axios';

async function ValidaChavePix(props) {
	console.log(
		'estou dentro da função externa a chave é',
		props.optionTipoChave
	);
	const apiClient = setupAPIClient();

	let dadosJsonMutavel = {};
	// eslint-disable-next-line no-unused-vars
	// const dadosValodaEmail = {
	// 	//  "email": data.getKeyEmail
	// 	email: props.getKeyEmail,
	// };
	switch (props.optionTipoChave) {
		case 4:
			const dadosValodaEmail = {
				//  "email": data.getKeyEmail
				email: props.getKeyEmail,
			};
			console.log('caiu no email');
			dadosJsonMutavel = dadosValodaEmail;

			break;

		case 5:
			const dadosValodaTelefone = {
				//  "email": data.getKeyEmail
				// eslint-disable-next-line no-undef
				// telefone: data.getKeyTelefone,
			};

			dadosJsonMutavel = dadosValodaTelefone;

			break;

		default:
			break;
	}

	console.log('dados json mutavel', dadosJsonMutavel);
	try {
		const response = await apiClient.post(
			`/validacao/enviar-token`,
			dadosJsonMutavel
		);

		return response.data;
	} catch (error) {
		if (error instanceof AxiosError) {
			console.log(error);
			//  return error
		} else {
			//return error
			console.log(error);
		}
	}
}
export default ValidaChavePix;

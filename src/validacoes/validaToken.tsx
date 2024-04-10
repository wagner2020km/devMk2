import { setupAPIClient } from '../services/api';
import { AxiosError } from 'axios';

async function validaToken(props) {
	//console.log('valida Token e-mail', props.tipoChaveString);

	const apiClient = setupAPIClient();
	let dadosValidaTokemEmail = {};
	if (props.tipoChaveString == 'sms') {
		dadosValidaTokemEmail = {
			//  "email": data.getKeyEmail
			telefone: props.telefone,
			token: props.code,
		};
	} else {
		dadosValidaTokemEmail = {
			email: props.email,
			token: props.code,
		};
	}
	console.log('recebe props', props);
	try {
		const response = await apiClient.post(
			`/validacao/validar-token`,
			dadosValidaTokemEmail
		);
		console.log('Sucesso', response.data);
		return response;
	} catch (error) {
		if (error instanceof AxiosError) {
			console.log('erro de axios', error);
			return {
				error: '',
				data: '',
				status: '',
			};
		} else {
			console.log('erro', error);
			return {
				error: '',
				data: '',
				status: '',
			};
		}
	}
}
export default validaToken;

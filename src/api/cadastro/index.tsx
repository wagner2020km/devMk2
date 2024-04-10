import { setupAPIClient } from '../../services/api';
import { destroyCookie, setCookie, parseCookies } from 'nookies';
const apiClient = setupAPIClient();

type loginTemp = {
	usuario: string;
	senha: string;

}

export const regiterAccount = async (data: object) => {
	
	try {
		const response = await apiClient.post(`/conta/pessoa-fisica`, data);
		console.log('retorno Sucesso', response);
		return response;
	} catch (error) {
		console.log('retorno Erro', error);
		return {
			error: error?.response?.status,
			data: error?.response?.data,
			status: error?.response?.status,
		};
	}
};

export const regiterAccountCompany = async (data: object) => {
	
	try {
		const response = await apiClient.post(`/conta/empresa`, data);
		return response;
	} catch (error) {
		
		return {
			error: error?.response?.status,
			data: error?.response?.data,
			status: error?.response?.status,
		};
	}
};

export const sendCodeVerification = async (type: string, value: string) => {

	try {
		let data = {};
		if (type === 'email') {
			data = {
				email: value,
			};
		} else if (type === 'sms') {
			data = {
				telefone: value.replace('+55', ''),
			};
		}

		const response = await apiClient.post(`/validacao/enviar-token`, data);

		return response;
	} catch (error) {
		
		//	return {
		//error: error?.response?.status,
		//data: error?.response?.data,
		//	status: error?.response?.status,
		//};
	}
};

export const verifyCode = async (
	valueToken: string,
	type: string,
	valueType: string
) => {
	try {
		let data = {};
		if (type === 'email') {
			data = {
				email: valueType,
				token: valueToken,
			};
		} else if (type === 'sms') {
			data = {
				telefone: valueType.replace('+55', ''),
				token: valueToken,
			};
		}
	
		const response = await apiClient.post(`/validacao/validar-token`, data);
		return response;
	} catch (error) {
		console.log(error?.response?.data);
		return {
			error: error?.response?.status,
			data: error?.response?.data,
			status: error?.response?.status,
		};
	}
};

export const veryfiDataRegister = async (dataVeryfi: string) => {

	const newDataVerify = dataVeryfi.replace(/\D/g, '');
	let getData = '';
	try {
		switch (newDataVerify.length) {
			case 11:
				getData = 'cpf'
				break;

			case 14:
				getData = 'cnpj'
				break;

			default:
				break;
		}

		const response = await apiClient.get(`/validacao/verifica-documento-associado?${getData}=${newDataVerify}`);
		return response;
	} catch (error) {
	
		return {
			error: error?.response?.status,
			data: error?.response?.data,
			status: error?.response?.status,
		};
	}
};

export const veryfiContactRegister = async (type: string, dataVeryfi: string) => {

	
	let getData = {};

	try {
		switch (type) {
			case 'sms':
				getData = {
					tipo_contato: 'telefone',
					telefone: dataVeryfi.replace(/\D/g, '')
				}
				break;

			case 'email':
				getData = {
					tipo_contato: type,
					email: dataVeryfi
				}
				break;

			default:
				break;
		}
		
		const response = await apiClient.post(`/validacao/verifica-contato-associado`, getData);
		return response;
	} catch (error) {
		console.log(error?.response?.data);
		return {
			error: error?.response?.status,
			data: error?.response?.data,
			status: error?.response?.status,
		};
	}
};

export const getLoginTemp = async ({ usuario, senha }: loginTemp) => {
	
	try {
		const response = await apiClient.post('/login', {
			usuario: usuario,
			senha: senha
		})
		// console.log('dados Acesso', response)
		const { token } = response.data;
	
		const { nome_completo, numero_documento, conta, tipo_conta, telefone, email, tipo_auth_transacao, perfil_id } = response.data.usuario_conta;

		const data = {
			...response.data
		}

		apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;


		//navigate('home')
		return response.data


	} catch (error) {
		console.log('error ao acessar', error.response)

	}

}
export const registroTokenIdWallCpf = async (token: string, cpf: string) => {
	const cookies = parseCookies();
	let tokenBare = ''
	const cookieData = JSON.parse(cookies['@nextauth.dadosTemp']);
	const dadosLoginTemp = {
		usuario: cookieData.emailTemp,
		senha: cookieData.senhaTemp
	}
	const loginTemp = await getLoginTemp(dadosLoginTemp);
	
	if (loginTemp?.token) {
		tokenBare = loginTemp.token;
		try {
			const response = await apiClient.put(
				`/conta/pessoa-fisica/token-sdk-idwall?cpf=${cpf?.replace(/\D/g, '')}`,
				{
					token_sdk_idwall: token,
				},
				{
					headers: {
						Authorization: `Bearer ${tokenBare}`, // Adiciona o token ao cabeçalho de autorização
					},
				}
			);
			return response;
			
		} catch (error: any) {
			console.log(error.response);
			return {
				error: error?.response?.status,
				data: error?.response?.data,
				status: error?.response?.status,
				message: error?.response?.data?.message,
			};
		}
	} else {
		return {
			error: 400,
			data: null,
			status: 400,
			message: 'erro no login',
		};
	}


};

export const registroTokenIdWallCnpj = async (token: string, cnpj: string) => {
	const cookies = parseCookies();
	let tokenBare = ''
	const cookieData = JSON.parse(cookies['@nextauth.dadosTemp']);
	const dadosLoginTemp = {
		usuario: cookieData.emailTemp,
		senha: cookieData.senhaTemp
	}
	const loginTemp = await getLoginTemp(dadosLoginTemp);
	
	if (loginTemp?.token) {
		tokenBare = loginTemp.token;
		try {
			const response = await apiClient.put(
				`conta/pessoa-juridica/token-sdk-idwall?cnpj=${cnpj?.replace(/\D/g, '')}`,
				{
					token_sdk_idwall: token,
				},
				{
					headers: {
						Authorization: `Bearer ${tokenBare}`, // Adiciona o token ao cabeçalho de autorização
					},
				}
			);
			
			return response;
		} catch (error) {
			return {
				error: error?.response?.data.status,
				data: error?.response?.data,
				status: error?.response?.data.status,
			};
		}
	} else {
		return {
			error: 400,
			data: null,
			status: 400,
			message: 'erro no login',
		};
	}
};

export const registroTokenIdWallCpfLogado = async (token: string, cpf: string) => {
	
	
		try {
			const response = await apiClient.put(
				`/conta/pessoa-fisica/token-sdk-idwall?cpf=${cpf?.replace(/\D/g, '')}`,
				{
					token_sdk_idwall: token,
				},
				
			);
			return response;
			
		} catch (error: any) {
			console.log(error.response);
			return {
				error: error?.response?.status,
				data: error?.response?.data,
				status: error?.response?.status,
				message: error?.response?.data?.message,
			};
		}
	
};

export const registroTokenIdWallCnpjLogado = async (token: string, cnpj: string) => {
	
		try {
			const response = await apiClient.put(
				`conta/pessoa-juridica/token-sdk-idwall?cnpj=${cnpj?.replace(/\D/g, '')}`,
				{
					token_sdk_idwall: token,
				},
			
			);
			
			return response;
		} catch (error) {
			return {
				error: error?.response?.data.status,
				data: error?.response?.data,
				status: error?.response?.data.status,
			};
		}
	
};

import { setupAPIClient } from '../../services/api';

const apiClient = setupAPIClient();

export const queryAcount = async (tipo: string, codNumber: string) => {
	codNumber = codNumber.replace(/\D/g, '');

	const dataJson = {
		codigo_barras: {
			tipo: 0,
			digitavel: `${codNumber}`,
		},
	};

	try {
		const response = await apiClient.post(
			`/pagamento-contas/consultar-conta`,
			dataJson
		);
		//console.log(response);
		return response;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const reserveAmount = async (
	valor: number,
	tipo: string,
	codNumber: string,
	docCliente: string,
	dataVencimento: string,
	idAutorization: string
) => {
	console.log('dataVencimenta aqui', dataVencimento);
	docCliente = docCliente.replace(/\D/g, '');
	const dataJsonAmount = {
		cpf_cnpj: `${docCliente}`,
		dados_conta: {
			valor: valor,
			valor_original: valor,
			valor_desconto: 0,
			valor_adicional: 0,
		},
		codigo_barras: {
			tipo: 2,
			digitavel: `${codNumber}`,
		},
		data_vencimento: `${dataVencimento}`,
		id_transacao_authorize: `${idAutorization}`,
	};

	try {
		const response = await apiClient.post(
			`pagamento-contas/reservar-saldo`,
			dataJsonAmount
		);
		return response;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const makePayment = async (tipoValidacao, transactionId: string, tipoLeitura: string, barCode: string, valor: number, token: string, conta: string, telefone: string) => {
	console.log('VALOR',valor);
	let dataPayment = {};
	let url = '';
	
	if(tipoValidacao == 'sms'){
		url = '-web';
		 dataPayment = {
			"dados_conta": {
				"valor": valor
			},
			"codigo_barras": {
				"digitavel": barCode
			},
			"id_transacao_authorize": transactionId,
			"valida": {
				telefone: `${telefone.replace('+55', '')}`,
				token: token,
			},
		}
		
	}else{
		dataPayment = {
			"dados_conta": {
				"valor": valor
			},
			"codigo_barras": {
				"digitavel": barCode
			},
			"id_transacao_authorize": transactionId,
			"dispositivo": {
				conta: conta,
				totp_code: token,
			},
		}
	}
	console.log(dataPayment);
	
	try {
		const response = await apiClient.post(`/baas-pagamento-contas${url}`,
		dataPayment
		);
		return response;
	} catch (error) {
		console.log("ERRO AQUI",error);
		return error;
	}
	
};

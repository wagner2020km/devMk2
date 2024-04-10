import { setupAPIClient } from '../../services/api';
const apiClient = setupAPIClient();
import { formaTavalorCelcoin } from '../../utils/cpfMask'
import { AxiosError } from 'axios';

const transferenciaInterna = async (tipoValidacao: string, contaCredito: string, valor: string, conta: string, token: string, telefone: string) => {

	let dadosTRanferencia = {};
	let url = '';
	if(tipoValidacao == 'sms'){
		url = '-web';
		dadosTRanferencia = {
			
			conta_credito:
			{
				conta: contaCredito
			},
			//valor: Number(formaTavalorCelcoin(String(valor))),
			valor: valor,
			//mensagem_envio: mensagem_envio
			valida: {
				telefone: `${telefone.replace('+55', '')}`,
				token: token,
			},
	
	
		}
	}else{
		dadosTRanferencia = {
			conta_credito:
			{
				conta: contaCredito
			},
			//valor: Number(formaTavalorCelcoin(String(valor))),
			valor: valor,
			//mensagem_envio: mensagem_envio
			dispositivo: {
				totp_code: String(token),
				conta: conta
				}
	
	
		}
	}
console.log('URL', )
	/*
dispositivo: {
totp_code: String(token),
conta: conta
}
	*/


console.log('dados interna', dadosTRanferencia)
try {

	const response = await apiClient.post(
		`carteira/transferencia-interna${url}`, dadosTRanferencia
	);
	return response;
} catch (error) {

	if (error instanceof AxiosError) {
		//	console.log(error.response.data)
		return {
			//error: error?.response?.data?.errors,
			//data: error?.response?.data,
			data: error?.response?.data?.message,
			status: error?.response?.status,
		};

	} else {
		console.log('erro de geral',);

		return {
			error: error?.response?.status,
			data: error?.response?.data,
			message: error?.response?.data?.errors,
			status: error?.response?.status,
		};

	}

}
};

export default transferenciaInterna;



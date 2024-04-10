import { setupAPIClient } from '../../services/api';

const apiClient = setupAPIClient();

export const getExtratos = async (
	numeroConta: string,
	tipoTransacao: string,
	perPage: number,
	page: number,
	inputDateTextStart: string,
	inputDateTextEnd: string
) => {
	//console.log('recebe oTipo transação', tipoTransacao);
	//console.log('data start ', inputDateTextStart);
	//console.log('data end', inputDateTextEnd);
	let urlComplement = '';
	if (inputDateTextStart != '' && inputDateTextEnd != '') {
		//console.log('data start ', inputDateTextStart);
		//console.log('data end', inputDateTextEnd);
		urlComplement += `&data_inicio=${inputDateTextStart}&data_fim=${inputDateTextEnd}`;
	}
	if (tipoTransacao != '') {
		if (tipoTransacao == 'cashout' || tipoTransacao === 'cashin') {
			//console.log('atendeu a condição para', tipoTransacao);
			urlComplement += `&tipo_transacao=${tipoTransacao}`;
		}
		if (tipoTransacao === 'todos') {
			console.log('todos');
		}
		if (tipoTransacao === 'limpar') {
			console.log('todos');
		}
	}
	/*
/?tipo_transacao=${tipoTransacao}
conta con transação 3005402599548
	*/
	try {
		const response = await apiClient.get(
			`/relatorios/extrato-conta-corrente?limit=${perPage}&page=${page}${urlComplement}&order=DESC`
		);
		return response;
	} catch (error) {
		return {
			error: error?.response?.status,
			data: error?.response?.data,
			status: error?.response?.status,
		};
	}
};

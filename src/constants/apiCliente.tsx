import config from './project';
import { ProjectName } from '../interfaces/projects';
const isProd = process?.env?.PRODUCTION;

//https://mobileapi.globalpaysolucoes.com.br
//https://apisandbox.globalpaysolucoes.com.br/api/v1
//https://bank.globalpaysolucoes.com.br/api/v1


const _apiCliente = (nameProject: ProjectName) => {
	if (isProd) {
		switch (nameProject) {
			case 'anncora':
				return 'https://api.anncora.com.br/api/v1';
			case 'bithive':
				return 'https://bank.globalpaysolucoes.com.br/api/v1';
			case 'globalPay':
				return 'https://mobileapi.globalpaysolucoes.com.br/api/v1';
			case 'itsPay':
				return '';
			default:
				return '';
		}
	} else {
		switch (nameProject) {
			case 'anncora':
				return 'https://apisandbox.anncora.com.br/api/v1';
			case 'bithive':
				return 'https://bitbankapi.bithive.com.br/api/v1';
			case 'globalPay':
				return 'https://apisandbox.globalpaysolucoes.com.br/api/v1';
			case 'itsPay':
				return 'https://apisandboxistpay.bifrost.inf.br/api/v1';
			default:
				return '';
		}
	}
};

const apiCliente = _apiCliente(config.nameProject);

export default apiCliente;

import config from './project';
import { ProjectName } from '../interfaces/projects';
const isProd = process?.env?.PRODUCTION;

const _typePayment = (nameProject: ProjectName) => {

		switch (nameProject) {
			case 'anncora':
				return 'sms';
			case 'bithive':
				return 'sms';
			case 'globalPay':
				return 'sms';
			case 'itsPay':
				return '';
			default:
				return '';
		}
	
};


const typePayment = _typePayment(config.nameProject);

export default typePayment;

import config from './project';
import { ProjectName } from '../interfaces/projects';
// import {RodapeAncoora} from '../components/DadosRodape/RodapeAncoora/RodapeAncoora'
// import {RodapeBith} from '../components/DadosRodape/RodapeBith/RodapeBith'
const _titleBank = (nameProject: ProjectName) => {
	switch (nameProject) {
		case 'anncora':
			return 'Anncora';
		case 'bithive':
			return 'BithIve';
		case 'globalPay':
			return 'GlobalPay';
		case 'itsPay':
			return '';
		default:
			return '';
	}
};

const titleBank = _titleBank(config.nameProject);

export default titleBank;

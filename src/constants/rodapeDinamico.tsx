import config from './project';
import { ProjectName } from '../interfaces/projects';
import { RodapeAncoora } from '../components/DadosRodape/RodapeAncoora/RodapeAncoora';
import { RodapeBith } from '../components/DadosRodape/RodapeBith/RodapeBith';
import { RodapeGlobal } from '../components/DadosRodape/RodapeGlobal/RodapeGlobal';


const _rodapedinamico = (nameProject: ProjectName) => {
	switch (nameProject) {
		case 'anncora':
			return <RodapeAncoora />;
		case 'bithive':
			return <RodapeBith />;
		case 'globalPay':
			return <RodapeGlobal />;
		case 'itsPay':
			return '';
		default:
			return '';
	}
};

const rodapeDinamico = _rodapedinamico(config.nameProject);

export default rodapeDinamico;

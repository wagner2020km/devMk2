import config from './project';
import { ProjectName } from '../interfaces/projects';
import { CardAnncora } from '../components/ImgCardCredit/CardAnncora/CardAnncora';
import { CardGlobal } from '../components/ImgCardCredit/CardGlobal/CardGlobal';
import { RodapeBith } from '../components/DadosRodape/RodapeBith/RodapeBith';



const _cartaoDinamico = (nameProject: ProjectName) => {
	switch (nameProject) {
		case 'anncora':
			return <CardAnncora/>;
		case 'bithive':
			return ;
		case 'globalPay':
			return <CardGlobal/>;
		case 'itsPay':
			return '';
		default:
			return '';
	}
};

const rodapeDinamico = _cartaoDinamico(config.nameProject);

export default rodapeDinamico;

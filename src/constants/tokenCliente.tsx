import config from './project';
import { ProjectName } from '../interfaces/projects';

const isProd = process?.env?.PRODUCTION;

const _tokenCliente = (nameProject: ProjectName) => {
	/*
	switch (nameProject) {
		case 'anncora':
			return '71ae6cde-0a99-4db8-884f-fc78cf17b718';
		case 'bithive':
			return 'd4c9a74c-55a9-4315-a9a9-628bbd21fd03';
		case 'globalPay':
			return 'd110342f-c7aa-4d37-be56-4cc5de405132';
		case 'itsPay':
			return 'd47e5458-74ee-479e-9581-54f940ef333d';
		default:
			return '';

	}
	*/

	if (isProd) {
		switch (nameProject) {
			case 'anncora':
				return '8c6ad500-16b1-4b80-830e-5b3a0b3fdf0d';
			case 'bithive':
				return 'd4c9a74c-55a9-4315-a9a9-628bbd21fd03';
			case 'globalPay':
				return '52fca72e-cc8f-43b7-94e9-7384d6c1eccb';

			case 'itsPay':
				return 'd47e5458-74ee-479e-9581-54f940ef333d';
			default:
			return '';
		}
	} else {
		switch (nameProject) {
			case 'anncora':
				return '71ae6cde-0a99-4db8-884f-fc78cf17b718';
			case 'bithive':
				return 'd4c9a74c-55a9-4315-a9a9-628bbd21fd03';
			case 'globalPay':
				return 'd110342f-c7aa-4d37-be56-4cc5de405132';
			case 'itsPay':
				return 'd47e5458-74ee-479e-9581-54f940ef333d';
			default:
			return '';
		}
	}
};

const tokenCliente = _tokenCliente(config.nameProject);

export default tokenCliente;

/* eslint-disable prettier/prettier */
import { ProjectName } from '../interfaces/projects';
// eslint-disable-next-line no-undef
const project = process?.env?.PROJECT as ProjectName;

const config = {
	nameProject: project ?? 'bithive' as ProjectName,
};

export default config;

import React from 'react';
import config from '../constants/project';

// Usar a função getImg para importar imagens específicas de cada projeto, por exemplo:
// import getImg from '../assets';
// const img = getImg('logo.png');
// <img src={img} alt="Logo" />
// Não usar a função getImg para importar imagens que são compartilhadas entre os projetos, por exemplo:
const getImg = (parametro: string): any => {
	try {
		if (!parametro) return <></>;
		const img = require(`./${config?.nameProject}/${parametro}`);
		if (!img) {
			return <></>;
		} else {
			return img;
		}
	} catch (error) {
		return <></>;
	}
};

export default getImg;

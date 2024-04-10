export function camuflarDoc(documento: string) {

	// Verifica se o CPF tem o formato correto
	if (!/^\d{11}$/.test(documento)) {
		return documento;
	}

	const parteVisivel = documento.substring(0, 3);
	const parteMascarada = documento.substring(3, documento.length - 2).replace(/\d/g, '*');
	const parteOculta = documento.substring(documento.length - 2);

	return `${parteVisivel}${parteMascarada}${parteOculta}`;
};




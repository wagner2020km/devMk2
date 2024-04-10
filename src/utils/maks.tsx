export function formatarCPFeCNPJ(valor: string) {
	if (!valor) return valor;
	const documento = valor.replace(/\D/g, '');
	if (documento.length === 11) {
		return documento.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
	} else if (documento.length === 14) {
		return documento.replace(
			/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
			'$1.$2.$3/$4-$5'
		);
	} else {
		return valor;
	}
}

export function numeroParaReal(valor: number) {
	if (!valor) return 'R$ 0,00';
	return valor.toLocaleString('pt-br', {
		style: 'currency',
		currency: 'BRL',
	});
}

export function numeroParaRealSemSifrao(valor: number) {
	if (!valor) return '0,00';
	const valorFormatado = valor.toLocaleString('pt-br', {
		style: 'currency',
		currency: 'BRL',
	});

	const valorSemR = valorFormatado.replace('R$', '').trim();
	return valorSemR;
}

export function maskPhone(valor: string) {
	if (valor) {
		// let v = valor;
		//v = v.replace(/\D/g, "")
		//v = v.replace(/(\d{2})(\d)/, "($1) $2")
		//v = v .replace(/(\d{5})(\d{4})(\d)/, "$1-$2")
		const documento = valor.replace(/\D/g, '');
		return documento.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
		//	return v;
	} else {
		return '';
	}
}

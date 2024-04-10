/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
export function boletoMaskoleto(valor: string) {
	if (valor) {
		console.log(valor.length);
		if (valor.length >= 54) {
			//return '';
		} else {
			let v = valor;
			v = v.replace(/\D/g, '');
			v = v.replace(/(\d{5})(\d)/, '$1.$2');
			v = v.replace(/(\d{5})(\d)/, '$1 $2');
			v = v.replace(/(\d{5})(\d)/, '$1.$2');
			//v = v.replace(/(\d{5})(\d)/, '$7 $8');
			//v = v.replace(/(\d{5})(\d)/, '$9.$10');
			v = v.replace(/(\d{6})(\d)/, '$1 $2');
			v = v.replace(/(\d{5})(\d)/, ' $1.2');
			v = v.replace(/(\d{6})(\d)/, '$1 $2');
			v = v.replace(/(\d{1})(\d)/, ' $1 $2');
			v = v.replace(/(\d{14})(\d)/, '$1 $2');
			//  v = v.replace(/(\d{14})(\d)/, '');
			//v = v.replace(/(\d{5})(\d)/, '$1 $2');
			// v = v.replace(/(\d{5})(\d)/, '$1.$2');
			//  v = v.replace(/(\d{6})(\d)/, '$1 $2');
			//  v = v.replace(/(\d{5})(\d)/, '$1.$2');
			//  v = v.replace(/(\d{6})(\d)/, '$1.$2');
			//v = v.replace(/(\d{5})(\d)/, '$3 ');

			//v = v .replace(/(\d{5})(\d{4})(\d)/, "$1-$2")
			//const documento = valor.replace(/\D/g, '');
			return valor.replace(
				/(\d{5})(\d{5})(\d{5})(\d{6})(\d{5})(\d{6})(\d{1})(\d{14})/,
				'$1.$2 $3.$4 $5.$6 $7 $8'
			);
			// return v;
		}
	} else {
		return '';
	}
}

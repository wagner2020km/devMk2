/* eslint-disable prefer-destructuring */
export function validateCpf(cpf: string) {
	if (typeof cpf !== 'string') {
		return false;
	}
	let aux = cpf.split('.').join('');
	// @ts-ignore
	aux = aux.split('-');
	const digits = aux[0];
	const verifier = aux[1];
	if (verifier === undefined || verifier.length !== 2) {
		return false;
	}

	let sum = 0;
	for (let i = 0; i <= 8; i += 1) {
		sum += Number(digits[i]) * (10 - i);
	}

	let remainder = sum % 11;
	if (remainder < 2) {
		remainder = 0;
	} else {
		remainder = 11 - remainder;
	}

	const verifierDict = {
		0: 0,
		1: 1,
		2: 2,
		3: 3,
		4: 4,
		5: 5,
		6: 6,
		7: 7,
		8: 8,
		9: 9,
		X: 10,
		x: 10,
	};
	const verifier0 = verifierDict[verifier[0]];
	if (verifier0 === undefined) {
		return false;
	}

	const verifier1 = verifierDict[verifier[1]];
	if (verifier1 === undefined) {
		return false;
	}
	if (remainder !== verifier0) {
		return false;
	}

	let sum2 = 0;
	for (let i = 0; i <= 8; i += 1) {
		// @ts-ignore
		sum2 += digits[i] * (11 - i);
	}
	sum2 += verifier0 * 2;
	let remainder2 = sum2 % 11;
	if (remainder2 < 2) {
		remainder2 = 0;
	} else {
		remainder2 = 11 - remainder2;
		remainder2 = remainder2 === 10 ? 0 : remainder2;
	}
	if (remainder2 !== verifier1) {
		return false;
	}
	return true;
}

export function validateCnpj(s: string) {
	if (s === undefined) return false;
	const cnpj = s.replace(/[^\d]+/g, '');

	if (cnpj.length !== 14) return false;

	if (/^(\d)\1+$/.test(cnpj)) return false;

	const t = cnpj.length - 2;
	const d = cnpj.substring(t);
	const d1 = parseInt(d.charAt(0));
	const d2 = parseInt(d.charAt(1));
	const calc = (x: number) => {
		const n = cnpj.substring(0, x);
		let y = x - 7;
		let s = 0;
		let r = 0;

		for (let i = x; i >= 1; i--) {
			// @ts-ignore
			s += n.charAt(x - i) * y--;
			if (y < 2) y = 9;
		}

		r = 11 - (s % 11);
		return r > 9 ? 0 : r;
	};

	return calc(t) === d1 && calc(t + 1) === d2;
}

export function validateEmail(email: string) {
	if (
		typeof email !== 'string' ||
		email.length < 4 ||
		!email.includes('@') ||
		!email.includes('.')
	) {
		return false;
	}
	return true;
}

interface ValidarDataNascimento {
	valid: boolean;
	message: string;
}

export function validarDataNascimento(data: string): ValidarDataNascimento {
	if (typeof data !== 'string' || data.length < 10) {
		return {
			valid: false,
			message: 'Data inválida.',
		};
	}
	const regex = /^\d{2}\/\d{2}\/\d{4}$/;
	if (!regex.test(data)) {
		return {
			valid: false,
			message: 'Data inválida.',
		};
	}

	const partes = data.split('/');
	const dia = parseInt(partes[0], 10);
	const mes = parseInt(partes[1], 10);
	const ano = parseInt(partes[2], 10);

	if (isNaN(dia) || isNaN(mes) || isNaN(ano)) {
		return {
			valid: false,
			message: 'Data inválida.',
		};
	}

	if (dia < 1 || dia > 31 || mes < 1 || mes > 12) {
		return {
			valid: false,
			message: 'Data inválida.',
		};
	}

	const dataNascimento = new Date(ano, mes - 1, dia);
	if (
		dataNascimento.getFullYear() !== ano ||
		dataNascimento.getMonth() !== mes - 1 ||
		dataNascimento.getDate() !== dia
	) {
		return {
			valid: false,
			message: 'Data inválida.',
		};
	}

	// Verificar se a pessoa tem pelo menos 18 anos
	const hoje = new Date();
	const idadeMinima = new Date(
		hoje.getFullYear() - 18,
		hoje.getMonth(),
		hoje.getDate()
	);
	if (dataNascimento > idadeMinima) {
		return {
			valid: false,
			message: 'Data inválida.',
		};
	}

	return {
		valid: true,
		message: '',
	};
}

export const verificarNomeCompleto = (nomeCompleto: string) => {
	if (!nomeCompleto || typeof nomeCompleto !== 'string') {
		return false;
	}
	const nomes = nomeCompleto?.trim()?.split(' ');
	if (nomes.length < 2) {
		return false;
	}
	for (let i = 0; i < nomes.length; i++) {
		if (!nomes[i] || nomes[i].length < 2) {
			return false;
		}
	}
	return true;
};

export const verificaEmail = (email: string) => {
	if (!email || typeof email !== 'string') {
		return false;
	}
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return emailRegex.test(email);
};


export const verificaForcaSenha = (senha: string) => {
	if (!senha || typeof senha !== 'string') {
		return false;
	}
	const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%!^&*()]).{10,}$/;
	console.log(regex.test(senha));
	return regex.test(senha);
};

/*
export const verificaForcaSenha = (senha: string) => {
	if (!senha || typeof senha !== 'string') {
		return "Por favor, forneça uma senha válida.";
	}

	const requisitos = [
		{ nome: 'letra minúscula', regex: /[a-z]/ },
		{ nome: 'letra maiúscula', regex: /[A-Z]/ },
		{ nome: 'dígito', regex: /\d/ },
		{ nome: 'caractere especial', regex: /[@#$%!^&*()]/ },
		{ nome: 'mínimo 10 caracteres', regex: /.{10,}/ },
	];

	const requisitosNaoAtendidos = requisitos.filter(({ regex }) => !regex.test(senha));

	if (requisitosNaoAtendidos.length === 0) {
		return "200";
	}

	const mensagensFalta = requisitosNaoAtendidos.map(({ nome }) => `Falta ${nome.toLowerCase()}`).join(', ');

	return mensagensFalta;
};
*/
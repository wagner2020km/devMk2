import { validateCpf, validateCnpj } from '../../validacoes/validarMascaras';

export const cpfMask = (value: string) => {
	if (value) {
		return value
			.replace(/\D/g, '')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d{1,2})/, '$1-$2')
			.replace(/(-\d{2})\d+?$/, '$1')
			.replace(/(\d{2})' '\d+?$/, '$1');
	} else {
		return '';
	}
};

export const cnpjMask = (value: string) => {
	if (value) {
		return value
			.replace(/\D/g, '')
			.replace(/(\d{2})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d)/, '$1/$2')
			.replace(/(\d{4})(\d)/, '$1-$2')
			.replace(/(-\d{4})\d+?$/, '$1');
		//.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
	} else {
		return '';
	}
};

export const moneyMask = (value: string) => {
	
	if (value) {
		//if(typeof value === "undefined" || value == '')
		// return 0;

		let valor = '';

		if (typeof value !== 'undefined') {
			valor = value;
		} else {
			valor = value;
		}

		if (valor.length == 2) {
			return valor;
		}
		let v = valor;
		v = v.replace(/\D/g, '');
		v = v.replace(/(\d{1,2})$/, ',$1');
		v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
		return v;
	} else {
		return '';
	}
	
	
};

export const moneyMaskNumber = (value: number) => {
	return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  
  export const moneyMaskNumberSerBrl = (value: number) => {
	 // Remove caracteres não numéricos, exceto ponto decimal
	 const numericValue = String(value).replace(/[^0-9.]/g, '');

	 
    // Verifica se o valor é um número válido
    const parsedValue = parseFloat(numericValue);
    if (isNaN(parsedValue)) {
      return ''; // Retorna uma string vazia se não for um número válido
    }

    // Arredonda o valor para duas casas decimais
    const roundedValue = parsedValue.toFixed(2);

    // Separa a parte inteira e a parte decimal
    const [integerPart, decimalPart] = roundedValue.split('.');

    // Adiciona vírgulas como separador de milhar
    const integerWithCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Formata o valor final com vírgula como separador decimal
    const formattedCurrency = `${integerWithCommas}.${decimalPart}`;

    return formattedCurrency;
  };
export const prrintValorMonetario = (value: string) => {
	if (value) {
        let valor = value.replace(',', ''); // Remover qualquer vírgula existente para garantir que ela não seja considerada como separador decimal
        let parts = valor.split('.'); // Separar a parte inteira da parte decimal
        let integerPart = parts[0] || ''; // Parte inteira (antes do ponto)
        let decimalPart = parts[1] || ''; // Parte decimal (após o ponto)

        // Formatando a parte inteira
        integerPart = integerPart.replace(/\D/g, ''); // Remover caracteres não numéricos
        integerPart = integerPart.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'); // Adicionar ponto a cada 3 dígitos

        // Se não houver parte decimal ou se houver apenas um dígito na parte decimal, adicionar zero à direita
        if (!decimalPart || decimalPart.length === 1) {
            decimalPart = decimalPart.padEnd(2, '0');
        }

        return `${integerPart},${decimalPart}`; // Combinar parte inteira e parte decimal com vírgula
    } else {
        return '';
    }
};

export const formaTavalorCelcoin = (value: string) => {
	if (value) {
		return value.replace(/[^0-9,]*/g, '').replace(',', '.');
		//.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
	} else {
		return '';
	}
};

export const formaTavalorCelcoinInverso = (value: string) => {
	if (value) {
		return value.replace(/[^0-9,]*/g, '').replace('.', ',');
		//.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
	} else {
		return '';
	}
};

export const formaTarInteiroParaDecimal = (value: number) => {
	console.log('valot inteiro', value)
	if (value) {
		const numeroFormatado = value.toLocaleString('pt-BR', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		  });
		  return numeroFormatado
	} else {
		return '';
	}
};

export const formataVirgulaAdireita = (value: string) => {
	let  newValue = '';
		if (value) {
			 newValue =  value.replace(/[^0-9,]*/g, '').replace(',', '.');
			//.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
			return parseInt(newValue.replace(/[.,]/g, ''));
		} else {
			return '';
		}
	

};

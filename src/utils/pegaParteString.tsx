export function getParteString(stringParse: string, tamanho: number) {
	console.log(stringParse);
	
	const str = stringParse;
	//const retornaParteDaString = str.substring(0, 3);
	//const str = 'Exemplo de uma string';
	let parteDaString;
  
	if (str) { // Verifica se str é definido e não é null ou undefined
	  parteDaString = str.substring(0, tamanho); // Extrai os primeiros 7 caracteres da string
	} else {
	  parteDaString = ''; // Define uma string vazia caso str seja null ou undefined
	}

	return parteDaString;
}



/**
 * Busca de forma segura por um atributo em um objeto, dado um caminho de propriedades.
 * @param obj O objeto a ser pesquisado.
 * @param propriedades O caminho das propriedades a serem buscadas.
 * @param valorPadrao (opcional) O valor padrão a ser retornado caso a propriedade não seja encontrada.
 * @returns O valor da propriedade encontrada ou o valor padrão, caso fornecido, ou undefined.
 */
type ObjectType = { [key: string]: any };

function getPropSegura(
	obj: ObjectType,
	propriedades: string[],
	valorPadrao?: any
): any {
	let currentObj: ObjectType = obj;

	for (const propriedade of propriedades) {
		if (Object?.prototype?.hasOwnProperty?.call(currentObj, propriedade)) {
			currentObj = currentObj[propriedade];
		} else {
			return valorPadrao !== undefined ? valorPadrao : undefined;
		}
	}

	return currentObj;
}

export default getPropSegura;

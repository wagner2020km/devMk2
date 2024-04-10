import { useState } from 'react';

/**
 * Hook personalizado para forçar a atualização de um componente no React.
 * @returns {Function} Função para forçar a atualização da tela.
 */
export function useForceUpdate(): Function {
	const [, setTick] = useState(0);

	/**
	 * Função para forçar a atualização da tela.
	 * Chame esta função sempre que você quiser forçar a renderização do componente.
	 */
	const forceUpdate = () => setTick((tick) => tick + 1);

	return forceUpdate;
}

/**  exemplo de uso:
const forceUpdate = useForceUpdate();
	...
forceUpdate();
*/

export default useForceUpdate;

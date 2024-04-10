/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */


export const seachCnpj = async (documento) => {
    const url = `https://brasilapi.com.br/docs#tag/CNPJ/paths/~1cnpj~1v1~1{17454999000141}/get`;
	console.log('dados para pagamento ', documento);
	
	try {
		
		const response = await fetch(url);
		console.log('Cnpj', response);
		return response;
	} catch (error) {
		console.log(error);
		return {
			error: error?.response?.status,
			data: error?.response?.data,
			status: error?.response?.status,
		};
	}
};

import axios from 'axios';

export const getAddressByCep = async (inputValue: string) => {
	try {
		const response = await axios.get(
			`https://viacep.com.br/ws/${inputValue}/json/`
		);
		return response;
	} catch (error) {
		return {
			error: error?.response?.status,
			data: error?.response?.data,
			status: error?.response?.status,
		};
	}
};


import { setupAPIClient } from '../../services/api';
const apiClient = setupAPIClient();
import { AxiosError } from 'axios';

type consltaProps ={
	numeroConta: string;
	
}
type loginTemp ={
	usuario: string;
	senha: string;
	
}

async function getLoginTemp({usuario, senha}:loginTemp ) {
	console.log('data login temporario usuario',usuario)
	console.log('data login temporario senha',senha)
	try {
		const response = await apiClient.post('/login', {
		  usuario: usuario,
		  senha: senha
		})
	   // console.log('dados Acesso', response)
		const { token } = response.data;
		console.log('pegar token aqui', token);
		const { nome_completo, numero_documento, conta, tipo_conta, telefone, email, tipo_auth_transacao, perfil_id } = response.data.usuario_conta;
  
		const data = {
		  ...response.data
		}
	
		apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
	
		//navigate('home')
		return response.data

		
	  } catch (error) {
		console.log('error ao acessar', error.response)
		
	  }
  
}
export default getLoginTemp;





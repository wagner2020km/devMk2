/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import React from 'react';
// import { setupAPIClient } from '../services/api';
// import { AxiosError } from 'axios';

type TypePropValida = {
	chavePix: string;
	campoChave: string;
};

async function GeraTokenChavePix({
	chavePix,
	campoChave,
	...rest
}: TypePropValida): Promise<void> {
	console.log('estou dentro da função externa a chave é', rest);
	/*
    const apiClient = setupAPIClient();
    let dadosValidaEmail = {
        "email": chavePix,
        "token": codeToken
    }
console.log('Json',dadosValidaEmail)
    try {

        const response = await apiClient.post(`/validacao/validar-token`, dadosValidaEmail);
        console.log('Chave Validada', response.data)
        return response
    } catch (error) {

        if(error instanceof AxiosError){


        return error
        }else{
            return error

        }

       // console.log('erro geral',error)
        switch (error.response.data.data.status) {
            case 422:
                return 'Código invalido'
                break;

                case 400:
                    return 'Código invalido'
                    break;
            default:
                return 'teste undefined'
                break;
           }
    }
    */
}
export default GeraTokenChavePix;

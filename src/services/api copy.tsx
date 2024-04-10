import React, { useContext } from 'react';
import axios, { AxiosError } from 'axios';
import { parseCookies } from 'nookies';

import tokenCliente from '../constants/tokenCliente';
import apiCliente from '../constants/apiCliente';

import { AuthTokenError } from './errors/AuthTokenError';

import { AuthContext } from '../contexts/AuthContext';

export function setupAPIClient(ctx = undefined) {
	const cookies = parseCookies(ctx);

	console.log('context co cookies', cookies)
	//const { signOut } = useContext(AuthContext);
	console.log('TOKEN API', cookies['@nextauth.token'])
	const api = axios.create({
		baseURL: apiCliente,
		headers: {
			'Access-Control-Allow-Origin': '*',
			token_cliente: tokenCliente,
			//Authorization: `Bearer ${cookies['@nextauth.token']}`,
		
		},
	});
	api.interceptors.request.use((config) => {
		config.headers.Authorization = `Bearer ${cookies['@nextauth.token']}`;
		return config;
	  });
	api.interceptors.response.use(
		(response) => {
			// eslint-disable-next-line no-undef
			if (process.env.NODE_ENV === 'development') {
				if (response.config.method) {
					console.log(
						'Request:',
						'method',
						response.config.method,
						'url',
						response.config.url,
						response
					);
				} else {
					console.log('Response:', 'url', response.config.url, response);
				}
			}
			return response;
		},
		(error: AxiosError) => {
			console.log('ERRO INTERCEPTOR', error.response.status)
			if (error.response.status === 401) {
				
				// qualquer erro 401 (não autorizado) deslogar usuário
				if (typeof window !== undefined) {
					// chamar função para deslogar usuário
					//signOut();
				} else {
					return Promise.reject(new AuthTokenError());
				}
			}
			return Promise.reject(error);
		}
	);

	return api;
}
/*

export function setupAPIClient(ctx = undefined) {
	const cookies = parseCookies(ctx);
  
	const api = axios.create({
	  baseURL: apiCliente,
	  headers: {
		'Access-Control-Allow-Origin': '*',
		token_cliente: tokenCliente,
		Authorization: `Bearer ${cookies['@nextauth.token']}`,
	  },
	});
  
	api.interceptors.request.use((config) => {
	  // Update the Authorization header with the latest token from cookies
	  config.headers.Authorization = `Bearer ${cookies['@nextauth.token']}`;
	  return config;
	});
  
	api.interceptors.response.use(
	  (response) => {
		// Your existing response interceptor code
		// ...
		return response;
	  },
	  (error: AxiosError) => {
		// Your existing error interceptor code
		// ...
		return Promise.reject(error);
	  }
	);
  
	return api;
  }
  */
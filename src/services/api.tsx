import React, { useContext } from 'react';
import axios, { AxiosError } from 'axios';
import { parseCookies } from 'nookies';

import tokenCliente from '../constants/tokenCliente';
import apiCliente from '../constants/apiCliente';
import Router from 'next/router';
import { AuthTokenError } from './errors/AuthTokenError';

import { AuthContext } from '../contexts/AuthContext';

const getCookieActual = () => {
	const updatedCookies = parseCookies(undefined);
	const updatedToken = updatedCookies['@nextauth.token'];
	return updatedToken;
};

export function setupAPIClient(ctx = undefined) {
	const api = axios.create({
		baseURL: apiCliente,
		headers: {
			'Access-Control-Allow-Origin': '*',
			token_cliente: tokenCliente,
			//Authorization: `Bearer ${getCookieActual()}`,
		},
	});

	 api.interceptors.request.use(
	 	(config) => {
	 		const updatedCookies = parseCookies(ctx);
	 		const updatedToken = updatedCookies['@nextauth.token'];
	 		if (updatedToken) {
	 			config.headers['Authorization'] = `Bearer ${updatedToken}`;
	 		}
	 		return config;
	 	},
	 	(error) => {
	 		return Promise.reject(error);
	 	}
	 );

	api.interceptors.response.use(
		async (response) => {
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
			
			if (error.response.status === 401 && error?.response?.statusText == "Unauthorized") {
				//Router.push('/');
	
				if (typeof window !== undefined) {
					// chamar função para deslogar usuário
					// signOut();
				} else {
					return Promise.reject(new AuthTokenError());
				}
			}
			return Promise.reject(error);
		}
	);

	return api;
}


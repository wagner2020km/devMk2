/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
import React from 'react';
import { createContext, ReactNode, useState } from 'react';

import { toast } from 'react-toastify';
import { destroyCookie, setCookie } from 'nookies';
import Router from 'next/router';
import { AxiosError } from 'axios';
import { useDispatch } from 'react-redux';

import {
	setUserData,
	reset as resetDataUser,
} from '../redux/actions/userActions';

import { resetSaldoData } from '../redux/actions/saldoActions';
import { resetUserRegisterData } from '../redux/actions/userRegisterActions';

import { api } from '../services/apiClient';

type UserProps = {
	id: string;
	name: string;
	email: string;
	codinstituicao: string;
	perfilid: string;
	numeroConta: string;
	tipoConta: string;
	telefone: string;
	docCliente: string;
	tipo_auth_transacao: string;
	situacao: string;
	nomeSituacao: string;
};

type SignInProps = {
	email: string;
	password: string;
};

type AuthContextData = {
	user: UserProps | undefined;
	isAuthenticated: boolean;
	signIn: ({ email, password }: SignInProps) => Promise<void>;
	signOut: () => void;
};

type AuthProviderProps = {
	children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
	
	const dispatch = useDispatch();
	const [user, setUser] = useState<UserProps>();
	const isAuthenticated = !!user;

	function signOut() {
	
		try {
			dispatch(resetSaldoData());
			dispatch(resetDataUser());
			dispatch(resetUserRegisterData());
			destroyCookie(undefined, '@nextauth.token');
			setCookie(undefined, '@nextauth.token', '', {
				maxAge: 1, // 1 second, or any short duration
				path: '/',
			  });
			Router.push('/');
		} catch (e) {
			console.log('erro ao deslogar');
		}
	}

	async function signIn({ email, password }: SignInProps) {
		const id = toast.loading('Aguarde...', { position: 'top-center' });
		toast.update(id, {
			render: 'Conectando...',
			type: 'info',
			isLoading: true,
			position: 'top-center',
			theme: 'colored',
		});

		const dados = {
			usuario: email,
			senha: password,
		};

		try {
			const response = await api.post('/login', dados);
			const { token, expire_in } = response.data;
		
		
			setCookie(undefined, '@nextauth.token', token, {
				maxAge: expire_in,
				path: '/',
			});
			
		
			let nomeUser = '';
			if (response.data.nome != '') {
				nomeUser = response.data.usuario_conta.nome;
				const tmp = nomeUser.split(' ');
				if (tmp[0] != '' && tmp[1] != '') {
					nomeUser = `${tmp[0]} ${tmp[1]}`;
					let sobreNomeUser = tmp[1];
					const tmp1 = sobreNomeUser.length;
					sobreNomeUser = tmp1[0];
					//nomeUser = `${tmp[0]} ${tmp[1][0]}`;
					nomeUser = `${tmp[0]}`;
				}
			}

			setUser({
				id: response.data.usuario_conta.id,
				name: nomeUser,
				email: response.data.usuario_conta.email,
				codinstituicao: response.data.usuario_conta.codinstituicao,
				perfilid: response.data.usuario_conta.perfil_id,
				numeroConta: response.data.usuario_conta.conta,
				tipoConta: response.data.usuario_conta.tipo_conta,
				telefone: response.data.usuario_conta.telefone,
				docCliente: response.data.usuario_conta.numero_documento,
				tipo_auth_transacao: response.data.usuario_conta.tipo_auth_transacao,
				situacao: response.data.usuario_conta.situacao.sigla,
				nomeSituacao: response.data.usuario_conta.situacao.nome,
			});

			dispatch(
				setUserData({
					id: response.data.usuario_conta.id,
					name: nomeUser,
					email: response.data.usuario_conta.email,
					codinstituicao: response.data.usuario_conta.codinstituicao,
					perfilid: response.data.usuario_conta.perfil_id,
					numeroConta: response.data.usuario_conta.conta,
					tipoConta: response.data.usuario_conta.tipo_conta,
					telefone: response.data.usuario_conta.telefone,
					docCliente: response.data.usuario_conta.numero_documento,
					tipo_auth_transacao: response.data.usuario_conta.tipo_auth_transacao,
					situacao: response.data.usuario_conta.situacao.sigla,
					nomeSituacao: response.data.usuario_conta.situacao.nome,
				})
			);

			toast.update(id, {
				render: `Bem vindo`,
				type: 'success',
				isLoading: false,
				position: 'top-center',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: 'colored',
			});
			switch (response.data.usuario_conta.situacao.sigla) {
				case 'pac':
					Router.push('/aguardando');
					break;

					case 'pedi':
						Router.push('/aguardando');
						break;
			
				default:
					Router.push('/home');
					break;
			}
			
			
		} catch (error) {
			let menssageErro = '';
			if (error instanceof AxiosError) {
				if (error.response.data === 'Unauthorized') {
					menssageErro = 'Usuário ou senha inválidos';
				} else {
					menssageErro = error.message;
				}
			} else {
				menssageErro = error.message;
			}
			toast.update(id, {
				render: `${menssageErro}`,
				type: 'error',
				isLoading: false,
				position: 'top-center',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: 'colored',
			});
			console.log('ERRO AO ACESSAR', error);
		}
	}
	return (
		<AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
			{children}
		</AuthContext.Provider>
	);
}

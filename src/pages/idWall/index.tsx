import React, { useState, useEffect, CSSProperties, useContext } from 'react';
import { useRouter } from 'next/router';
import Router from 'next/router';
import { destroyCookie, setCookie, parseCookies } from 'nookies';
import { AuthContext } from '../../contexts/AuthContext';
import ContainerCadastro from '../../layout/ContainerCadastro';
import getLoginTemp from '../../api/loginTemp'
import config from '../../../config';

import {
	registroTokenIdWallCpf,
	registroTokenIdWallCnpj,
} from '../../api/cadastro';

const styles = {
	mensagem: {
		textAlign: 'center',
		backgroundColor: '#ffffff',
		border: '1px solid #dddddd',
		borderRadius: '5px',
		padding: '20px',
		margin: '50px auto',
		maxWidth: '400px',
		boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
	} as CSSProperties,
	titulo: {
		color: '#0fa49b',
	} as CSSProperties,
	paragrafo: {
		color: '#666666',
	} as CSSProperties,
};

export default function IdWall() {
	const router = useRouter();
	const { signIn } = useContext(AuthContext);
	const [finish, setFinish] = useState(false);
	const [stateToken, setstateToken] = useState('');
	const { cpf, cnpj } = router.query;

	const loginTemp = () => {

	}
	useEffect(() => {

		// @ts-ignore
		if (!window.idwSDKWeb) {
			const script = document.createElement('script');
			script.src = 'https://sdkweb-lib.idwall.co/index.js';
			script.async = true;
			document.head.appendChild(script);

			script.onload = () => {
				iniciarIdwSDKWeb();
			};

			script.onerror = () => {
				console.error('Erro ao carregar a biblioteca idwSDKWeb.');
			};
		} else {
			iniciarIdwSDKWeb();
		}
	}, []);

	const iniciarIdwSDKWeb = async () => {
		let tempTokenBare = ''
		const cookies = parseCookies();
		let responseRegister = 400;

		//console.log('PRODUÇÃO SIM OU NÃO', config.PRODUCTION)
		// @ts-ignore
		//? 'U2FsdGVkX1+dMLmwxRWrrC/Kg65AcofKam3EXaqvDL7J42H3tA=='
		//		: 'U2FsdGVkX192QKnf3e8rRnz8Jc44XHZbecu/Pi2UUlli+xljzA==',
		//token: config.PRODUCTION
		//? 'U2FsdGVkX1/A7aTOJEq3WH3WC1qTeGoVgXhXcip4ATwnTo0oGw=='
		//: 'U2FsdGVkX1+DIQf7ikAgf7bGSwbksL4u98eIAaUHdZAZwD0B4g==',

		window.idwSDKWeb({
			token: config.PRODUCTION
				? 'U2FsdGVkX1/A7aTOJEq3WH3WC1qTeGoVgXhXcip4ATwnTo0oGw=='
				: 'U2FsdGVkX1+DIQf7ikAgf7bGSwbksL4u98eIAaUHdZAZwD0B4g==',

			onRender: () => { },
			onComplete: async ({ token }) => {

				// Desserializando os dados (convertendo de volta para objeto)
				const cookieData = JSON.parse(cookies['@nextauth.dadosTemp']);

				const email = cookieData.emailTemp;
				const senha = cookieData.senhaTemp
				const dadosLoginTemp = {
					usuario: cookieData.emailTemp,
					senha: cookieData.senhaTemp
				}

				const responseLogin = await getLoginTemp(dadosLoginTemp);
				if (responseLogin.status == 200) {
					const { bareToken, expire_in } = responseLogin.data;
					tempTokenBare = bareToken;
					setstateToken(bareToken)
					console.log(bareToken)
					setCookie(undefined, '@nextauth.token', bareToken, {
						maxAge: expire_in,
						path: '/',
					});
				}
				// Agora você pode acessar os dados como um objeto
				//console.log('Dados do cookie:', cookieData);

				if (typeof cnpj === 'string' && cnpj) {
					const responseCnpj = await registroTokenIdWallCnpj(
						token,
						typeof cnpj === 'string' && cnpj ? cnpj : ''
					);
					if (responseCnpj?.status == 200) {
						responseRegister = responseCnpj.status;
					}
					//console.log('Dados do cookie:', responseRegister, '', responseCnpj);
				} else if (typeof cpf === 'string' && cpf) {
					const responseCpf = await registroTokenIdWallCpf(
						token,
						typeof cpf === 'string' && cpf ? cpf : ''
					);
					if (responseCpf?.status == 200) {
						responseRegister = responseCpf.status;
					}
				
				}
				
				if (responseRegister == 200) {
					const data = {
						email: cookieData.emailTemp,
						password: cookieData.senhaTemp,
					};
					try {
						await signIn(data);
						//setFinish(true);
					} catch (err) {
						console.log(err);
						setFinish(true);
						Router.push('/');
					} 
				} else {
					setTimeout(() => {
						Router.push('/');

					}, 15000);
				}

			},
			onError: (error) => {
				alert(error);
			},
		});
	};

	return (
		<ContainerCadastro childrenStyle={{ minWidth: 340 }}>
			{!finish ? (
				<div data-idw-sdk-web></div>
			) : (
				<div>
					<div style={styles.mensagem}>
						<h2 style={styles.titulo}>Cadastro finalizado com sucesso!</h2>
						<br></br>
						<p style={styles.paragrafo}>
							O seu cadastro foi concluído com sucesso. Agradecemos por se
							cadastrar.
						</p>
					</div>
				</div>
			)}
		</ContainerCadastro>
	);
}

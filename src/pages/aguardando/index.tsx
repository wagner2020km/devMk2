/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from 'react';

import Link from 'next/link';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import ContainerProcess from '../../layout/ContainerProcess';
import { destroyCookie, setCookie, parseCookies } from 'nookies';
import { ToastOptions, toast } from 'react-toastify';
import Router from 'next/router';
import { Minicards } from '../../components/MiniCads/MiniCards';
import { AuthContext } from '../../contexts/AuthContext';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { formatarCPFeCNPJ } from '../../utils/maks'
import CartoesIcon from '../../lib/bibliotecaBit/icons/CartoesIcon';
import { Buttom, ButtomWarning } from 'components/ui/Buttom';
import IconsBith from '../../lib/IconsBith/';
import config from '../../../config';
import Loading from '../../components/Loading';
import {
	registroTokenIdWallCpfLogado,
	registroTokenIdWallCnpjLogado,
} from '../../api/cadastro';
import styles from './styles.module.scss';
const toastConfig: ToastOptions<{}> = {
	position: 'top-center',
	autoClose: 3000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: false,
	draggable: true,
	progress: undefined,
	theme: 'colored',
};

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
	height: 10,
	borderRadius: 5,
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 5,
		backgroundColor: theme.palette.mode === 'light' ? '#248a4e' : '#248a4e',
	},
	[`& .${linearProgressClasses.determinate}`]: {
		// Certifique-se de que o valor da largura seja definido
		width: '50%', // Defina o valor desejado
	},
}));

export default function aguardando() {
	const { signOut } = useContext(AuthContext);
	const router = useRouter();
	const cookies = parseCookies();
	const user = useSelector((state: any) => state.userReducer.user);
	const saldo = useSelector((state: any) => state.saldoReducer.saldo);
	const [isLoading, setIsLoading] = useState(false);
	const [situacaoConta, setSituacaoConta] = useState(0);
	const [callIdwall, setCallIdwal] = useState(false);
	function handleRedirect(paramRedirect: string) {
		setIsLoading(true);
		Router.push(paramRedirect);
	}

	function handleSingOut() {
		signOut();
	}

	useEffect(() => {
		
		// @ts-ignore
		if (!window.idwSDKWeb && callIdwall == true) {
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
			//iniciarIdwSDKWeb();
		}
	}, [callIdwall]);

	const iniciarIdwSDKWeb = async () => {
		const cookies = parseCookies();

		const tokenBare = cookies['@nextauth.token'];
		console.log('token aqui', tokenBare)
		// @ts-ignore
		//? 'U2FsdGVkX1+dMLmwxRWrrC/Kg65AcofKam3EXaqvDL7J42H3tA=='
		//		: 'U2FsdGVkX192QKnf3e8rRnz8Jc44XHZbecu/Pi2UUlli+xljzA==',
		//token: config.PRODUCTION
		//? 'U2FsdGVkX1/A7aTOJEq3WH3WC1qTeGoVgXhXcip4ATwnTo0oGw=='
		//: 'U2FsdGVkX1+DIQf7ikAgf7bGSwbksL4u98eIAaUHdZAZwD0B4g==',

		window.idwSDKWeb({
			token: config.PRODUCTION
				? 'U2FsdGVkX1+DIQf7ikAgf7bGSwbksL4u98eIAaUHdZAZwD0B4g=='
				: 'U2FsdGVkX1+DIQf7ikAgf7bGSwbksL4u98eIAaUHdZAZwD0B4g==',

			onRender: () => { },
			onComplete: async ({ token }) => {

				//
				// Agora você pode acessar os dados como um objeto


				if (user.tipoConta === 'PF' && user.tipoConta) {
					await registroTokenIdWallCpfLogado(
						token,
						typeof user.docCliente === 'string' && user.docCliente ? user.docCliente : ''
					);
					toast.success('Envio de documentação efetuado com sucesso volte mais tarde', toastConfig);
				} else if (user.tipoConta === 'PJ' && user.tipoConta) {
					await registroTokenIdWallCnpjLogado(
						token,
						typeof user.docCliente === 'string' && user.docCliente ? user.docCliente : ''
					);
					toast.success('Envio de documentação efetuado com sucesso volte mais tarde', toastConfig);
				}
			
				//setFinish(true);
				setTimeout(() => {
					//Router.push('/');
					//router.reload();
					handleSingOut();
					
				}, 3000);
			},
			onError: (error) => {
				alert(error);
			},
		});
	};

	useEffect(() => {
		
		switch (user?.situacao) {
			case 'pedi':
				setSituacaoConta(20);
				break;

			case 'pac':
				setSituacaoConta(50);
				break;

			case 'cnap':
				setSituacaoConta(100);
				break;

			case 'docr':
				setSituacaoConta(100);
				break;

			default:
				break;
		}
	}, [])
	return (
		<ContainerProcess>
			<div className={styles.dadosContainerBody}>
				{callIdwall == true ? (
					<div data-idw-sdk-web></div>
				) : (
					<div className={styles.dadosContainerLeft}>
						<div className={styles.titleContainer}>
							<CartoesIcon size={23} color="#000" />
							<h3>Abertura de contas</h3>
						</div>
						<div className={styles.divCard}>
							<BorderLinearProgress
								variant="determinate"
								value={situacaoConta}
								placeholder="asdsdds"
							/>
							<div className={styles.labelProgress}>
								<span>{situacaoConta}%</span>
							</div>
							<div className={styles.containerBemVindo}>
								<div className={styles.dadosUser}>
									<h4>Olá! {user?.name}</h4>
									<p>Sua conta está no status{user?.nomeSituacao}, volte mais tarde para conferir o novo estatus</p>
									<Buttom type="button"
										onClick={handleSingOut}
										loading={false}
									>
										SAIR
									</Buttom>
									{/*
										<Buttom
										type="button"
										onClick={() => {
											//iniciarIdwSDKWeb()
											setCallIdwal(true)
										}}
										loading={false}
									>
										Enviar Documentação
									</Buttom>
				*/}
								
									{user?.situacao == 'pedi' && (
										<Buttom
										type="button"
										onClick={() => {
											//iniciarIdwSDKWeb()
											setCallIdwal(true)
										}}
										loading={false}
									>
										Enviar Documentação
									</Buttom>
									)}
								</div>

								<div className={styles.containerServicos}>
									<h2>Nossos serviços</h2>
									<div className={styles.divAcoes}>

										<Minicards
											nomeIcon={IconsBith.ICONBITH.transferir}
											tituloCard="Transferir"
											caminhoRef="/transferencia"
											enable={true}
											onClick={() => {
												//handleRedirect('/transferencia');
											}}
										/>
										<Minicards
											nomeIcon={IconsBith.ICONBITH.pagar}
											tituloCard="Pagar"
											caminhoRef="/cadastrarConta"
											enable={true}
										/>
										<Minicards
											nomeIcon={IconsBith.ICONBITH.depositar}
											tituloCard="Depositar"
											caminhoRef="/cadastrarConta"
											enable={true}
										/>
										<Minicards
											nomeIcon={IconsBith.ICONBITH.recarga}
											tituloCard="Recarga"
											caminhoRef="/cadastrarConta"
											enable={true}
										/>
										<Minicards
											nomeIcon={IconsBith.ICONBITH.cobrar}
											tituloCard="Cobrar"
											caminhoRef="/cadastrarConta"
											enable={true}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
			<Loading isLoading={isLoading} />
		</ContainerProcess>
	);
}

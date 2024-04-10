import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { useSelector } from 'react-redux';
import { Buttom } from '../../components/ui/Buttom';
import Container from '../../layout/Container';
import { connect } from 'react-redux';
import { Minicards } from '../../components/MiniCads/MiniCards';
import { Spinner } from '../../components/Spinner/Spinner';
import Link from 'next/link';
import Router from 'next/router';
import { smsOuEmail, veryFiWatZapPhone, sendTokenWatZap } from '../../api/validacaoTelefoneEmail';
import { ToastOptions, toast } from 'react-toastify';
import { AiOutlineKey } from 'react-icons/ai';
import { editarSenha } from '../../api/editarSenha';
import PageButtons from './PageButtons';
import { AxiosError } from 'axios';
import typePayment from '../../constants/typeValidationPayment'
import {
	validarDataNascimento,
	verificaEmail,
	verificaForcaSenha,
} from '../../validacoes/validarMascaras';
import {
	regiterAccount,
	regiterAccountCompany,
	sendCodeVerification,
	verifyCode,
} from '../../api/cadastro';
import {
	resetUserRecouverData,
	setUserRecouverField,
} from '../../redux/actions/userRecouverActions';

import IconsBith from '../../lib/IconsBith/';
import Pix from '../../lib/bibliotecaBit/icons/Pix';
import Pagar from '../../lib/bibliotecaBit/icons/Pagar';

import getPropSegura from '../../utils/getPropSegura';
import { getSaldo } from '../../api/carteira';

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

const Perfil = (props: any) => {

	const user = useSelector((state: any) => state.userReducer.user);
	const saldo = useSelector((state: any) => state.saldoReducer.saldo);
	const [modalIsOpen, setIsOpen] = useState(false);
	const [statusPassword, setStatusPassword] = useState(false);
	let erroRetonoCod = '';
	let erroRetonoMensage = '';



	const {
		allFields,
		token,
		senha,
		confirmarSenha,
		finish,
		setFieldRedux,
		invalidFields,
		resetUserRecouverDataRedux,
	} = props;

	const [nPagina, setNpagina] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	/*
	const handleValueChangeCpfOrCnpj = async ({
		name,
		valor,
		isCpf,
		isCnpj,
		isValid,
		page,
	}) => {
		setFieldRedux(name, {
			name,
			valor,
			isCpf,
			isCnpj,
			isValid,
			page,
		});
	};
*/
	const handleValueChange = ({ name, valor, isValid, page }) => {
		setFieldRedux(name, {
			name,
			valor,
			isValid,
			page,
		});
	};

	const handleSendCode = async (telefone: string) => {
		setStatusPassword(true);
		try {
			setIsOpen(true);
			const responseSendtoken = await sendCodeVerification('sms', telefone);

			if (responseSendtoken.status == 200) {
				toast.success(
					`Código 6 dígitos enviado por ${telefone.toLocaleUpperCase()}`,
					toastConfig
				);
			} else {
				toast.error(
					`Erro no envio do token`,
					toastConfig
				);
			}


		} catch (error) {
			console.log(error);
		} finally {
			setIsOpen(false);
		}
	};

	const handleChangePassword = async () => {
		if (senha.valor !== confirmarSenha.valor) {
			toast.error('As senhas não são iguais', toastConfig);
			return;
		}

		if (verificaForcaSenha(senha.valor) === false) {
			toast.error('Sua senha não atende aos requisitos', toastConfig);
			return;
		}
		try {
			setIsOpen(true);
			const responseChange = await editarSenha(senha.valor, user.email);
			if (responseChange.status == 200) {
				toast.success(
					`Senha alterada com sucesso!!`,
					toastConfig
				);
				resetUserRecouverDataRedux();
				setNpagina(1)
				setStatusPassword(false);
				// limpar redux aqui 
			} else {
				toast.error(
					`Erro ao editar senha`,
					toastConfig
				);
			}


		} catch (error) {
			console.log(error);
		} finally {
			setIsOpen(false);
		}
	};


	function handleRedirect(paramRedirect: string) {
		setIsOpen(true);
		Router.push(paramRedirect);
	}

	const verifyFieldsByPage = (page: number) => {
		const invalidFieldsByPage = invalidFields.filter(
			(field: string) => allFields[field]?.page === page
		);
		let isValid = true;
		if (page === 1) {
			if (!statusPassword) {
				isValid = false;
			}

		} else if (page === 2) {
			if (!token.isValid) {
				isValid = false;
			}
		}

		if (!isValid) {
			toast.error('Preencha os dados corretamente', toastConfig);
			return false;
		}

		return invalidFieldsByPage?.length === 0;
	};

	const handleNextPage = async () => {
		const stadoTemp = true;
		const isValidsFields = verifyFieldsByPage(nPagina);
		if (nPagina === 1) {

			if (stadoTemp) {
				setNpagina((prev) => prev + 1);
			}
		} else if (nPagina === 2) {
			if (isValidsFields) {
				await handleChangePassword();
			}
		}
	};

	const getColorError = (field: string) => {
		if (invalidFields.includes(field)) {
			return '#FF0000';
		}
		if (allFields[field]?.isValid) {
			return '#32A639';
		}
	};

	const handleVerifyCode = async (
		type: string,
		value: string,
		valueType: string
	) => {
		setIsOpen(true);
		console.log('tipo', type)
		console.log('valor', value)
		console.log('tipo valor', valueType)
		try {
			setIsOpen(true);
			const response = await verifyCode(type, value, valueType);

			if (response?.status === 400) {
				toast.error('Código inválido', toastConfig);
			} else if (response?.status > 199 && response?.status < 300) {
				toast.success('Código verificado com sucesso', toastConfig);
				handleNextPage();
			} else {
				toast.error('Houve algum erro ☹️', toastConfig);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsOpen(false);
		}
	};


	async function validaSmsOuEmail(tipo, dadosTelefoneOuEmail) {
		setIsLoading(true);
		let formataTelefone = dadosTelefoneOuEmail.replace('+55', '');
		try {
			const response = await veryFiWatZapPhone(tipo, formataTelefone);
			if (response.data.status === 200) {
				if (response.data.data.error) {
					//	setValidaTipoAutenticacao('sms');
					//	setStartPause(true);
					//setIsLoading(false);
					sendTokenSms('sms', formataTelefone);
				} else {
					try {
						const response = await sendTokenWatZap(formataTelefone);
						if (response.data.status === 200) {
							let tipoStringEnvio = 'Whatsapp';

							toast.success(
								`Um código foi enviado para o ${tipoStringEnvio}: ${formataTelefone}`,
								{
									position: 'top-center',
									autoClose: 5000,
									hideProgressBar: false,
									closeOnClick: true,
									pauseOnHover: true,
									draggable: true,
									progress: undefined,
									theme: 'colored',
								}
							);
							//	setStartPause(true);
							setIsLoading(false);
							setStatusPassword(true);
						} else {
							sendTokenSms(tipo, dadosTelefoneOuEmail)
						}
					} catch (error) {
						console.log(error);
						if (error instanceof AxiosError) {
							console.log('Cod', error);
							erroRetonoCod = error?.response?.data?.data?.error?.errorCode;
							erroRetonoMensage = error?.response?.data?.data?.error?.message;
							return null;
						} else {
							if (error instanceof TypeError) {
								console.log('caiu aqui', error);
								erroRetonoCod = 'BT0001';
								erroRetonoMensage = 'Erro interno tente mais tarde';
							}
						}
						//	setLoadSpinerModal(false);
						setIsLoading(false);
					}
				}

			} else {
				sendTokenSms('sms', formataTelefone);

			}
		} catch (error) {
			console.log('ERRO', error);
			if (error instanceof AxiosError) {
				console.log('Cod', error);
				erroRetonoCod = error?.response?.data?.data?.error?.errorCode;
				erroRetonoMensage = error?.response?.data?.data?.error?.message;
				return null;
			} else {
				if (error instanceof TypeError) {
					console.log('caiu aqui', error);
					erroRetonoCod = 'BT0001';
					erroRetonoMensage = 'Erro interno tente mais tarde';
				}
			}
			//	setLoadSpinerModal(false);
			setIsLoading(false);
		}

	}

	async function sendTokenSms(tipo, dadosTelefoneOuEmail) {
		try {
			const response = await smsOuEmail(tipo, dadosTelefoneOuEmail);
			if (response.data.status === 200) {
				let tipoStringEnvio = '';

				if (tipo == 'sms') {
					tipoStringEnvio = 'Telefone';
				} else {
					tipoStringEnvio = 'E-mail';
				}

				toast.success(
					`Um código foi enviado para o ${tipoStringEnvio}: ${dadosTelefoneOuEmail}`,
					{
						position: 'top-center',
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						theme: 'colored',
					}
				);
				
				setIsLoading(false);
				setStatusPassword(true);
			}
		} catch (error) {
			console.log(error);
			if (error instanceof AxiosError) {
				console.log('Cod', error);
				erroRetonoCod = error?.response?.data?.data?.error?.errorCode;
				erroRetonoMensage = error?.response?.data?.data?.error?.message;
				return null;
			} else {
				if (error instanceof TypeError) {
					console.log('caiu aqui', error);
					erroRetonoCod = 'BT0001';
					erroRetonoMensage = 'Erro interno tente mais tarde';
				}
			}
			//	setLoadSpinerModal(false);
			setIsLoading(false);
		}
	}
	useEffect(() => {
		return () => {
			resetUserRecouverDataRedux();
		};
	}, [resetUserRecouverDataRedux]);


	return (

		<>
			{!statusPassword && (
				<>
					<div className={styles.dadosNameUser}>
						<span>Olá,&nbsp;</span>
						<h4> {user ? user.name : ''}</h4>
					</div>
					<div>

						<button
							className={styles.buttomIconExtrato}
							onClick={() => {
								validaSmsOuEmail(typePayment, user.telefone)
							}}
						>
							<AiOutlineKey size={28} />
							<span>&nbsp;&nbsp;Alterar senha</span>
						</button>

					</div>
				</>
			)}

			{statusPassword && (
				<>
					{nPagina === 1 && (
						<>

							<div>
								<h1 className={styles.labeTitle}>Token</h1>
							</div>

							<div>
								<InputMask
									placeholder="Código de Verificação*"
									mask="999999"
									value={token.valor}
									onChange={(event) => {
										const inputValue = event.target.value.replace(/\D/g, '');
										if (inputValue.length < 6) {
											console.log(inputValue)
											const auxInvalidFields = [
												...invalidFields,
												'token',
											];
											setFieldRedux('invalidFields', auxInvalidFields);
										} else {
											const auxInvalidFields = invalidFields.filter(
												(field: string) => field !== 'token'
											);
											setFieldRedux('invalidFields', auxInvalidFields);
										}
										handleValueChange({
											name: 'token',
											valor: inputValue,
											isValid: true,
											page: 1,
										});
									}}
									className={styles.input}
									style={{ borderColor: getColorError('token') }}
								/>
								{invalidFields.includes('token') && (
									<p className={styles.labelError}>Digite seu nome completo</p>
								)}
							</div>

							<Buttom
								onClick={() => {
									handleVerifyCode(
										token.valor.replace(/\D/g, ''),
										'sms',
										user.telefone,
									);
								}}
							>
								Verificar Código
							</Buttom>
							<Buttom
								onClick={() => {
									handleSendCode(user.telefone)
								}}
							>
								Reenviar Código
							</Buttom>
						</>
					)}


					{nPagina === 2 && (
						<>
							<div>
								<InputMask
									placeholder="Senha*"
									mask={null}
									value={senha.valor}
									onChange={(event) => {
										const inputValue = event.target.value;
										handleValueChange({
											name: 'senha',
											valor: inputValue,
											isValid: true,
											page: 5,
										});
									}}
									type="password"
									className={styles.input}
									style={{ borderColor: getColorError('senha') }}
								/>
								{invalidFields.includes('senha') && (
									<p className={styles.labelError}></p>
								)}
							</div>

							<div>
								<InputMask
									placeholder="Confirmar senha*"
									mask={null}
									value={confirmarSenha.valor}
									onChange={(event) => {
										const inputValue = event.target.value;
										handleValueChange({
											name: 'confirmarSenha',
											valor: inputValue,
											isValid: true,
											page: 5,
										});
									}}
									type="password"
									className={styles.input}
									style={{ borderColor: getColorError('confirmarSenha') }}
								/>
								{
									<p className={styles.labelAlert}>
										Sua senha deve conter no mínimo 10 caracteres,<br></br> sendo
										pelo menos uma letra maiúscula, <br></br>uma minúscula, um
										número e um caractere especial.
										<br></br>
									</p>
								}
							</div>

							<PageButtons showBack={false} onNext={handleNextPage} />
						</>
					)}
				</>
			)}

			{modalIsOpen ? <Spinner /> : null}
		</>
	);
}

const mapStateToProps = (state: any) => {
	return {
		allFields: getPropSegura(state, ['userRecouverReducer'], {}),
		invalidFields: getPropSegura(
			state,
			['userRecouverReducer', 'invalidFields'],
			[]
		),

		token: getPropSegura(state, ['userRecouverReducer', 'token'], {
			valor: '',
			isValid: false,
			page: 2,
		}),

		senha: getPropSegura(state, ['userRecouverReducer', 'senha'], {
			valor: '',
			isValid: false,
			page: 3,
		}),
		confirmarSenha: getPropSegura(
			state,
			['userRecouverReducer', 'confirmarSenha'],
			{
				valor: '',
				isValid: false,
				page: 3,
			}
		),
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		setFieldRedux: (field: string, value: string) => {
			dispatch(setUserRecouverField(field, value));
		},

		resetUserRecouverDataRedux: () => {
			dispatch(resetUserRecouverData());
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Perfil);
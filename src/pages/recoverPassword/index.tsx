import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { connect } from 'react-redux';
import InputMask from 'react-input-mask';
import moment from 'moment';
import { ToastOptions, toast } from 'react-toastify';

import ContainerRecover from '../../layout/ContainerRecover';
import { editarSenha } from '../../api/editarSenha';
import CpfCnpjInput from '../../components/ui/InputCpfCnpj';
import Loading from '../../components/Loading';
import { Buttom } from '../../components/ui/Buttom';

import {
	validarDataNascimento,
	verificaEmail,
	verificaForcaSenha,
} from '../../validacoes/validarMascaras';

import {
	resetUserRecouverData,
	setUserRecouverField,
} from '../../redux/actions/userRecouverActions';

import getPropSegura from '../../utils/getPropSegura';
import { verificarNomeCompleto } from '../../validacoes/validarMascaras';

import { getAddressByCep } from '../../api/endereco';
import {
	regiterAccount,
	regiterAccountCompany,
	sendCodeVerification,
	verifyCode,
} from '../../api/cadastro';

import { validateCpf } from '../../validacoes/validarMascaras';

import PageButtons from './PageButtons';

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

const RecoverPassword = (props: any) => {
	const {
		allFields,
		telefone,
		tokenTelefone,
		email,
		tokenEmail,
		senha,
		confirmarSenha,
		finish,
		setFieldRedux,
		invalidFields,
		resetUserRecouverDataRedux,
	} = props;

	const [nPagina, setNpagina] = useState(1);
	const [isLoading, setIsLoading] = useState(false);

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

	const handleValueChange = ({ name, valor, isValid, page }) => {
		setFieldRedux(name, {
			name,
			valor,
			isValid,
			page,
		});
	};

	const verifyFieldsByPage = (page: number) => {
		const invalidFieldsByPage = invalidFields.filter(
			(field: string) => allFields[field]?.page === page
		);
		let isValid = true;
		if (page === 1) {
			if (!telefone.isValid) {
				isValid = false;
			}

		} else if (page === 2) {
			if (!tokenTelefone.isValid) {
				isValid = false;
			}

		} else if (page === 3) {
			if (!email.isValid) {
				isValid = false;
			}

		}
		else if (page === 4) {
			if (!tokenEmail.isValid) {
				isValid = false;
			}

		} else if (page === 5) {
			if (senha.value !== confirmarSenha.value) {
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
		const isValidsFields = verifyFieldsByPage(nPagina);
		if (nPagina === 1) {
			if (isValidsFields) {
				setNpagina((prev) => prev + 1);
				handleSendCode('sms', telefone.valor);

			}
		} else if (nPagina === 2) {
			if (isValidsFields) {
				setNpagina((prev) => prev + 1);
			}
		} else if (nPagina === 3) {
			if (isValidsFields) {
				setNpagina((prev) => prev + 1);
				handleSendCode('email', email.valor);
			}
		} else if (nPagina === 4) {
			if (isValidsFields) {
				setNpagina((prev) => prev + 1);

			}
		} else if (nPagina === 5) {
			if (isValidsFields) {
				//setNpagina((prev) => prev + 1);
				handleChangePassword()

			}
		}
	};
	//handleChangePassword
	const handlePreviousPage = () => {
		const currentPage = nPagina;
		if (
			currentPage === 2 ||
			currentPage === 3 ||
			currentPage === 4

		) {
			setNpagina(currentPage - 1);
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

	useEffect(() => {
		return () => {
			resetUserRecouverDataRedux();
		};
	}, [resetUserRecouverDataRedux]);

	const handleSendCode = async (type: string, value: string) => {
		try {
			setIsLoading(true);
			await sendCodeVerification(type, value);
			toast.success(
				`Código 6 dígitos enviado por ${type.toLocaleUpperCase()}`,
				toastConfig
			);
			if (type === 'email') {
				setFieldRedux('emailSent', true);
			} else if (type === 'sms') {
				setFieldRedux('telefoneSent', true);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};


	const handleVerifyCode = async (
		type: string,
		value: string,
		valueType: string
	) => {

		try {
			setIsLoading(true);
			const response = await verifyCode(type, value, valueType);
			setFieldRedux('tokenEmail', {
				name: 'tokenEmail',
				valor: '',
				isValid: false,
				page: 5,
			});
			setFieldRedux('tokenTelefone', {
				name: 'tokenTelefone',
				valor: '',
				isValid: false,
				page: 3,
			});
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
			setIsLoading(false);
		}
	};

	const handleChangePassword = async () => {
		setIsLoading(true);
		if (senha.valor !== confirmarSenha.valor) {
			toast.error('As senhas não são iguais', toastConfig);
			setIsLoading(false);
			return;
		}

		if (verificaForcaSenha(senha.valor) === false) {
			toast.error('Sua senha não atende aos requisitos', toastConfig);
			setIsLoading(false);
			return;
		}
		try {
			//setIsOpen(true);
			const responseChange = await editarSenha(senha.valor, email.valor);
			if (responseChange.status == 200) {
				toast.success('Senha alterada com  Sucesso 😁 ', toastConfig);
				setNpagina(6);
				setTimeout(() => {
					Router.push('/');
				}, 15000);
				resetUserRecouverDataRedux();
				setIsLoading(false);
			} else {
				toast.error(
					`Erro ao editar senha`,
					toastConfig
				);
				setIsLoading(false);
			}


		} catch (error) {
			console.log(error);
		} finally {
			//setIsOpen(false);
		}
	};
	return (
		<ContainerRecover>
			{nPagina === 1 && (
				<>
					<InputMask
						placeholder="Telefone"
						mask="(99)99999-9999"
						value={telefone.valor}
						onChange={(event) => {
							const inputValue = event.target.value.replace(/\D/g, '');
							if (inputValue.length < 6) {
								const auxInvalidFields = [
									...invalidFields,
									'telefone',
								];
								setFieldRedux('invalidFields', auxInvalidFields);
							} else {
								const auxInvalidFields = invalidFields.filter(
									(field: string) => field !== 'telefone'
								);
								setFieldRedux('invalidFields', auxInvalidFields);
							}
							handleValueChange({
								name: 'telefone',
								valor: inputValue,
								isValid: true,
								page: 2,
							});
						}}
						className={styles.input}
						style={{ borderColor: getColorError('telefone') }}
					/>

					<PageButtons showBack={false} onNext={handleNextPage} />
					<div className={styles.rowStyle}>
						<Link className={styles.linkStyle} href="/">
							Já possui uma conta? <br></br>
							Entrar
						</Link>
					</div>
				</>
			)}

			{nPagina === 2 && (
				<>

					<div>
						<h1 className={styles.labelSocio}>Token</h1>
					</div>

					<div>
						<InputMask
							placeholder="Código de Verificação*"
							mask="999999"
							value={tokenTelefone.valor}
							onChange={(event) => {
								const inputValue = event.target.value.replace(/\D/g, '');
								if (inputValue.length < 6) {
									const auxInvalidFields = [
										...invalidFields,
										'tokenTelefone',
									];
									setFieldRedux('invalidFields', auxInvalidFields);
								} else {
									const auxInvalidFields = invalidFields.filter(
										(field: string) => field !== 'tokenTelefone'
									);
									setFieldRedux('invalidFields', auxInvalidFields);
								}
								handleValueChange({
									name: 'tokenTelefone',
									valor: inputValue,
									isValid: true,
									page: 2,
								});
							}}
							className={styles.input}
							style={{ borderColor: getColorError('token') }}
						/>
						{invalidFields.includes('token') && (
							<p className={styles.labelError}>Token obrigatório</p>
						)}
					</div>

					<Buttom
						onClick={() => {
							handleVerifyCode(
								tokenTelefone.valor.replace(/\D/g, ''),
								'sms',
								telefone.valor.replace(/\D/g, '')
							);
						}}
					>
						Verificar Código
					</Buttom>
					<Buttom
						onClick={() => {
							handleSendCode('sms', tokenTelefone.valor.replace(/\D/g, ''));
						}}
					>
						Reenviar Código
					</Buttom>
					<Buttom
						onClick={() => {

						}}
					>
						Cancelar
					</Buttom>
				</>
			)}

			{nPagina === 3 && (
				<>
					<InputMask
						placeholder="E-mail*"
						mask={null}
						value={email.valor}
						onChange={(event) => {
							const inputValue = event.target.value;
							let isValid = false;
							if (verificaEmail(inputValue) === false) {
								isValid = false;
								const auxInvalidFields = [...invalidFields, 'email'];
								setFieldRedux('invalidFields', auxInvalidFields);
							} else {
								isValid = true;
								const auxInvalidFields = invalidFields.filter(
									(field: string) => field !== 'email'
								);
								setFieldRedux('invalidFields', auxInvalidFields);
							}
							handleValueChange({
								name: 'email',
								valor: inputValue,
								isValid: isValid,
								page: 4,
							});
						}}
						className={styles.input}
						style={{ borderColor: getColorError('email') }}
					/>

					<PageButtons showBack={false} onNext={handleNextPage} />

				</>
			)}

			{nPagina === 4 && (
				<>

					<div>
						<h1 className={styles.labelSocio}>Token</h1>
					</div>

					<div>
						<InputMask
							placeholder="Código de Verificação email"
							mask="999999"
							value={tokenEmail.valor}
							onChange={(event) => {
								const inputValue = event.target.value.replace(/\D/g, '');
								if (inputValue.length < 6) {
									const auxInvalidFields = [
										...invalidFields,
										'tokenEmail',
									];
									setFieldRedux('invalidFields', auxInvalidFields);
								} else {
									const auxInvalidFields = invalidFields.filter(
										(field: string) => field !== 'tokenEmail'
									);
									setFieldRedux('invalidFields', auxInvalidFields);
								}
								handleValueChange({
									name: 'tokenEmail',
									valor: inputValue,
									isValid: true,
									page: 4,
								});
							}}
							className={styles.input}
							style={{ borderColor: getColorError('tokenEmail') }}
						/>
						{invalidFields.includes('tokenEmail') && (
							<p className={styles.labelError}>Digite seu nome completo</p>
						)}
					</div>

					<Buttom
						onClick={() => {
							handleVerifyCode(
								tokenEmail.valor.replace(/\D/g, ''),
								'email',
								email.valor
							);
						}}
					>
						Verificar Código
					</Buttom>
					<Buttom
						onClick={() => {
							handleSendCode('email', email.valor);
						}}
					>
						Reenviar Código
					</Buttom>
				</>
			)}

			{nPagina === 5 && (
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





			<Loading isLoading={isLoading} />
		</ContainerRecover>
	);
};

const mapStateToProps = (state: any) => {
	return {
		allFields: getPropSegura(state, ['userRecouverReducer'], {}),
		invalidFields: getPropSegura(
			state,
			['userRecouverReducer', 'invalidFields'],
			[]
		),
		telefone: getPropSegura(state, ['userRecouverReducer', 'telefone'], {
			valor: '',
			isValid: false,
			page: 1,
		}),
		tokenTelefone: getPropSegura(state, ['userRecouverReducer', 'tokenTelefone'], {
			valor: '',
			isValid: false,
			page: 2,
		}),
		email: getPropSegura(state, ['userRecouverReducer', 'email'], {
			valor: '',
			isValid: false,
			page: 3,
		}),
		tokenEmail: getPropSegura(state, ['userRecouverReducer', 'tokenEmail'], {
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

export default connect(mapStateToProps, mapDispatchToProps)(RecoverPassword);

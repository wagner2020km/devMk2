import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { connect } from 'react-redux';
import InputMask from 'react-input-mask';
import moment from 'moment';
import { ToastOptions, toast } from 'react-toastify';

import ContainerRecover from '../../layout/ContainerRecover';

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

const EditPassword = (props: any) => {
	const {
		allFields,
		cpfCnpj,
		senha,
		confirmarSenha,
		token,
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
	/*
	const registerAccountApi = async () => {
		if (senha.valor !== confirmarSenha.valor) {
			toast.error('As senhas não são iguais', toastConfig);
			return;
		}

		if (verificaForcaSenha(senha.valor) === false) {
			toast.error('Sua senha não atende aos requisitos', toastConfig);
			return;
		}
		try {
			let data = {};
			if (cpfCnpj.isCnpj) {
				data = {
					usuario: {
						email: email.valor,
						senha: senha.valor,
					},
					cnpj: cpfCnpj.valor,
					empresa_telefone: empresaTelefone.valor,
					razao_social: razaoSocial.valor,
					nome_fantasia: nomeFantasia.valor,
					proprietario: [
						{
							nome_completo: nomeCompleto.valor,
							email: email.valor,
							cpf: cpfSocio.valor,
							telefone: telefone.valor.replace(/\D/g, ''),
							nome_mae: nomeDaMae.valor,
							data_nascimento: moment(
								dataNascimento.valor,
								'DD-MM-YYYY'
							).format('DD-MM-YYYY'),
							endereco: {
								cep: cep.valor,
								logradouro: `${endereco.valor},${numero.valor},${bairro.valor}`,
								cidade: cidade.valor,
								sigla_uf: estado.valor,
							},
							publicamenteExposto: publicExposed.valor,
						},
					],
					empresa_endereco: {
						cep: empresaCep.valor,
						logradouro: `${empresaEndereco.valor},${empresaNumero.valor},${empresaBairro.valor}`,
						cidade: empresaCidade.valor,
						sigla_uf: empresaEstado.valor,
					},
				};
			} else {
				data = {
					usuario: {
						email: email.valor,
						senha: senha.valor,
					},
					nome_completo: nomeCompleto.valor,
					cpf: cpfCnpj.valor,
					telefone: telefone.valor.replace(/\D/g, ''),
					nome_mae: nomeDaMae.valor,
					data_nascimento: moment(dataNascimento.valor, 'DD-MM-YYYY').format(
						'DD-MM-YYYY'
					),
					endereco: {
						cep: cep.valor,
						logradouro: `${endereco.valor},${numero.valor},${bairro.valor}`,
						cidade: cidade.valor,
						sigla_uf: estado.valor,
					},
				};
			}

			setIsLoading(true);

			let response = null;
			if (cpfCnpj.isCnpj === true) {
				response = await regiterAccountCompany(data);
			} else {
				response = await regiterAccount(data);
			}

			if (response?.status === 201) {
				toast.success('Sucesso 😁', toastConfig);
				setNpagina(7);
				setTimeout(() => {
					Router.push('/');
				}, 15000);
			} else {
				toast.error('Houve algum erro ☹️', toastConfig);
				setNpagina(8);
				setTimeout(() => {
					Router.push('/');
				}, 15000);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};
	*/
	const verifyFieldsByPage = (page: number) => {
		const invalidFieldsByPage = invalidFields.filter(
			(field: string) => allFields[field]?.page === page
		);
		let isValid = true;
		if (page === 1) {
			if (!cpfCnpj.isValid) {
				isValid = false;
			}
			
		} else if (page === 2) {
			if (!token.isValid) {
				isValid = false;
			}

		} else if (page === 3) {
			if (!senha.isValid) {
				isValid = false;
			}
			if (senha.value !== confirmarSenha.value) {
				isValid = false;
			}
		} else if (page === 4) {
			if (!finish.isValid) {
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
				handleSGetData(cpfCnpj.valor)

			}
		} else if (nPagina === 2) {
			if (isValidsFields) {
				setNpagina((prev) => prev + 1);
			}
		} else if (nPagina === 3) {
			if (isValidsFields) {
				setNpagina((prev) => prev + 1);
			}
		}
	};

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

	const handleSGetData = async ( value: string) => {
		toast.success(
			`Buscando dados para o documento  ${value}`,
			toastConfig
		);
	};

	const handleVerifyCode = async (
		type: string,
		value: string,
		valueType: string
	) => {
		try {
			setIsLoading(true);
			const response = await verifyCode(type, value, valueType);
			setFieldRedux('emailCode', {
				name: 'emailCode',
				valor: '',
				isValid: false,
				page: 5,
			});
			setFieldRedux('telefoneCode', {
				name: 'telefoneCode',
				valor: '',
				isValid: false,
				page: 4,
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

	return (
		<ContainerRecover>
			{nPagina === 1 && (
				<>
					<CpfCnpjInput
						onValueChange={handleValueChangeCpfOrCnpj}
						page={1}
						inputProps={{
							value: cpfCnpj.valor,
						}}
						borderColor={getColorError('cpfCnpj')}
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
									value={token.valor}
									onChange={(event) => {
										const inputValue = event.target.value.replace(/\D/g, '');
										if (inputValue.length < 6) {
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
											page: 4,
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
												cpfCnpj.valor.replace(/\D/g, '')
											);
										}}
									>
										Verificar Código
									</Buttom>
									<Buttom
										onClick={() => {
											handleSendCode('sms', token.valor.replace(/\D/g, ''));
										}}
									>
										Reenviar Código
									</Buttom>
				</>
			)}

			{nPagina === 3 && (
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

			{nPagina === 4 && (
				
					<div>
					
					</div>
				
				
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
		cpfCnpj: getPropSegura(state, ['userRecouverReducer', 'cpfCnpj'], {
			valor: '',
			isCpf: true,
			isCnpj: false,
			isValid: false,
			page: 1,
		}),
	
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

export default connect(mapStateToProps, mapDispatchToProps)(EditPassword);

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { connect } from 'react-redux';
import InputMask from 'react-input-mask';
import moment from 'moment';
import { ToastOptions, toast } from 'react-toastify';
import { destroyCookie, setCookie } from 'nookies';
import ContainerCadastro from '../../layout/ContainerCadastro';
import { smsOuEmail, veryFiWatZapPhone, sendTokenWatZap } from '../../api/validacaoTelefoneEmail';
import CpfCnpjInput from '../../components/ui/InputCpfCnpj';
import Loading from '../../components/Loading';
import { Buttom } from '../../components/ui/Buttom';

import {
	validarDataNascimento,
	verificaEmail,
	verificaForcaSenha,
} from '../../validacoes/validarMascaras';

import {
	resetUserRegisterData,
	setUserRegisterField,
} from '../../redux/actions/userRegisterActions';

import getPropSegura from '../../utils/getPropSegura';
import { verificarNomeCompleto } from '../../validacoes/validarMascaras';

import { getAddressByCep } from '../../api/endereco';
import { seachCnpj } from '../../api/consultaApiCpfCnpj';
import {
	regiterAccount,
	regiterAccountCompany,
	sendCodeVerification,
	verifyCode,
	veryfiDataRegister,
	veryfiContactRegister
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

const CadastrarConta = (props: any) => {
	const {
		allFields,
		cpfCnpj,
		nomeCompleto,
		cpfSocio,
		publicExposed,
		nomeFantasia,
		razaoSocial,
		empresaTelefone,
		empresaCep,
		empresaEndereco,
		empresaNumero,
		empresaComplemento,
		empresaBairro,
		empresaCidade,
		empresaEstado,
		dataNascimento,
		nomeDaMae,
		cep,
		endereco,
		numero,
		complemento,
		bairro,
		cidade,
		estado,
		senha,
		confirmarSenha,
		email,
		emailCode,
		emailSent,
		telefone,
		telefoneSent,
		telefoneCode,
		setFieldRedux,
		invalidFields,
		resetUserRegisterDataRedux,
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
	const handleIdWall = () => {
		if (cpfCnpj.isCpf) {
			Router.push({
				pathname: '/idWall',
				query: { cpf: cpfCnpj.isCpf && String(cpfCnpj.valor) },
			});
		} else if (cpfCnpj.isCnpj) {
			Router.push({
				pathname: '/idWall',
				query: { cnpj: cpfCnpj.isCnpj && String(cpfCnpj.valor) },
			});
		}
	};

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
				const dataTemp = {
					emailTemp: email.valor,
						senhaTemp: senha.valor,
				}
				const dataTempString = JSON.stringify(dataTemp);
				setCookie(undefined, '@nextauth.dadosTemp', dataTempString);
				toast.success('Ok agora precisamos que nos envie sua documentação 😁', toastConfig);
				handleIdWall();
				//setNpagina(7);	
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

	const verifyFieldsByPage = (page: number) => {
		const invalidFieldsByPage = invalidFields.filter(
			(field: string) => allFields[field]?.page === page
		);
		let isValid = true;
		if (page === 1) {
			handleVeryfiData(cpfCnpj.valor);
			if (!cpfCnpj.isValid) {
				isValid = false;
			}
			if (cpfCnpj.isCnpj) {
				if (!nomeFantasia.isValid) {
					isValid = false;
				}
				if (!razaoSocial.isValid) {
					isValid = false;
				}
				if (!empresaTelefone.isValid) {
					isValid = false;
				}
				if (!empresaCep.isValid) {
					isValid = false;
				}
				if (!empresaEndereco.isValid) {
					isValid = false;
				}
				if (!empresaNumero.isValid) {
					isValid = false;
				}
				if (!empresaBairro.isValid) {
					isValid = false;
				}
				if (!empresaCidade.isValid) {
					isValid = false;
				}
				if (!empresaEstado.isValid) {
					isValid = false;
				}
			}
		} else if (page === 2) {
			if (!nomeCompleto.isValid) {
				isValid = false;
			}
			if (!dataNascimento.isValid) {
				isValid = false;
			}
			if (!nomeDaMae.isValid) {
				isValid = false;
			}
			if (cpfCnpj.isCnpj) {
				if (!cpfSocio.isValid) {
					isValid = false;
				}
			}
		} else if (page === 3) {
			if (!cep.isValid) {
				isValid = false;
			}
			if (!endereco.isValid) {
				isValid = false;
			}
			if (!numero.isValid) {
				isValid = false;
			}
			if (!bairro.isValid) {
				isValid = false;
			}
			if (!cidade.isValid) {
				isValid = false;
			}
			if (!estado.isValid) {
				isValid = false;
			}
		} else if (page === 4) {
			if (!telefone.isValid) {
				isValid = false;
			}
		} else if (page === 5) {
			if (!email.isValid) {
				isValid = false;
			}
		} else if (page === 6) {
			if (!senha.isValid) {
				isValid = false;
			}
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
			}
		} else if (nPagina === 2) {
			if (isValidsFields) {
				setNpagina((prev) => prev + 1);
			}
		} else if (nPagina === 3) {
			if (isValidsFields) {
				setNpagina((prev) => prev + 1);
			}
		} else if (nPagina === 4) {
			if (isValidsFields) {
				setNpagina((prev) => prev + 1);
			}
		} else if (nPagina === 5) {
			if (isValidsFields) {
				setNpagina((prev) => prev + 1);
			}
		} else if (nPagina === 6) {
			if (isValidsFields) {
				await registerAccountApi();
			}
		}
	};

	const handlePreviousPage = () => {
		const currentPage = nPagina;
		if (
			currentPage === 2 ||
			currentPage === 3 ||
			currentPage === 4 ||
			currentPage === 5 ||
			currentPage === 6
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
			resetUserRegisterDataRedux();
		};
	}, [resetUserRegisterDataRedux]);

	const handleSendCode = async (type: string, value: string) => {
		console.log(type);
		console.log('Telefone aqui',value);
		try {
			setIsLoading(true);
			const response = await veryfiContactRegister(type, value);
			
			if (response.status == 200) {
				try {
					setIsLoading(true);
					//await sendCodeVerification(type, value);
					const response = await veryFiWatZapPhone(type, value);
					if (response.data.status === 200) {
						try {
							const response = await sendTokenWatZap(value);
							if (response.data.status === 200) {
								let tipoStringEnvio = 'Whatsapp';
	
								toast.success(
									`Um código foi enviado para o ${tipoStringEnvio}: ${value}`,
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
								//setStartPause(true);
								setIsLoading(false);
							} else {
								sendCodeVerification(type, value)
							}
						} catch (error) {
							console.log(error);
							
							toast.error(
								`Erro ao enviar token`,
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
							sendCodeVerification(type, value)
						}
						setIsLoading(false);
					} else {
						await sendCodeVerification(type, value);
						toast.success(
							`Código 6 dígitos enviado por ${type.toLocaleUpperCase()}`,
							toastConfig
						);
					}
					
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
			} else {
				toast.error(
					`${response.data.message}  
					${value}`,
					toastConfig
				);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}	
	};

	const handleVeryfiData = async (data: string) => {
		try {
			setIsLoading(true);
			const response = await veryfiDataRegister(data);
			console.log(response.status)
			if (response.status != 200) {
				setNpagina((prev) => prev - 1);
				toast.error(
					`${response.data.message}  
					${data}`,
					toastConfig
				);
			} else {
				const responsedocumento = await seachCnpj(data);
				setIsLoading(false);
				return
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
		<ContainerCadastro>
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
					{cpfCnpj && cpfCnpj.isCnpj && cpfCnpj.isValid && (
						<>
							<br></br>
							<hr></hr>
							<div>
								<InputMask
									placeholder="Nome Fantasia*"
									mask={null}
									value={nomeFantasia.valor}
									onChange={(event) => {
										const inputValue = event.target.value;
										let isValid = false;
										if (inputValue.length < 3) {
											isValid = false;
											const auxInvalidFields = [
												...invalidFields,
												'nomeFantasia',
											];
											setFieldRedux('invalidFields', auxInvalidFields);
										} else {
											isValid = true;
											const auxInvalidFields = invalidFields.filter(
												(field: string) => field !== 'nomeFantasia'
											);
											setFieldRedux('invalidFields', auxInvalidFields);
										}
										handleValueChange({
											name: 'nomeFantasia',
											valor: inputValue,
											isValid,
											page: 1,
										});
									}}
									className={styles.input}
									style={{ borderColor: getColorError('nomeFantasia') }}
								/>
								{invalidFields.includes('nomeFantasia') && (
									<p className={styles.labelError}>Digite o nome fantasia</p>
								)}
							</div>

							<div>
								<InputMask
									placeholder="Razão Social*"
									mask={null}
									value={razaoSocial.valor}
									onChange={(event) => {
										const inputValue = event.target.value;
										let isValid = false;
										if (inputValue.length < 3) {
											isValid = false;
											const auxInvalidFields = [
												...invalidFields,
												'razaoSocial',
											];
											setFieldRedux('invalidFields', auxInvalidFields);
										} else {
											isValid = true;
											const auxInvalidFields = invalidFields.filter(
												(field: string) => field !== 'razaoSocial'
											);
											setFieldRedux('invalidFields', auxInvalidFields);
										}
										handleValueChange({
											name: 'razaoSocial',
											valor: inputValue,
											isValid,
											page: 1,
										});
									}}
									className={styles.input}
									style={{ borderColor: getColorError('razaoSocial') }}
								/>
								{invalidFields.includes('razaoSocial') && (
									<p className={styles.labelError}>Digite a razão social</p>
								)}
							</div>

							<div>
								<InputMask
									placeholder="Empresa Telefone*"
									mask="(99) 99999-9999"
									value={empresaTelefone.valor}
									onChange={(event) => {
										const inputValue = event.target.value;
										let isValid = false;
										if (inputValue.length !== 15) {
											isValid = false;
											const auxInvalidFields = [
												...invalidFields,
												'empresaTelefone',
											];
											setFieldRedux('invalidFields', auxInvalidFields);
										} else {
											isValid = true;
											const auxInvalidFields = invalidFields.filter(
												(field: string) => field !== 'empresaTelefone'
											);
											setFieldRedux('invalidFields', auxInvalidFields);
										}
										handleValueChange({
											name: 'empresaTelefone',
											valor: inputValue,
											isValid: isValid,
											page: 1,
										});
									}}
									className={styles.input}
									style={{ borderColor: getColorError('empresaTelefone') }}
								/>
								{invalidFields.includes('empresaTelefone') && (
									<p className={styles.labelError}>Digite um telefone válido</p>
								)}
							</div>
							<br></br>
							<hr></hr>
							<div>
								<InputMask
									placeholder="Empresa CEP*"
									mask="99.999-999"
									value={empresaCep.valor}
									onChange={async (event) => {
										const inputValue = event.target.value;
										let isValid = false;
										if (inputValue.length != 10) {
											isValid = false;
											const auxInvalidFields = [...invalidFields, 'cep'];
											setFieldRedux('invalidFields', auxInvalidFields);
										} else {
											isValid = true;
											const auxInvalidFields = invalidFields.filter(
												(field: string) => field !== 'cep'
											);
											setFieldRedux('invalidFields', auxInvalidFields);
										}
										handleValueChange({
											name: 'empresaCep',
											valor: inputValue,
											isValid,
											page: 1,
										});
										if (inputValue.length === 10) {
											const response = await getAddressByCep(
												inputValue.replace(/\D/g, '')
											);
											const { data } = response;
											if (response.status === 200) {
												setFieldRedux('empresaEndereco', {
													name: 'empresaEndereco',
													valor: data.logradouro,
													isValid: true,
													page: 1,
												});
												setFieldRedux('empresaBairro', {
													name: 'empresaBairro',
													valor: data.bairro,
													isValid: true,
													page: 1,
												});
												setFieldRedux('empresaCidade', {
													name: 'empresaCidade',
													valor: data.localidade,
													isValid: true,
													page: 1,
												});
												setFieldRedux('empresaEstado', {
													name: 'empresaEstado',
													valor: data.uf,
													isValid: true,
													page: 1,
												});
											}
										}
									}}
									className={styles.input}
									style={{ borderColor: getColorError('empresaCep') }}
								/>
								{invalidFields.includes('empresaCep') && (
									<p className={styles.labelError}>Digite um CEP válido</p>
								)}
							</div>

							<div>
								<InputMask
									placeholder="Empresa Endereço*"
									mask={null}
									value={empresaEndereco.valor}
									onChange={(event) => {
										const inputValue = event.target.value;
										let isValid = false;
										if (inputValue.length < 3) {
											isValid = false;
											const auxInvalidFields = [
												...invalidFields,
												'empresaEndereco',
											];
											setFieldRedux('invalidFields', auxInvalidFields);
										} else {
											isValid = true;
											const auxInvalidFields = invalidFields.filter(
												(field: string) => field !== 'empresaEndereco'
											);
											setFieldRedux('invalidFields', auxInvalidFields);
										}
										handleValueChange({
											name: 'empresaEndereco',
											valor: inputValue,
											isValid,
											page: 1,
										});
									}}
									className={styles.input}
									style={{ borderColor: getColorError('empresaEndereco') }}
								/>
								{invalidFields.includes('empresaEndereco') && (
									<p className={styles.labelError}>
										Digite o endereço da empresa
									</p>
								)}
							</div>

							<div>
								<InputMask
									placeholder="Empresa Número*"
									mask={null}
									value={empresaNumero.valor}
									onChange={(event) => {
										const inputValue = event.target.value;
										let isValid = false;
										if (inputValue.length < 1) {
											isValid = false;
											const auxInvalidFields = [
												...invalidFields,
												'empresaNumero',
											];
											setFieldRedux('invalidFields', auxInvalidFields);
										} else {
											isValid = true;
											const auxInvalidFields = invalidFields.filter(
												(field: string) => field !== 'empresaNumero'
											);
											setFieldRedux('invalidFields', auxInvalidFields);
										}
										handleValueChange({
											name: 'empresaNumero',
											valor: inputValue,
											isValid,
											page: 1,
										});
									}}
									className={styles.input}
									style={{ borderColor: getColorError('empresaNumero') }}
								/>
								{invalidFields.includes('empresaNumero') && (
									<p className={styles.labelError}>
										Digite o número da empresa
									</p>
								)}
							</div>

							<div>
								<InputMask
									placeholder="Empresa Complemento"
									mask={null}
									value={empresaComplemento.valor}
									onChange={(event) => {
										const inputValue = event.target.value;
										handleValueChange({
											name: 'empresaComplemento',
											valor: inputValue,
											isValid: true,
											page: 1,
										});
									}}
									className={styles.input}
									style={{ borderColor: getColorError('empresaComplemento') }}
								/>
								{invalidFields.includes('empresaComplemento') && (
									<p className={styles.labelError}></p>
								)}
							</div>

							<div>
								<InputMask
									placeholder="Empresa Bairro*"
									mask={null}
									value={empresaBairro.valor}
									onChange={(event) => {
										const inputValue = event.target.value;
										if (inputValue.length < 3) {
											const auxInvalidFields = [
												...invalidFields,
												'empresaBairro',
											];
											setFieldRedux('invalidFields', auxInvalidFields);
										} else {
											const auxInvalidFields = invalidFields.filter(
												(field: string) => field !== 'empresaBairro'
											);
											setFieldRedux('invalidFields', auxInvalidFields);
										}
										handleValueChange({
											name: 'empresaBairro',
											valor: inputValue,
											isValid: true,
											page: 1,
										});
									}}
									className={styles.input}
									style={{ borderColor: getColorError('empresaBairro') }}
								/>
								{invalidFields.includes('empresaBairro') && (
									<p className={styles.labelError}>
										Digite o bairro da empresa
									</p>
								)}
							</div>

							<div>
								<InputMask
									placeholder="Empresa Cidade*"
									mask={null}
									value={empresaCidade.valor}
									onChange={(event) => {
										const inputValue = event.target.value;
										if (inputValue.length < 3) {
											const auxInvalidFields = [
												...invalidFields,
												'empresaCidade',
											];
											setFieldRedux('invalidFields', auxInvalidFields);
										} else {
											const auxInvalidFields = invalidFields.filter(
												(field: string) => field !== 'empresaCidade'
											);
											setFieldRedux('invalidFields', auxInvalidFields);
										}
										handleValueChange({
											name: 'empresaCidade',
											valor: inputValue,
											isValid: true,
											page: 1,
										});
									}}
									className={styles.input}
									style={{ borderColor: getColorError('empresaCidade') }}
								/>
								{invalidFields.includes('empresaCidade') && (
									<p className={styles.labelError}>
										Digite a cidade da empresa
									</p>
								)}
							</div>

							<div>
								<InputMask
									placeholder="Empresa Estado*"
									mask={null}
									value={empresaEstado.valor}
									onChange={(event) => {
										const inputValue = event.target.value;
										if (inputValue.length < 2) {
											const auxInvalidFields = [
												...invalidFields,
												'empresaEstado',
											];
											setFieldRedux('invalidFields', auxInvalidFields);
										} else {
											const auxInvalidFields = invalidFields.filter(
												(field: string) => field !== 'empresaEstado'
											);
											setFieldRedux('invalidFields', auxInvalidFields);
										}
										handleValueChange({
											name: 'empresaEstado',
											valor: inputValue,
											isValid: true,
											page: 1,
										});
									}}
									className={styles.input}
									style={{ borderColor: getColorError('empresaEstado') }}
								/>
								{invalidFields.includes('empresaEstado') && (
									<p className={styles.labelError}>
										Digite o estado da empresa
									</p>
								)}
							</div>
						</>
					)}

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
					{cpfCnpj.isCnpj && (
						<div>
							<h1 className={styles.labelSocio}>Dados do sócio proprietário</h1>
						</div>
					)}
					<div>
						<InputMask
							placeholder="Nome Completo*"
							mask={null}
							value={nomeCompleto.valor}
							onChange={(event) => {
								const { value } = event.target;
								let isValid = false;
								if (!verificarNomeCompleto(value)) {
									isValid = false;
									const auxInvalidFields = [...invalidFields, 'nomeCompleto'];
									setFieldRedux('invalidFields', auxInvalidFields);
								} else {
									isValid = true;
									const auxInvalidFields = invalidFields.filter(
										(field: string) => field !== 'nomeCompleto'
									);
									setFieldRedux('invalidFields', auxInvalidFields);
								}
								setFieldRedux('nomeCompleto', {
									name: 'nomeCompleto',
									valor: value,
									isValid: isValid,
									page: 2,
								});
							}}
							className={styles.input}
							style={{ borderColor: getColorError('nomeCompleto') }}
						/>
						{invalidFields.includes('nomeCompleto') && (
							<p className={styles.labelError}>Digite seu nome completo</p>
						)}
					</div>

					<div>
						<InputMask
							placeholder="Data de nascimento*"
							mask="99/99/9999"
							value={dataNascimento.valor}
							onChange={(event) => {
								const inputValue = event.target.value;
								const isValid = validarDataNascimento(inputValue).valid;
								if (!isValid) {
									const auxInvalidFields = [...invalidFields, 'dataNascimento'];
									setFieldRedux('invalidFields', auxInvalidFields);
								} else {
									const auxInvalidFields = invalidFields.filter(
										(field: string) => field !== 'dataNascimento'
									);
									setFieldRedux('invalidFields', auxInvalidFields);
								}
								handleValueChange({
									name: 'dataNascimento',
									valor: inputValue,
									isValid,
									page: 2,
								});
							}}
							className={styles.input}
							style={{ borderColor: getColorError('dataNascimento') }}
						/>
						{invalidFields.includes('dataNascimento') && (
							<p className={styles.labelError}>Data de nascimento inválida</p>
						)}
					</div>

					<div>
						<InputMask
							placeholder="Nome completo da mãe*"
							mask={null}
							value={nomeDaMae.valor}
							onChange={(event) => {
								const { value } = event.target;
								const inputValue = value;
								let isValid = false;
								if (!verificarNomeCompleto(inputValue)) {
									isValid = false;
									const auxInvalidFields = [...invalidFields, 'nomeDaMae'];
									setFieldRedux('invalidFields', auxInvalidFields);
								} else {
									isValid = true;
									const auxInvalidFields = invalidFields.filter(
										(field: string) => field !== 'nomeDaMae'
									);
									setFieldRedux('invalidFields', auxInvalidFields);
								}
								handleValueChange({
									name: 'nomeDaMae',
									valor: inputValue,
									isValid: isValid,
									page: 2,
								});
							}}
							className={styles.input}
							style={{ borderColor: getColorError('nomeDaMae') }}
						/>
						{invalidFields.includes('nomeDaMae') && (
							<p className={styles.labelError}>Digite o nome completo</p>
						)}
					</div>

					{cpfCnpj.isCnpj && (
						<div>
							<InputMask
								mask="999.999.999-99"
								placeholder="CPF do sócio*"
								value={cpfSocio.valor}
								onChange={(event) => {
									const inputValue = event.target.value;
									const isValid = validateCpf(inputValue);
									console.log(isValid);
									if (!isValid) {
										const auxInvalidFields = [...invalidFields, 'cpfSocio'];
										setFieldRedux('invalidFields', auxInvalidFields);
									} else {
										const auxInvalidFields = invalidFields.filter(
											(field: string) => field !== 'cpfSocio'
										);
										setFieldRedux('invalidFields', auxInvalidFields);
									}
									handleValueChange({
										name: 'cpfSocio',
										valor: inputValue,
										isValid,
										page: 2,
									});
								}}
								className={styles.input}
								style={{ borderColor: getColorError('cpfSocio') }}
							/>
							<div
								className="input"
								style={{ padding: 10, userSelect: 'none', cursor: 'pointer' }}
							>
								<input
									type="checkbox"
									id="public-exposed"
									className="input"
									checked={publicExposed.valor}
									style={{ cursor: 'pointer' }}
									onChange={() => {
										setFieldRedux('publicExposed', {
											name: 'publicExposed',
											valor: !publicExposed.valor,
											isValid: true,
											page: 2,
										});
									}}
								/>
								<label
									htmlFor="public-exposed"
									style={{ color: '#fff', margin: 10, cursor: 'pointer' }}
								>
									Pessoa publicamente exposta
								</label>
							</div>
						</div>
					)}

					<PageButtons onBack={handlePreviousPage} onNext={handleNextPage} />
				</>
			)}

			{nPagina === 3 && (
				<>
					<div>
						<InputMask
							placeholder="CEP*"
							mask="99.999-999"
							value={cep.valor}
							onChange={async (event) => {
								const inputValue = event.target.value;
								let isValid = false;
								if (inputValue.length < 9) {
									isValid = false;
									const auxInvalidFields = [...invalidFields, 'cep'];
									setFieldRedux('invalidFields', auxInvalidFields);
								} else {
									isValid = true;
									const auxInvalidFields = invalidFields.filter(
										(field: string) => field !== 'cep'
									);
									setFieldRedux('invalidFields', auxInvalidFields);
								}
								handleValueChange({
									name: 'cep',
									valor: inputValue,
									isValid: isValid,
									page: 3,
								});
								if (inputValue.length === 10) {
									const response = await getAddressByCep(
										inputValue.replace(/\D/g, '')
									);
									const { data } = response;
									if (response.status === 200) {
										setFieldRedux('endereco', {
											name: 'endereco',
											valor: data.logradouro,
											isValid: true,
											page: 3,
										});
										setFieldRedux('bairro', {
											name: 'bairro',
											valor: data.bairro,
											isValid: true,
											page: 3,
										});
										setFieldRedux('cidade', {
											name: 'cidade',
											valor: data.localidade,
											isValid: true,
											page: 3,
										});
										setFieldRedux('estado', {
											name: 'estado',
											valor: data.uf,
											isValid: true,
											page: 3,
										});
									}
								}
							}}
							className={styles.input}
							style={{ borderColor: getColorError('cep') }}
						/>
						{invalidFields.includes('cep') && (
							<p className={styles.labelError}>Digite um CEP válido</p>
						)}
					</div>

					<div>
						<InputMask
							readOnly
							placeholder="Endereço*"
							mask={null}
							value={endereco.valor}
							onChange={(event) => {
								const inputValue = event.target.value;
								if (inputValue.length < 3) {
									const auxInvalidFields = [...invalidFields, 'endereco'];
									setFieldRedux('invalidFields', auxInvalidFields);
								} else {
									const auxInvalidFields = invalidFields.filter(
										(field: string) => field !== 'endereco'
									);
									setFieldRedux('invalidFields', auxInvalidFields);
								}
								handleValueChange({
									name: 'endereco',
									valor: inputValue,
									isValid: true,
									page: 3,
								});
							}}
							className={styles.input}
							style={{ borderColor: getColorError('endereco') }}
						/>
						{invalidFields.includes('endereco') && (
							<p className={styles.labelError}>Digite seu endereço</p>
						)}
					</div>

					<div>
						<InputMask
							placeholder="Número*"
							mask={null}
							value={numero.valor}
							onChange={(event) => {
								const inputValue = event.target.value;
								let isValid = false;
								if (inputValue.length < 1) {
									isValid = false;
									const auxInvalidFields = [...invalidFields, 'numero'];
									setFieldRedux('invalidFields', auxInvalidFields);
								} else {
									isValid = true;
									const auxInvalidFields = invalidFields.filter(
										(field: string) => field !== 'numero'
									);
									setFieldRedux('invalidFields', auxInvalidFields);
								}
								handleValueChange({
									name: 'numero',
									valor: inputValue,
									isValid: isValid,
									page: 3,
								});
							}}
							className={styles.input}
							style={{ borderColor: getColorError('numero') }}
						/>
						{invalidFields.includes('numero') && (
							<p className={styles.labelError}>Campo Inválido</p>
						)}
					</div>

					<div>
						<InputMask
							placeholder="Complemento"
							mask={null}
							value={complemento.valor}
							onChange={(event) => {
								const inputValue = event.target.value;
								handleValueChange({
									name: 'complemento',
									valor: inputValue,
									isValid: true,
									page: 3,
								});
							}}
							className={styles.input}
							style={{ borderColor: getColorError('complemento') }}
						/>
						{invalidFields.includes('complemento') && (
							<p className={styles.labelError}></p>
						)}
					</div>

					<div>
						<InputMask
							readOnly
							placeholder="Bairro*"
							mask={null}
							value={bairro.valor}
							onChange={(event) => {
								const inputValue = event.target.value;
								if (inputValue.length < 3) {
									const auxInvalidFields = [...invalidFields, 'bairro'];
									setFieldRedux('invalidFields', auxInvalidFields);
								} else {
									const auxInvalidFields = invalidFields.filter(
										(field: string) => field !== 'bairro'
									);
									setFieldRedux('invalidFields', auxInvalidFields);
								}
								handleValueChange({
									name: 'bairro',
									valor: inputValue,
									isValid: true,
									page: 3,
								});
							}}
							className={styles.input}
							style={{ borderColor: getColorError('bairro') }}
						/>
						{invalidFields.includes('bairro') && (
							<p className={styles.labelError}>Digite o nome do seu bairro</p>
						)}
					</div>

					<div>
						<InputMask
							readOnly
							placeholder="Cidade*"
							mask={null}
							value={cidade.valor}
							onChange={(event) => {
								const inputValue = event.target.value;
								if (inputValue.length < 3) {
									const auxInvalidFields = [...invalidFields, 'cidade'];
									setFieldRedux('invalidFields', auxInvalidFields);
								} else {
									const auxInvalidFields = invalidFields.filter(
										(field: string) => field !== 'cidade'
									);
									setFieldRedux('invalidFields', auxInvalidFields);
								}
								handleValueChange({
									name: 'cidade',
									valor: inputValue,
									isValid: true,
									page: 3,
								});
							}}
							className={styles.input}
							style={{ borderColor: getColorError('cidade') }}
						/>
						{invalidFields.includes('cidade') && (
							<p className={styles.labelError}>Digite o nome da sua cidade</p>
						)}
					</div>

					<div>
						<InputMask
							readOnly
							placeholder="Estado*"
							mask={null}
							value={estado.valor}
							onChange={(event) => {
								const inputValue = event.target.value;
								if (inputValue.length < 2) {
									const auxInvalidFields = [...invalidFields, 'estado'];
									setFieldRedux('invalidFields', auxInvalidFields);
								} else {
									const auxInvalidFields = invalidFields.filter(
										(field: string) => field !== 'estado'
									);
									setFieldRedux('invalidFields', auxInvalidFields);
								}
								handleValueChange({
									name: 'estado',
									valor: inputValue,
									isValid: true,
									page: 3,
								});
							}}
							className={styles.input}
							style={{ borderColor: getColorError('estado') }}
						/>
						{invalidFields.includes('estado') && (
							<p className={styles.labelError}>Digite o nome do seu estado</p>
						)}
					</div>

					<PageButtons onBack={handlePreviousPage} onNext={handleNextPage} />
				</>
			)}

			{nPagina === 4 && (
				<>
					<div>
						<InputMask
							placeholder="Telefone*"
							mask="(99) 99999-9999"
							value={telefone.valor}
							onChange={(event) => {
								const inputValue = event.target.value;
								let isValid = false;
								if (inputValue.length < 15) {
									isValid = false;
									const auxInvalidFields = [...invalidFields, 'telefone'];
									setFieldRedux('invalidFields', auxInvalidFields);
								} else {
									isValid = true;
									const auxInvalidFields = invalidFields.filter(
										(field: string) => field !== 'telefone'
									);
									setFieldRedux('invalidFields', auxInvalidFields);
								}
								handleValueChange({
									name: 'telefone',
									valor: inputValue,
									isValid: isValid,
									page: 4,
								});
							}}
							className={styles.input}
							style={{ borderColor: getColorError('telefone') }}
						/>
						{invalidFields.includes('telefone') && (
							<p className={styles.labelError}>Digite um telefone válido</p>
						)}
					</div>
					<>
						{!telefoneSent ? (
							<div>
								<Buttom
									onClick={() => {
										handleSendCode('sms', telefone.valor.replace(/\D/g, ''));
									}}
								>
									Enviar Código de Verificação
								</Buttom>
								<PageButtons onBack={handlePreviousPage} onNext={handleNextPage} showNext={false} />
							</div>
						) : (
							<div>
								<InputMask
									placeholder="Código de Verificação*"
									mask="999999"
									value={telefoneCode.valor}
									onChange={(event) => {
										const inputValue = event.target.value.replace(/\D/g, '');
										if (inputValue.length < 6) {
											const auxInvalidFields = [
												...invalidFields,
												'telefoneCode',
											];
											setFieldRedux('invalidFields', auxInvalidFields);
										} else {
											const auxInvalidFields = invalidFields.filter(
												(field: string) => field !== 'telefoneCode'
											);
											setFieldRedux('invalidFields', auxInvalidFields);
										}
										handleValueChange({
											name: 'telefoneCode',
											valor: inputValue,
											isValid: true,
											page: 4,
										});
									}}
									className={styles.input}
									style={{ borderColor: getColorError('telefoneCode') }}
								/>
								<div>
									<Buttom
										onClick={() => {
											handleVerifyCode(
												telefoneCode.valor.replace(/\D/g, ''),
												'sms',
												telefone.valor.replace(/\D/g, '')
											);
										}}
									>
										Verificar Código
									</Buttom>
									<Buttom
										onClick={() => {
											handleSendCode('sms', telefone.valor.replace(/\D/g, ''));
										}}
									>
										Reenviar Código
									</Buttom>
									<PageButtons onBack={handlePreviousPage} onNext={handleNextPage} showNext={false} />
								</div>
							</div>
						)}
					</>
				</>
			)}

			{nPagina === 5 && (
				<>
					<div>
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
						{invalidFields.includes('email') && (
							<p className={styles.labelError}>Digite um e-mail válido</p>
						)}
					</div>
					{!emailSent ? (
						<>
							<div>
								<Buttom
									onClick={() => {
										handleSendCode('email', email.valor);
									}}
								>
									Enviar Código de Verificação
								</Buttom>
								<PageButtons onBack={handlePreviousPage} onNext={handleNextPage} showNext={false} />
							</div>
						</>
					) : (
						<div>
							<div>
								<InputMask
									placeholder="Código de Verificação*"
									mask="999999"
									value={emailCode.valor}
									onChange={(event) => {
										const inputValue = event.target.value.replace(/\D/g, '');
										if (inputValue.length < 6) {
											const auxInvalidFields = [...invalidFields, 'emailCode'];
											setFieldRedux('invalidFields', auxInvalidFields);
										} else {
											const auxInvalidFields = invalidFields.filter(
												(field: string) => field !== 'emailCode'
											);
											setFieldRedux('invalidFields', auxInvalidFields);
										}
										handleValueChange({
											name: 'emailCode',
											valor: inputValue,
											isValid: true,
											page: 4,
										});
									}}
									className={styles.input}
									style={{ borderColor: getColorError('emailCode') }}
								/>
							</div>
							<Buttom
								onClick={() => {
									handleVerifyCode(
										emailCode.valor.replace(/\D/g, ''),
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
							<PageButtons onBack={handlePreviousPage} onNext={handleNextPage} showNext={false} />
						</div>
					)}
				</>
			)}

			{nPagina === 6 && (
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

			{nPagina === 7 && (
				<>
					<div className={styles.rowStyle}>
						<p className={styles.labelSuccess}>
							<br />
							Seu pré-cadastro foi realizado!
							<br />
							<br />
							Agora precisamos da{'\n'}indentificação dos{'\n'}seus documentos
							<br />
							<br />
							<PageButtons showBack={false} onNext={() => handleIdWall()} />
						</p>
					</div>
				</>
			)}

			{nPagina === 8 && (
				<>
					<div className={styles.rowStyle}>
						<p className={styles.labelAlert} style={{ fontSize: '1.3rem' }}>
							<br />
							Houve um erro ☹️
							<br />
							<br />
							Tente novamente mais tarde!
						</p>
					</div>
				</>
			)}

			<Loading isLoading={isLoading} />
		</ContainerCadastro>
	);
};

const mapStateToProps = (state: any) => {
	return {
		allFields: getPropSegura(state, ['userRegisterReducer'], {}),
		invalidFields: getPropSegura(
			state,
			['userRegisterReducer', 'invalidFields'],
			[]
		),
		cpfCnpj: getPropSegura(state, ['userRegisterReducer', 'cpfCnpj'], {
			valor: '',
			isCpf: true,
			isCnpj: false,
			isValid: false,
			page: 1,
		}),
		nomeCompleto: getPropSegura(
			state,
			['userRegisterReducer', 'nomeCompleto'],
			{
				valor: '',
				isValid: false,
				page: 2,
			}
		),
		cpfSocio: getPropSegura(state, ['userRegisterReducer', 'cpfSocio'], {
			valor: '',
			isValid: false,
			page: 2,
		}),
		publicExposed: getPropSegura(
			state,
			['userRegisterReducer', 'publicExposed'],
			{
				valor: false,
				isValid: true,
				page: 2,
			}
		),
		nomeFantasia: getPropSegura(
			state,
			['userRegisterReducer', 'nomeFantasia'],
			{
				valor: '',
				isValid: false,
				page: 1,
			}
		),
		razaoSocial: getPropSegura(state, ['userRegisterReducer', 'razaoSocial'], {
			valor: '',
			isValid: false,
			page: 1,
		}),
		empresaTelefone: getPropSegura(
			state,
			['userRegisterReducer', 'empresaTelefone'],
			{
				valor: '',
				isValid: false,
				page: 1,
			}
		),
		empresaCep: getPropSegura(state, ['userRegisterReducer', 'empresaCep'], {
			valor: '',
			isValid: false,
			page: 1,
		}),
		empresaEndereco: getPropSegura(
			state,
			['userRegisterReducer', 'empresaEndereco'],
			{
				valor: '',
				isValid: false,
				page: 1,
			}
		),
		empresaNumero: getPropSegura(
			state,
			['userRegisterReducer', 'empresaNumero'],
			{
				valor: '',
				isValid: false,
				page: 1,
			}
		),
		empresaComplemento: getPropSegura(
			state,
			['userRegisterReducer', 'empresaComplemento'],
			{
				valor: '',
				isValid: true,
				page: 1,
			}
		),
		empresaBairro: getPropSegura(
			state,
			['userRegisterReducer', 'empresaBairro'],
			{
				valor: '',
				isValid: false,
				page: 1,
			}
		),
		empresaCidade: getPropSegura(
			state,
			['userRegisterReducer', 'empresaCidade'],
			{
				valor: '',
				isValid: false,
				page: 1,
			}
		),
		empresaEstado: getPropSegura(
			state,
			['userRegisterReducer', 'empresaEstado'],
			{
				valor: '',
				isValid: false,
				page: 1,
			}
		),
		dataNascimento: getPropSegura(
			state,
			['userRegisterReducer', 'dataNascimento'],
			{
				valor: '',
				isValid: false,
				page: 2,
			}
		),
		nomeDaMae: getPropSegura(state, ['userRegisterReducer', 'nomeDaMae'], {
			valor: '',
			isValid: false,
			page: 2,
		}),
		cep: getPropSegura(state, ['userRegisterReducer', 'cep'], {
			valor: '',
			isValid: false,
			page: 3,
		}),
		endereco: getPropSegura(state, ['userRegisterReducer', 'endereco'], {
			valor: '',
			isValid: false,
			page: 3,
		}),
		numero: getPropSegura(state, ['userRegisterReducer', 'numero'], {
			valor: '',
			isValid: false,
			page: 3,
		}),
		complemento: getPropSegura(state, ['userRegisterReducer', 'complemento'], {
			valor: '',
			isValid: true,
			page: 3,
		}),
		bairro: getPropSegura(state, ['userRegisterReducer', 'bairro'], {
			valor: '',
			isValid: false,
			page: 3,
		}),
		cidade: getPropSegura(state, ['userRegisterReducer', 'cidade'], {
			valor: '',
			isValid: false,
			page: 3,
		}),
		estado: getPropSegura(state, ['userRegisterReducer', 'estado'], {
			valor: '',
			isValid: false,
			page: 3,
		}),
		telefone: getPropSegura(state, ['userRegisterReducer', 'telefone'], {
			valor: '',
			isValid: false,
			page: 4,
		}),
		telefoneCode: getPropSegura(
			state,
			['userRegisterReducer', 'telefoneCode'],
			{
				valor: '',
				isValid: false,
				page: 4,
			}
		),
		telefoneSent: getPropSegura(
			state,
			['userRegisterReducer', 'telefoneSent'],
			false
		),
		email: getPropSegura(state, ['userRegisterReducer', 'email'], {
			valor: '',
			isValid: false,
			page: 5,
		}),
		emailCode: getPropSegura(state, ['userRegisterReducer', 'emailCode'], {
			valor: '',
			isValid: false,
			page: 5,
		}),
		emailSent: getPropSegura(
			state,
			['userRegisterReducer', 'emailSent'],
			false
		),
		senha: getPropSegura(state, ['userRegisterReducer', 'senha'], {
			valor: '',
			isValid: false,
			page: 6,
		}),
		confirmarSenha: getPropSegura(
			state,
			['userRegisterReducer', 'confirmarSenha'],
			{
				valor: '',
				isValid: false,
				page: 6,
			}
		),
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		setFieldRedux: (field: string, value: string) => {
			dispatch(setUserRegisterField(field, value));
		},
		resetUserRegisterDataRedux: () => {
			dispatch(resetUserRegisterData());
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CadastrarConta);

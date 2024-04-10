/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import Select from 'react-select';
import { useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import Alert from '@mui/material/Alert';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import Modal from 'react-modal';

import styles from './styles.module.scss';

import { yupResolver } from '@hookform/resolvers/yup';

import { Spinner } from '../../components/Spinner/Spinner';

import { cpfMask } from '../../utils/cpfMask';

import { InputFormBit } from '../ui/InputFormBit';

import getImg from '../../assets';

import GeraTokenChavePixEmail from '../../validacoes/GeraTokenChavePixEmail';
import ValidaChaveTokemEmail from '../../validacoes/ValidaChaveTokemEmail';
import CadastraChavePix from '../../validacoes/CadastraChavePix';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

interface DadosProRetornoFunction {
	statusCode?: Number;
	response?: JSON;
	statusErrot?: boolean;
}

type dadosInputGFormProps = {
	optionTipoChave: Number;
	getKeyCpf: string;
	getKeyCnpj: string;
	getKeyEmail: string;
	getKeyTelefone: string;
};

type ParamForm = {
	onFinish?: Function;
};

export function FormCadastrarChavePix({ onFinish, ...rest }: ParamForm) {
	const user = useSelector((state: any) => state.userReducer.user);

	const [getOptionPix, setGetOptionPix] = useState('');
	const [modalValidaEmailPix, setModalValidaEmailPix] = useState(false);
	const [modalsucessoCadastrarChavePix, setModalsucessoCadastrarChavePix] =
		useState(false);
	const [modalIsOpen, setIsOpen] = useState(false);

	const [stateRecebeChavePix, setStateRecebeChavePix] = useState('');
	const [codigoValidacao, setCodigoValidacao] = useState('');
	const [erroMensageRetorno, setErroMensageRetorno] = useState('');
	const [erroCodeRetorno, setErroCodeRetorno] = useState('');
	const [messageChavePix, setMessageChavePix] = useState('');
	const [tipoMessageChavePix, setTipoMessageChavePix] = useState('');
	const [stringChaveParaValidar, setStringChaveParaValidar] = useState('');
	const [inputCpf, setInputCpf] = useState('');

	const optionsKeyPix = [
		{ id: 1, value: 2, label: 'CPF' },
		{ id: 3, value: 3, label: 'CNPJ' },
		{ id: 4, value: 4, label: 'E-mail' },
		{ id: 5, value: 5, label: 'Telefone' },
		{ id: 6, value: 6, label: 'Aleatória' },
		//{ id: 7, value: 7, label: 'Copia e Cola' },
	];

	let	alterOptionPix = [];
	if(user.tipoConta == 'PF'){
		  alterOptionPix = optionsKeyPix.filter(option => option.id !== 3);
	}else{
		  alterOptionPix = optionsKeyPix.filter(option => option.id !== 2);
	}

	const validProductValues = alterOptionPix.map(({ value }) => value);

	const schema = yup.object().shape({
		//  optionTipoChave: yup.number().integer().required('Tipo chave é obrigatório'),
		optionTipoChave: yup
			.number()
			.oneOf(validProductValues)
			.required('Tipo chave é obrigatório'),

		getKeyCpf: yup
			.string()
			.when('optionTipoChave', (optionTipoChave: any[], schema) => {
				if (optionTipoChave[0] == 2) {
					setStringChaveParaValidar('cpf');
					return schema
						.min(14, 'minimo de 14 caracteres')
						.max(14, 'maximo de 14 caracteres')
						.required('Chave obrigatória');
				}
			}),

		getKeyCnpj: yup
			.string()
			.when('optionTipoChave', (optionTipoChave, schema) => {
				if (optionTipoChave[0] == 3) {
					setStringChaveParaValidar('cnpj');
					return schema
						.min(14, 'minimo de 14 caracteres')
						.max(14, 'maximo de 14 caracteres')
						.required('Chave obrigatória');
				}
			}),

		getKeyEmail: yup
			.string()
			.when('optionTipoChave', (optionTipoChave, schema) => {
				if (optionTipoChave[0] == 4) {
					setStringChaveParaValidar('email');
					return schema.email().required('Chave obrigatória');
				}
			}),

		getKeyTelefone: yup
			.string()
			.when('optionTipoChave', (optionTipoChave, schema) => {
				if (optionTipoChave[0] == 5) {
					setStringChaveParaValidar('telefone');
					return schema
						.min(11, 'minimo de 11 caracteres')
						.max(11, 'maximo de 11 caracteres')
						.required('Chave obrigatória');
				}
			}),
	});

	const {
		control,
		setValue,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<dadosInputGFormProps>({
		mode: 'onChange',
		resolver: yupResolver(schema),
	});

	async function handleCadastrar(data) {
		setIsOpen(true);
		let tipoChaveRecebida = null;
		let dadosChaveGeral = {};
		let tipoChaveString = '';

		let retonoFunctionChave: DadosProRetornoFunction = {};
		console.log('opação aqui ', data.optionTipoChave);
		switch (data.optionTipoChave) {
			case 2:
				setStateRecebeChavePix(data.getKeyCpf);
				dadosChaveGeral = {
					tipo_chave: stringChaveParaValidar,
					chave: data.getKeyCpf.replace(/\D/g, ''),
					numeroDaConta: user.numeroConta,
				};
				// cpf, aleatoria, cnpj,
				tipoChaveRecebida = data.getKeyCpf;
				retonoFunctionChave = await CadastraChavePix(dadosChaveGeral);
				break;

			case 3:
				setStateRecebeChavePix(data.getKeyCnpj);
				dadosChaveGeral = {
					tipo_chave: stringChaveParaValidar,
					chave: data.getKeyCnpj,
					numeroDaConta: user.numeroConta,
				};
				// cpf, aleatoria, cnpj,
				tipoChaveRecebida = data.getKeyCnpj;
				retonoFunctionChave = await CadastraChavePix(dadosChaveGeral);
				break;

			case 4:
				setStateRecebeChavePix(data.getKeyEmail);
				tipoChaveRecebida = data.getKeyEmail;
				tipoChaveString = 'E-mail';
				retonoFunctionChave = await GeraTokenChavePixEmail(data, 'email');
				break;

			case 5:
				console.log('aqui e telefone');
				console.log('Telefone cadastrar chave', data.getKeyTelefone)
				setStateRecebeChavePix(data.getKeyTelefone);
				tipoChaveRecebida = data.getKeyTelefone;
				tipoChaveString = 'Telefone';
				retonoFunctionChave = await GeraTokenChavePixEmail(data, 'telefone');
				break;

			case 6:
				setStateRecebeChavePix('aleatoria');
				dadosChaveGeral = {
					tipo_chave: 'aleatoria',
					chave: 'aleatoria',
					numeroDaConta: user.numeroConta,
				};
				// cpf, aleatoria, cnpj,
				tipoChaveRecebida = data.getKeyCnpj;
				retonoFunctionChave = await CadastraChavePix(dadosChaveGeral);
			// eslint-disable-next-line no-fallthrough
			default:
				console.log('aqui');
				break;
		}

		console.log('email ou telefone', stateRecebeChavePix);

		switch (retonoFunctionChave.statusCode) {
			case 201:
				setMessageChavePix(`Chave pix cadastrada com sucesso!`);
				setTipoMessageChavePix('success');
				setModalValidaEmailPix(false);
				setModalsucessoCadastrarChavePix(true);
				//  retonoFunctionChave
				break;
			case 200:
				setMessageChavePix(
					`Um código foi enviado para o ${tipoChaveString} ${tipoChaveRecebida}`
				);
				setTipoMessageChavePix('success');
				setModalValidaEmailPix(true);
				//  retonoFunctionChave
				break;
			case 404:
				setMessageChavePix('Erro de requisição');
				setTipoMessageChavePix('error');
				setModalValidaEmailPix(true);
				break;
			case 400:
				setMessageChavePix('Dados inválidos para cadastrar chave pix');
				setTipoMessageChavePix('error');
				setModalValidaEmailPix(true);
				break;
			default:
				break;
		}
		setIsOpen(false);
	}

	async function validaChevePix(e) {
		e.preventDefault();
		setIsOpen(true);
		console.log('valida codigo envio', stringChaveParaValidar);
		//let retonoFunctionChaveValidacode = {}
		let retonoFunctionChaveValidacode: DadosProRetornoFunction = {};
		const dadosValidaChave = {
			chave: stateRecebeChavePix,
			code: codigoValidacao,
			tipoChaveString: stringChaveParaValidar,
		};

		switch (stringChaveParaValidar) {
			case 'email':
				retonoFunctionChaveValidacode = await ValidaChaveTokemEmail(
					dadosValidaChave
				);
				break;

			case 'telefone':
				retonoFunctionChaveValidacode = await ValidaChaveTokemEmail(
					dadosValidaChave
				);
				break;
			default:
				break;
		}

		//let retonoFunctionCadastraChavePix = {}
		let retonoFunctionCadastraChavePix: DadosProRetornoFunction = {};
		const dadosCadastrarChavePix = {
			tipo_chave: stringChaveParaValidar,
			chave: stateRecebeChavePix,
			numeroDaConta: user.numeroConta,
		};
		switch (retonoFunctionChaveValidacode.statusCode) {
			case 200:
				setMessageChavePix('Código validado com sucesso!!');
				setTipoMessageChavePix('success');
				setModalValidaEmailPix(true);
				//  retonoFunctionChave
				retonoFunctionCadastraChavePix = await CadastraChavePix(
					dadosCadastrarChavePix
				);
				break;

			case 404:
				setMessageChavePix('Código inválido!!');
				setTipoMessageChavePix('error');
				setModalValidaEmailPix(true);
				break;

			case 400:
				setMessageChavePix('Dados invalidos ');
				setTipoMessageChavePix('error');
				setModalValidaEmailPix(true);
				break;

			default:
				break;
		}

		switch (retonoFunctionCadastraChavePix.statusCode) {
			case 201:
				setMessageChavePix('Chave PIX cadastrada com sucesso!');
				setTipoMessageChavePix('success');
				setModalValidaEmailPix(false);
				setModalsucessoCadastrarChavePix(true);
				break;

			case 404:
				setMessageChavePix('Código inválido!');
				setTipoMessageChavePix('error');
				setModalValidaEmailPix(true);
				break;
			case 400:
				setMessageChavePix('Dados inválidos para cadastrar chave pix');
				setTipoMessageChavePix('error');
				setModalValidaEmailPix(true);
				break;
			case 422:
				setMessageChavePix('Dados inválidos para cadastrar chave pix');
				setTipoMessageChavePix('error');
				setModalValidaEmailPix(true);
				break;

			default:
				break;
		}

		setIsOpen(false);
	}

	function closeModal() {
		// setValorTransacao({});
		setModalValidaEmailPix(false);
		setModalsucessoCadastrarChavePix(false);
		setErroCodeRetorno('');
		setErroMensageRetorno('');
	}

	function closeModalSucesso() {
		// setValorTransacao({});
		setModalValidaEmailPix(false);
		setModalsucessoCadastrarChavePix(false);
		setErroCodeRetorno('');
		setErroMensageRetorno('');
		onFinish();
	}

	useEffect(() => {
		console.log(getOptionPix);
		let retonoFunctionChaveValidacode: DadosProRetornoFunction = {};
		if (getOptionPix == '6') {
			setIsOpen(true);
			const chavealeatoria = async () => {
				const dadosChaveGeral = {
					tipo_chave: 'aleatoria',
					chave: 'aleatoria',
					numeroDaConta: user.numeroConta,
				};
				try {
					 retonoFunctionChaveValidacode = await CadastraChavePix(dadosChaveGeral);
					if(retonoFunctionChaveValidacode.statusCode != 201){
						toast.error(`Tipo de chave invalida`, {
							position: 'top-center',
							autoClose: 5000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							theme: 'colored',
						});
					}
					onFinish();
					setIsOpen(false);
				} catch (error) {
					console.log(error);
					setIsOpen(false);
				} finally {
					setIsOpen(false);
				}
			};
			chavealeatoria();
		}
		if (getOptionPix == '2' || getOptionPix == '3' ) {
			let dadosChaveGeral = {};
			switch(getOptionPix){
				case "2":
					dadosChaveGeral = {
						tipo_chave: 'cpf',
						chave: user.docCliente.replace(/\D/g, ''),
						numeroDaConta: user.numeroConta,
					};
					break;
					case "3":
					dadosChaveGeral = {
						tipo_chave: 'cnpj',
						chave: user.docCliente.replace(/\D/g, ''),
						numeroDaConta: user.numeroConta,
					};
					break;
			}
			setIsOpen(true);
			const chaveCpfCnpj = async () => {

				try {
					retonoFunctionChaveValidacode = await CadastraChavePix(dadosChaveGeral);
					if(retonoFunctionChaveValidacode.statusCode != 201){
						toast.error(`Tipo de chave invalida`, {
							position: 'top-center',
							autoClose: 5000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							theme: 'colored',
						});
					}
					onFinish();
					setIsOpen(false);
				
				} catch (error) {
					console.log(error);
					toast.error(`Tipo de chave invalida`, {
						position: 'top-center',
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						theme: 'colored',
					});
					setIsOpen(false);
				} finally {
					//setIsLoading(false);
					setIsOpen(false);
				}
			};
			chaveCpfCnpj();
		}
	}, [getOptionPix]);

	return (
		<div className={styles.containerTransferencia}>
			{modalIsOpen ? <Spinner /> : ''}
			<form className={styles.formPix} onSubmit={handleSubmit(handleCadastrar)}>
				<section className={styles.containerFormCadPix}>
					<div className={styles.iputGroup}>
						<div className={styles.containerInut}>
							<Controller
								control={control}
								name="optionTipoChave"
								render={({ field: { onChange, value } }) => (
									<Select
										options={alterOptionPix}
										className="form-control w-full"
										value={alterOptionPix.find((c) => c.value === value)}
										onChange={(val) => {
											onChange(val.value);
											setGetOptionPix(val.value.toString());
										}}
									/>
								)}
							/>

							{errors.optionTipoChave && (
								<p className={styles.erroInputForm}>
									{errors.optionTipoChave?.message}
								</p>
							)}
						</div>
					</div>

					{getOptionPix == '2' && (
						<div className={styles.iputGroupChave}>
							<label>Digite a chave</label>

							<div>
								<Controller
									control={control}
									name="getKeyCpf"
									render={({ field: { onChange, onBlur } }) => (
										<InputFormBit
											placeholder="CPF"
											type="text"
											//onChange={onChange}
											onChange={(e) => {
												onChange(inputCpf);
												setInputCpf(cpfMask(e.target.value));
											}}
											onBlur={onBlur}
											value={inputCpf}
										/>
									)}
								/>

								{errors.getKeyCpf && (
									<p className={styles.erroInputForm}>
										{errors.getKeyCpf?.message}
									</p>
								)}
							</div>
						</div>
					)}

					{getOptionPix == '3' && (
						<div className={styles.iputGroupChave}>
							<label>Digite a chave</label>

							<div>
								<Controller
									control={control}
									name="getKeyCnpj"
									render={({ field: { onChange, onBlur, value } }) => (
										<InputFormBit
											placeholder="CNPJ"
											type="text"
											onChange={onChange}
											onBlur={onBlur}
											value={value}
										/>
									)}
								/>
								{errors.getKeyCnpj && (
									<p className={styles.erroInputForm}>
										{errors.getKeyCnpj?.message}
									</p>
								)}
							</div>
						</div>
					)}

					{getOptionPix == '4' && (
						<div className={styles.iputGroupChave}>
							<label>Digite a chave</label>
							<div>
								<Controller
									control={control}
									name="getKeyEmail"
									render={({ field: { onChange, onBlur, value } }) => (
										<InputFormBit
											placeholder="E-mail"
											type="text"
											onChange={onChange}
											onBlur={onBlur}
											value={value}
										/>
									)}
								/>
								{errors.getKeyEmail && (
									<p className={styles.erroInputForm}>
										{errors.getKeyEmail?.message}
									</p>
								)}
							</div>
						</div>
					)}

					{getOptionPix == '5' && (
						<div className={styles.iputGroupChave}>
							<label>Digite a chave</label>
							<div>
								<Controller
									control={control}
									name="getKeyTelefone"
									render={({ field: { onChange, onBlur, value } }) => (
										<InputFormBit
											placeholder="Telefone"
											type="text"
											onChange={onChange}
											onBlur={onBlur}
											value={value}
										/>
									)}
								/>
								{errors.getKeyTelefone && (
									<p className={styles.erroInputForm}>
										{errors.getKeyTelefone?.message}
									</p>
								)}
							</div>
						</div>
					)}

					{erroMensageRetorno != '' && (
						<Alert variant="filled" severity="error">
							Codigo {erroCodeRetorno}. {erroMensageRetorno}
						</Alert>
					)}

					<div className={styles.buttomSubmitDadosPix}>
						<button
							type="submit"
							//  onClick={() => handleSandPix()}
							// loading={false}
						>
							CONTINUAR
						</button>
					</div>
				</section>
			</form>

			{/* MODAL VALIDA EMAIL AQUI */}

			<div className={styles.recebeContainerModal}>
				<Modal
					className={styles.modalContainerSucesso}
					isOpen={modalValidaEmailPix}
					disablePortal
					disableEnforceFocus
					disableAutoFocus
					open
					contentLabel="Modal"
				>
					<section className={styles.containerModalPixSucesso}>
						<header className={styles.headerModal}>
							<Image
								className={styles.imgBithLogo}
								src={getImg('logo.png')}
								alt="logo"
							/>
						</header>

						<div className={styles.dadosDetalhesPagamento}>
							<div className={styles.tituloSucesso}>
								{tipoMessageChavePix == 'error' && (
									<Alert variant="outlined" severity="error">
										{messageChavePix}
									</Alert>
								)}

								{tipoMessageChavePix == 'success' && (
									<Alert
										variant="outlined"
										iconMapping={{
											success: <CheckCircleOutlineIcon fontSize="inherit" />,
										}}
									>
										{messageChavePix}
									</Alert>
								)}
							</div>

							<div>
								<form
									className={styles.formValidaEmailPix}
									onSubmit={validaChevePix}
								>
									<label>insira o código:</label>
									<InputFormBit
										type="text"
										placeholder="Código"
										onChange={(e) => setCodigoValidacao(e.target.value)}
									/>
									<div className={styles.containerbuttomCadastraChavePix}>
										<button
											className={styles.containerBtnCadastrar}
											type="submit"
											//  onClick={() => handleSandPix()}
											// loading={false}
										>
											CONTINUAR
										</button>
										<p>&nbsp;</p>
										<button
											className={styles.containerBtnCancelar}
											type="button"
											onClick={() => closeModal()}
											// loading={false}
										>
											CANCELAR
										</button>
									</div>
								</form>
							</div>
						</div>
					</section>
				</Modal>

				{/* MODAL CADASTRA CHAVE PIX SUCESSO*/}
				<Modal
					className={styles.modalContainerSucesso}
					isOpen={modalsucessoCadastrarChavePix}
					disablePortal
					disableEnforceFocus
					disableAutoFocus
					open
					contentLabel="Example Modal"
				>
					<section className={styles.containerModalPixSucesso}>
						<header className={styles.headerModal}>
							<Image
								className={styles.imgBithLogo}
								src={getImg('logo.png')}
								alt="logo"
							/>
						</header>

						<div className={styles.dadosDetalhesPagamento}>
							<div className={styles.tituloSucesso}>
								<Alert
									variant="outlined"
									iconMapping={{
										success: <CheckCircleOutlineIcon fontSize="inherit" />,
									}}
								>
									{messageChavePix}
								</Alert>
							</div>
							<div className={styles.containerbuttomCadastraChavePix}>
								<button
									className={styles.containerBtnCancelar}
									type="button"
									onClick={() => closeModalSucesso()}
								>
									FECHAR
								</button>
							</div>
						</div>
					</section>
				</Modal>
			</div>
		</div>
	);
}

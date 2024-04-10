/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import Image from 'next/image';

import styles from './styles.module.scss';

import InputMask from 'react-input-mask';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { Buffer } from 'buffer';
import { yupResolver } from '@hookform/resolvers/yup';

import { cnpjMask, moneyMask, formaTavalorCelcoin } from '../../utils/cpfMask';
import { toast } from 'react-toastify';
import { Spinner } from '../../components/Spinner/Spinner';

import { Buttom, ButtomWarning } from '../../components/ui/Buttom';
import { useCountDows } from '../../lib/cronometro';
import Alert from '@mui/material/Alert';

import Select from 'react-select';
import { InputFormBit } from '../ui/InputFormBit';

import GetDateNoW from '../../utils/functions/GetDateNow';
import { formatarCPFeCNPJ, maskPhone } from '../../utils/maks';
import { numeroParaReal } from '../../utils/maks';

import { pixCachOut } from '../../api/transacoesPix';
import { smsOuEmail, validaMobile } from '../../api/validacaoTelefoneEmail';

import Qrcode from 'react-qr-code';
import QR from 'qrcode-base64';
/* sem uso ate o momento biblioteca de compartilhamento em redes sociais
import {
	FacebookShareButton,
	FacebookIcon,
	WhatsappShareButton,
	WhatsappIcon
} from "react-share";
*/
import { AiOutlineCloseCircle, AiFillCheckCircle } from 'react-icons/ai';

import Modal from 'react-modal';

import { setupAPIClient } from '../../services/api';

import { AxiosError } from 'axios';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import getImg from '../../assets';

interface TransferenciasPropos {
	tipo?: string;
	valorTr: string;
}

type dadosInputGFormProps = {
	optionTipoChave: number;
	getKeyCopyPaste: string;
	getKeyCpf: string;
	getKeyCnpj: string;
	getKeyEmail: string;
	getKeyTelefone: string;
	getKeyAleatoria: string;
	valorDoPix: string;
	agencia: string;
	conta: string;
	nomeFavorecido: string;
	docFavorecido: string;
	addFavodecido: boolean;
	tipoConta: string;
	tipoTransacao: string;
	finalidade: string;
	descricao: string;
	agendamento: string;
	valorTransferencia: string;
	menssagem: string;
};

type TypeDadossucesso = {
	status: string;
	version: string;
	body: {
		id: string;
		amount: number;
		clientCode: string;
		transactionIdentification: string;
		endToEndId: string;
		initiationType: string;
		paymentType: string;
		urgency: string;
		transactionType: string;
		debitParty: {
			account: string;
			branch: string;
			taxId: string;
			name: string;
			accountType: string;
		};
		creditParty: {
			bank: string;
			key: string;
			account: string;
			branch: string;
			taxId: string;
			name: string;
			accountType: string;
		};

		remittanceInformation: string;
	};
};

interface typeContaPix {
	keyType: string;
	key: string;
	account: {
		participant: string;
		branch: string;
		account: string;
		accountType: string;
		createDate: string;
	};
	owner: {
		type: string;
		documentNumber: string;
		name: string;
	};
	endtoEndId: string;
}

export function FormPix({ tipo, valorTr, ...rest }: TransferenciasPropos) {
	const user = useSelector((state: any) => state.userReducer.user);
	const apiClient = setupAPIClient();

	const [getOptionPix, setGetOptionPix] = useState('');
	const [valorTransacao, setValorTransacao] = useState('0');
	const [validaMaskValor, setValidaMaskValor] = useState('');
	const [menssagemPix, setMenssagemPix] = useState('');
	const [modalIsOpen, setIsOpen] = useState(false);
	const [loadSpinerModal, setLoadSpinerModal] = useState(false);
	const [dadosDoPixOrigen, setDadosDoPixOrigen] = useState<typeContaPix>();
	const [dadosDoPixDestino, setDadosDoPixDestino] = useState([]);
	const [erroMensageRetorno, setErroMensageRetorno] = useState('');
	const [erroCodeRetorno, setErroCodeRetorno] = useState('');
	const [modalRetornoTransacao, setModalRetornoTransacao] = useState(false);
	const [validaMaskTelefone, setValidaMaskTelefone] = useState('');
	const [inputCpf, setInputCpf] = useState('');
	const [validaGetCnpj, setValidaGetCnpj] = useState('');
	const [inputEmail, setInputEmail] = useState('');
	const [inputcopiaEcola, setInputcopiaEcola] = useState('');
	const [inputAleatorio, setInputAleatorio] = useState('');
	const [dadosRetornoTransacao, setDadosRetornoTransacao] =
		useState<TypeDadossucesso>();
	const [codigoValidacao, setCodigoValidacao] = useState('');
	const [borderInputCodigo, setBorderInputCodigo] = useState(false);
	const [linkBase64, setLinkBase64] = useState('');
	const [abilitaQrCode, setAbilitaQrCode] = useState(false);
	const [startPause, setStartPause] = useState(false);
	const shareUrl = 'https://www.pakkamarwadi.tk';
	const hoursMinSecs = { hours: 0, minutes: 0, seconds: 30 };
	let erroRetonoCod = '';
	let erroRetonoMensage = '';

	const schema = yup.object().shape({
		optionTipoChave: yup
			.number()
			.integer()
			.required('Tipo chave é obrigatório'),

		getKeyCopyPaste: yup
			.string()
			.when('optionTipoChave', (optionTipoChave: any[], schema) => {
				if (optionTipoChave[0] == 1) {
					setGetOptionPix(optionTipoChave[0]);
					return schema.required('Chave copia obrigatória');
				}
			}),

		getKeyCpf: yup
			.string()
			.when('optionTipoChave', (optionTipoChave, schema) => {
				if (optionTipoChave[0] == 2 && inputCpf.length < 10) {
					console.log('tamonho cpf', inputCpf.length);
					setGetOptionPix(optionTipoChave[0]);
					return schema
						.min(11, 'minimo de 11 caracteres')
						.max(11, 'maximo de 11 caracteres')
						.required('Chave obrigatória');
				}
			}),

		getKeyCnpj: yup
			.string()
			.when('optionTipoChave', (optionTipoChave, schema) => {
				console.log('tamonho cnpj', validaGetCnpj.length);
				if (optionTipoChave[0] == 3 && validaGetCnpj.length < 18) {
					console.log('tipo chave', optionTipoChave[0]);
					setGetOptionPix(optionTipoChave[0]);
					return schema
						.min(18, 'minimo de 14 caracteres')
						.max(18, 'maximo de 14 caracteres')
						.required('Chave obrigatória');
				}
			}),

		getKeyEmail: yup
			.string()
			.when('optionTipoChave', (optionTipoChave, schema) => {
				if (optionTipoChave[0] == 4) {
					console.log('aqui');
					setGetOptionPix(optionTipoChave[0]);
					return schema.email().required('Chave obrigatória');
				}
			}),

		getKeyTelefone: yup
			.string()
			.when('optionTipoChave', (optionTipoChave, schema) => {
				console.log('tamonho Telefone', validaMaskTelefone.length);
				if (optionTipoChave[0] == 5 && validaMaskTelefone.length < 10) {
					console.log('tipo chave', optionTipoChave[0]);
					setGetOptionPix(optionTipoChave[0]);
					return schema
						.min(10, 'minimo de 14 caracteres')
						.max(10, 'maximo de 14 caracteres')
						.required('Chave obrigatória');
				}
			}),

		getKeyAleatoria: yup
			.string()
			.when('optionTipoChave', (optionTipoChave, schema) => {
				if (optionTipoChave[0] == 6) {
					console.log('aqui');
					setGetOptionPix(optionTipoChave[0]);
					return schema.required('Chave obrigatória');
				}
			}),

		valorDoPix: yup
			.string()
			.when('optionTipoChave', (optionTipoChave, schema) => {
				if (optionTipoChave[0] > 1) {
					console.log('aqui');
					setGetOptionPix(optionTipoChave[0]);
					return schema.required('Chave obrigatória');
				}
			}),

		menssagem: yup.string().max(250, 'maximo de 250 caracteres'),
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

	const optionsKeyPix = [
		{ value: 1, label: 'Copia e cola' },
		{ value: 2, label: 'Cpf' },
		{ value: 3, label: 'Cnpj' },
		{ value: 4, label: 'E-mail' },
		{ value: 5, label: 'Telefone' },
		{ value: 6, label: 'ChaveAleatória' },
	];

	async function handleTransfer(data) {
		console.log('data form', data);
		let validaValorTransacao = '0';
		let tipoChaveRecebida = null;
		let dadosCopiaEcola = null;

		setLoadSpinerModal(true);
		setErroMensageRetorno('');
		setErroCodeRetorno('');

		switch (data.optionTipoChave) {
			case 1:
				dadosCopiaEcola = await validaCopiaEcola(data.getKeyCopyPaste);

				if (dadosCopiaEcola == null) {
					tipoChaveRecebida = 0;
					validaValorTransacao = '0';
				} else {
					tipoChaveRecebida = dadosCopiaEcola.merchantAccountInformation.key;
					validaValorTransacao = dadosCopiaEcola.transactionAmount;
				}

				break;

			case 2:
				tipoChaveRecebida = data.getKeyCpf.replace(/[^\d]+/g, '');
				validaValorTransacao = validaMaskValor;

				break;

			case 3:
				console.log('chavecnpj aqui', data.getKeyCnpj);
				tipoChaveRecebida = data.getKeyCnpj.replace(/[^\d]+/g, '');
				validaValorTransacao = validaMaskValor;
				break;

			case 4:
				tipoChaveRecebida = data.getKeyEmail;
				validaValorTransacao = validaMaskValor;
				break;

			case 5:
				tipoChaveRecebida = data.getKeyTelefone;
				validaValorTransacao = validaMaskValor;
				break;

			default:
				break;
		}

		try {
			const response = await apiClient.get(
				`/consulta/chave/pix/${user.numeroConta}?chave=${tipoChaveRecebida}`
			);
			console.log(response);
			setLoadSpinerModal(false);
			setIsOpen(true);
			setDadosDoPixOrigen(response.data.data.body);
			setValorTransacao(validaValorTransacao);
			setMenssagemPix(data.menssagem);

			sendToken(user.tipo_auth_transacao);
		} catch (error) {
			if (error instanceof AxiosError) {
				//	console.log('Cod',error.response.data.data.error.errorCode,'',error.response.data.data.error.message);
				erroRetonoCod = error.response.data.data.error.errorCode;
				erroRetonoMensage = error.response.data.data.error.message;
				setErroMensageRetorno(erroRetonoMensage);
				setErroCodeRetorno(erroRetonoCod);
			} else {
				console.log('erro não sei', error);
			}

			setLoadSpinerModal(false);
		}
	}

	async function sendToken(tipo: string) {
		let tipoStringEnvio = '';
		let dadosTelefoneOuEmail = '';

		switch (tipo) {
			case 'sms':
				console.log('tipo codigo', tipo);
				tipoStringEnvio = 'Telefone';
				dadosTelefoneOuEmail = user.telefone;
				console.log('dados pegando aqui ', dadosTelefoneOuEmail);
				validaSmsOuEmail(tipo, dadosTelefoneOuEmail);
				break;

			case 'email':
				console.log('tipo codigo', tipo);
				tipoStringEnvio = 'email';
				dadosTelefoneOuEmail = user.email;
				//validaSmsOuEmail(tipoStringEnvio, dadosTelefoneOuEmail)
				break;

			case 'mobile':
				console.log('tipo codigo', tipo);
				tipoStringEnvio = 'Telefone';
				dadosTelefoneOuEmail = user.telefone;

				try {
					const response = await validaMobile(tipo, '123');
					if (response.data.status === 200 || response.data.status === 201) {
						toast.success(
							`Escaneie o QrCode para obter o codigo de autenticação`,
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
					}
					setLinkBase64(response?.data?.data?.img_base64);
					setAbilitaQrCode(true);
					console.log('dados mobile', response);
				} catch (error) {
					console.log(error);
					// eslint-disable-next-line no-empty
					if (error instanceof AxiosError) {
					} else {
						if (error instanceof TypeError) {
							console.log('caiu aqui', error);
							erroRetonoCod = 'BT0001';
							erroRetonoMensage = 'Erro interno tente mais tarde';
						}
					}
					setLoadSpinerModal(false);
					setAbilitaQrCode(false);
				}

				break;

			default:
				break;
		}
	}

	async function validaSmsOuEmail(tipo, dadosTelefoneOuEmail) {
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
				setStartPause(true);
			}
		} catch (error) {
			console.log(error);
			// eslint-disable-next-line no-empty
			if (error instanceof AxiosError) {
			} else {
				if (error instanceof TypeError) {
					console.log('caiu aqui', error);
					erroRetonoCod = 'BT0001';
					erroRetonoMensage = 'Erro interno tente mais tarde';
				}
			}
			setLoadSpinerModal(false);
		}
	}

	// DESCRIPTOGRAFA COPIA E COLA

	async function validaCopiaEcola(stringcopiaEcola) {
		let retornoKeyDadosCopiaEcola = '';
		const chaveCopiaEcola = {
			emv: stringcopiaEcola,
		};
		try {
			const response = await apiClient.post(
				`/consulta/emv/pix`,
				chaveCopiaEcola
			);
			//console.log('Retorno dados pix Copia e cola',response.data);
			//console.log(response.data.data.merchantAccountInformation.key);
			setValorTransacao(response.data.data.transactionAmount);
			retornoKeyDadosCopiaEcola = response.data.data;

			return retornoKeyDadosCopiaEcola;
		} catch (error) {
			if (error instanceof AxiosError) {
				return null;
				//console.log('erro',error)
				// erroRetonoCod = error.response.data.code
				// erroRetonoMensage = error.response.data.message
				// setErroMensageRetorno(erroRetonoMensage)
				// setErroCodeRetorno(erroRetonoCod)
			} else {
				console.log('erro não sei', error);
			}

			setLoadSpinerModal(false);
		}
	}

	getDateNow();

	function getDateNow() {
		let dataTexto = '';
		const dataTra = new Date();
		dataTra.setDate(dataTra.getDate() + 1);
		const dayOfWeek = dataTra.toLocaleDateString('pt-BR', { weekday: 'long' });
		const dayOfMonth = dataTra.getDate();
		const montfMonth = dataTra.getMonth();
		const year = dataTra.getFullYear();
		//console.log('Data hoje', dayOfWeek, ' ', dayOfMonth, '', montfMonth,' ', year)
		dataTexto = `${dayOfWeek} ${dayOfMonth}/${montfMonth}/${year}`;
		return dataTexto;
	}

	async function handleSandPix() {
		console.log(codigoValidacao);
		console.log('tamanho aqui ', codigoValidacao.length);

		if (codigoValidacao.length != 6) {
			toast.error('Insira o código de segurança', {
				position: 'top-center',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: 'colored',
			});
		} else {
			setLoadSpinerModal(true);

			const dadosEnviaPix = {
				valor: formaTavalorCelcoin(valorTransacao),
				endToEndId: dadosDoPixOrigen.endtoEndId,
				tipo_iniciacao_pagamento: 'DICT',
				conta_debito: {
					conta: user.numeroConta,
				},
				conta_credito: {
					banco: dadosDoPixOrigen.account.participant,
					chave: dadosDoPixOrigen.key,
					conta: dadosDoPixOrigen.account.account,
					agencia: dadosDoPixOrigen.account.branch,
					cpf_cnpj: dadosDoPixOrigen.owner.documentNumber,
					nome: dadosDoPixOrigen.owner.name,
				},
				mensagem_envio: menssagemPix,

				valida: {
					telefone: `${user.telefone}`,
					token: codigoValidacao,
				},
			};

			try {
				const response = await pixCachOut(dadosEnviaPix, user.tipo_auth_transacao);
				if (response?.data?.status === 200 || response?.data?.status === 201) {
					//console.log('Recebe retorno api',response.data)
					//console.log('strutura para o stato', dadosEnviaPix )
					setLoadSpinerModal(false);
					setDadosRetornoTransacao(response.data.data);
					setModalRetornoTransacao(true);
					setIsOpen(false);
					setInputCpf('');
				}
				if (response?.data?.status === 422) {
					toast.error('Código expirou ou é invalido', {
						position: 'top-center',
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						theme: 'colored',
					});
					setLoadSpinerModal(false);
				}
			} catch (error) {
				console.log(error);
				if (error instanceof AxiosError) {
					console.log(
						'Cod',
						error.response.data.data.error.errorCode,
						'',
						error.response.data.data.error.message
					);
					erroRetonoCod = error.response.data.data.error.errorCode;
					erroRetonoMensage = error.response.data.data.error.message;
					setErroMensageRetorno(erroRetonoMensage);
					setErroCodeRetorno(erroRetonoCod);
					//console.log('Recebe retorno api',response.data)
				} else {
					if (error instanceof TypeError) {
						console.log('caiu aqui', error);
						erroRetonoCod = 'BT0001';
						erroRetonoMensage = 'Erro interno tente mais tarde';
					}
				}
				setLoadSpinerModal(false);
			}
		}
	}

	function closeModal(paramModal) {
		switch (paramModal) {
			case 1:
				setIsOpen(false);
				setErroCodeRetorno('');
				setErroMensageRetorno('');
				setBorderInputCodigo(false);
				setCodigoValidacao('');
				break;

			case 2:
				setModalRetornoTransacao(false);
				setErroCodeRetorno('');
				setErroMensageRetorno('');
				setBorderInputCodigo(false);
				setCodigoValidacao('');
				break;

			default:
				break;
		}
		setAbilitaQrCode(false);
	}

	function printComprovante(componente) {
		//console.log('print');
		const printContents = document.getElementById('comprovante').innerHTML;
		const originalContents = document.body.innerHTML;
		document.body.innerHTML = printContents;
		window.print();
		document.body.innerHTML = originalContents;
	}

	useEffect(() => {}, [modalRetornoTransacao]);

	useEffect(() => {
		/*
		if (validaGetCnpj.length < 15) {
			console.log('CPF', validaGetCnpj)
			console.log('CPF', validaGetCnpj.length)

			setValidaMaskCpfCnpj(1)
		}

		if (validaGetCnpj.length > 14 && validaGetCnpj.length < 19) {
			console.log('CNPJ', validaGetCnpj)
			setValidaMaskCpfCnpj(2)
		}
		*/
	}, [validaGetCnpj]);

	useEffect(() => {}, [validaMaskValor]);

	return (
		<div>
			{loadSpinerModal ? <Spinner /> : ''}

			<form className={styles.formPix} onSubmit={handleSubmit(handleTransfer)}>
				<h5>{valorTransacao}</h5>
				<section className={styles.containerTransferencia}>
					<div className={styles.tituloGroup}>
						<h5>Dados bancários</h5>
					</div>
					<div className={styles.iputGroup}>
						<div className={styles.containerInut}>
							<Controller
								control={control}
								name="optionTipoChave"
								render={({ field: { onChange, onBlur, value } }) => (
									<Select
										options={optionsKeyPix}
										className="form-control w-full"
										value={optionsKeyPix.find((c) => c.value === value)}
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
					{getOptionPix == '1' && (
						<div className={styles.iputGroupChave}>
							<label>Digite a chave</label>
							<div>
								<Controller
									control={control}
									name="getKeyCopyPaste"
									render={({ field: { onChange, onBlur, value } }) => (
										<InputFormBit
											placeholder="Copia e cola"
											type="text"
											onChange={onChange}
											onBlur={onBlur}
											value={value}
										/>
									)}
								/>
								{errors.getKeyCopyPaste && (
									<p className={styles.erroInputForm}>
										{errors.getKeyCopyPaste?.message}
									</p>
								)}
							</div>
						</div>
					)}
					{getOptionPix == '2' && (
						<div className={styles.iputGroupChave}>
							<label>Digite a chave</label>
							<div>
								<Controller
									control={control}
									name="getKeyCpf"
									render={({ field: { onChange, onBlur, value } }) => (
										<InputFormBit
											placeholder="CPF"
											type="text"
											onChange={(e) => {
												onChange(inputCpf);
												setInputCpf(formatarCPFeCNPJ(e.target.value));
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
											//maxLength={18}
											type="text"
											onChange={(e) => {
												onChange(validaGetCnpj);
												setValidaGetCnpj(formatarCPFeCNPJ(e.target.value));
											}}
											onBlur={onBlur}
											value={validaGetCnpj}
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
											onChange={(e) => {
												onChange(validaMaskTelefone);
												setValidaMaskTelefone(maskPhone(e.target.value));
											}}
											onBlur={onBlur}
											value={validaMaskTelefone}
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
					{getOptionPix == '6' && (
						<div className={styles.iputGroupChave}>
							<label>Digite a chave</label>
							<div>
								<Controller
									control={control}
									name="getKeyAleatoria"
									render={({ field: { onChange, onBlur, value } }) => (
										<InputFormBit
											placeholder="Aleatória"
											type="text"
											onChange={onChange}
											onBlur={onBlur}
											value={value}
										/>
									)}
								/>
								{errors.getKeyAleatoria && (
									<p className={styles.erroInputForm}>
										{errors.getKeyAleatoria?.message}
									</p>
								)}
							</div>
						</div>
					)}
					{getOptionPix > '1' && (
						<div>
							<div className={styles.iputGroupChave}>
								<label>Digite o valor R$</label>
								<div>
									<Controller
										control={control}
										name="valorDoPix"
										render={({ field: { onChange, onBlur, value } }) => (
											<InputFormBit
												placeholder="0.00"
												type="text"
												onChange={(e) => {
													onChange(validaMaskValor);
													setValidaMaskValor(
														moneyMask(e.target.value.toString())
													);
												}}
												//	onChange={(e) => setGetValorTRansacao(moneyMask(e.target.value))}
												//onChange={onChange}
												onBlur={onBlur}
												value={validaMaskValor}
											/>
										)}
									/>
									{errors.valorDoPix && (
										<p className={styles.erroInputForm}>
											{errors.valorDoPix?.message}
										</p>
									)}
								</div>
							</div>
							<div className={styles.iputGroupChave}>
								<label>Menssagem</label>
								<div>
									<Controller
										control={control}
										name="menssagem"
										render={({ field: { onChange, onBlur, value } }) => (
											<InputFormBit
												placeholder="Menssagem opcional"
												type="text"
												onChange={onChange}
												onBlur={onBlur}
												value={value}
											/>
										)}
									/>
								</div>
							</div>
						</div>
					)}

					{erroMensageRetorno != '' && (
						<Alert variant="filled" severity="error">
							Codigo {erroCodeRetorno}. {erroMensageRetorno}
						</Alert>
					)}
					<div className={styles.buttomSubmitDadosPix}>
						<button type="submit">CONTINUAR</button>
					</div>
				</section>
			</form>
			<div>
				<Modal
					className={styles.modalContainerSucesso}
					isOpen={modalIsOpen}
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
							<div className={styles.inconePaymentSucces}></div>
							<div className={styles.tituloSucesso}>
								<h4>Dados para transferencia</h4>
								<h1> R${valorTransacao}</h1>
							</div>
							{/* DADOS DE QUEM PAGOU */}
							<div className={styles.tituloSucesso}>
								<h4>Quem vai receber</h4>
							</div>
							<div className={styles.detalhamentoComprovante}>
								<p>
									{dadosDoPixOrigen != undefined
										? dadosDoPixOrigen.owner.name
										: ''}
								</p>
								<p>
									Agência:
									{dadosDoPixOrigen != undefined
										? dadosDoPixOrigen.account.branch
										: ''}
								</p>
								<p>
									Conta:
									{dadosDoPixOrigen != undefined
										? dadosDoPixOrigen.account.account
										: ''}
								</p>
								<p>
									Tipo de conta:
									{dadosDoPixOrigen != undefined
										? dadosDoPixOrigen.account.accountType
										: ''}
								</p>
								<p>
									{dadosDoPixOrigen != undefined
										? dadosDoPixOrigen.keyType
										: ''}
									:{dadosDoPixOrigen != undefined ? dadosDoPixOrigen.key : ''}
								</p>
								<div>
									{abilitaQrCode == true ? <img src={`${linkBase64}`} /> : ''}
								</div>
								<div className={styles.containerInputCodigo}>
									<div className={styles.displayInpu}>
										<InputMask
											maxLength={6}
											minLength={6}
											placeholder="Código*"
											mask={null}
											value={codigoValidacao}
											onChange={async (event) => {
												setCodigoValidacao(event.target.value);
												const isValid = false;
												if (codigoValidacao.length == 5) {
													console.log('total de 6 digitos');
													setBorderInputCodigo(true);
												} else {
													setBorderInputCodigo(false);
												}
											}}
											className={styles.input}
											style={
												borderInputCodigo === true
													? { borderColor: 'green' }
													: { borderColor: 'red' }
											}
										/>
									</div>

									<div className={styles.displayInpu}>
										<Buttom
											onClick={() => {
												sendToken(user.tipo_auth_transacao);
											}}
										>
											Reenviar Código{' '}
											{/*useCountDows(hoursMinSecs, startPause)*/}
										</Buttom>
									</div>
								</div>
								<p className={styles.labelError}>
									Insira o código enviado para seu telefone para validar a
									transação
								</p>
							</div>
							<div className={styles.containerbuttomEnviarPix}>
								<Buttom
									type="button"
									onClick={() => handleSandPix()}
									loading={false}
								>
									ENVIAR PIX
								</Buttom>
								<p>&nbsp;</p>
								<ButtomWarning
									type="button"
									onClick={() => closeModal(1)}
									loading={false}
								>
									CANCELAR
								</ButtomWarning>
							</div>
						</div>
					</section>
				</Modal>
			</div>
			<div>
				<Modal
					className={styles.modalContainerSucesso}
					isOpen={modalRetornoTransacao}
					disablePortal
					disableEnforceFocus
					disableAutoFocus
					open
					contentLabel="Example Modal"
				>
					<section id="comprovante" className={styles.containerModalPixSucesso}>
						<header className={styles.headerModal}>
							<Image
								className={styles.imgBithLogo}
								src={getImg('logo.png')}
								alt="logo"
							/>
						</header>
						<div className={styles.dadosDetalhesPagamento}>
							<div className={styles.inconePaymentSucces}>
								<AiFillCheckCircle size={64} color="#32A639" />
							</div>
							<div className={styles.tituloSucesso}>
								<h4>Tranferência efetuada!</h4>
								<h1>
									{' '}
									{dadosRetornoTransacao != undefined
										? numeroParaReal(dadosRetornoTransacao.body.amount)
										: ''}
								</h1>
							</div>
							<div className={styles.detalhamentoComprovante}>
								<h4>
									{dadosRetornoTransacao != undefined
										? dadosRetornoTransacao.body.debitParty.name
										: ''}
								</h4>
								<p>{GetDateNoW()}</p>
								<p>Id da transação</p>
								<p>
									{dadosRetornoTransacao != undefined
										? dadosRetornoTransacao.body.endToEndId
										: ''}
								</p>
								<br />
							</div>

							{/* DADOS DE QUEM PAGOU */}

							<div className={styles.tituloSucesso}>
								<h4>Quem pagou</h4>
							</div>
							<div className={styles.detalhamentoComprovante}>
								<p>
									{dadosRetornoTransacao != undefined
										? dadosRetornoTransacao.body.debitParty.name
										: ''}
								</p>
								<p>
									Agência:
									{dadosRetornoTransacao != undefined
										? dadosRetornoTransacao.body.debitParty.branch
										: ''}
								</p>
								<p>
									Conta:
									{dadosRetornoTransacao != undefined
										? dadosRetornoTransacao.body.debitParty.account
										: ''}
								</p>
								<p>
									Tipo de conta:
									{dadosRetornoTransacao != undefined
										? dadosRetornoTransacao.body.debitParty.accountType
										: ''}
								</p>
								<p>
									Chave:
									{dadosRetornoTransacao != undefined
										? dadosRetornoTransacao.body.debitParty.taxId
										: ''}
								</p>
							</div>
							<div className={styles.tituloSucesso}>
								<h4>Quem recebeu</h4>
							</div>
							<div className={styles.detalhamentoComprovante}>
								<p>
									{dadosRetornoTransacao != undefined
										? dadosRetornoTransacao.body.creditParty.name
										: ''}
								</p>
								<p>
									Agência:
									{dadosRetornoTransacao != undefined
										? dadosRetornoTransacao.body.creditParty.branch
										: ''}
								</p>
								<p>
									Conta:
									{dadosRetornoTransacao != undefined
										? dadosRetornoTransacao.body.creditParty.account
										: ''}
								</p>
								<p>
									Tipo de conta:
									{dadosRetornoTransacao != undefined
										? dadosRetornoTransacao.body.creditParty.accountType
										: ''}
								</p>
								<p>
									Chave{' '}
									{dadosDoPixOrigen != undefined
										? dadosDoPixOrigen.keyType
										: ''}
									:
									{dadosRetornoTransacao != undefined
										? dadosRetornoTransacao.body.creditParty.key
										: ''}
								</p>
							</div>
							<div className={styles.containerbuttomEnviarPix}>
								<Buttom
									type="button"
									onClick={() => printComprovante(1)}
									loading={false}
								>
									IMPRIMIR
								</Buttom>
								<p>&nbsp;</p>
								<ButtomWarning
									type="button"
									onClick={() => closeModal(2)}
									loading={false}
								>
									FECHAR
								</ButtomWarning>
							</div>
						</div>
					</section>
				</Modal>
			</div>
		</div>
	);
}

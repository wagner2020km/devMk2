/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { connect, useDispatch } from 'react-redux';
import InputMask from 'react-input-mask';
import moment from 'moment';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Container from '../../layout/Container';
import getImg from '../../assets';
import CpfCnpjInput from '../../components/ui/InputCpfCnpj';
import Loading from '../../components/Loading';
import { BlockTela } from '../../components/BlockTela/BlockTela';
import { printComprovante } from '../../utils/printComprovante';
import Select from 'react-select';
import { camuflarDoc } from '../../utils/camuflarDocumento';
import { Buttom, ButtomWarning } from 'components/ui/Buttom';
import { pixCachOut } from '../../api/transacoesPix';
import { smsOuEmail, veryFiWatZapPhone, sendTokenWatZap } from '../../api/validacaoTelefoneEmail';
import GetDateNoW from '../../utils/functions/GetDateNow';
import GetTime from '../../utils/getTimeDAte';
import { numeroParaReal } from '../../utils/maks';
import { AiOutlineCloseCircle, AiFillCheckCircle } from 'react-icons/ai';
import Alert from '@mui/material/Alert';
import {geraPdfComprovante} from '../../utils/comprovantePdf'
import {
	resetUserRegisterData,
	setUserRegisterField,
} from '../../redux/actions/userRegisterActions';
import { setSaldoData } from '../../redux/actions/saldoActions';
import getPropSegura from '../../utils/getPropSegura';
import { useSelector } from 'react-redux';
import { getSaldo } from 'api/carteira';
import { getAddressByCep } from '../../api/endereco';
import { regiterAccount } from '../../api/cadastro';
import { formatarCPFeCNPJ, maskPhone } from '../../utils/maks';
import PageButtons from './PageButtons';
import { setupAPIClient } from '../../services/api';
import styles from './styles.module.scss';
import Modal from 'react-modal';
import typePayment from '../../constants/typeValidationPayment'
import Pdf from "react-to-pdf";
import { saveAs } from 'file-saver';
import { Options } from 'react-to-pdf/dist/types';
import {
	cpfMask,
	cnpjMask,
	moneyMask,
	formaTavalorCelcoin,
	formaTavalorCelcoinInverso,
} from '../../utils/cpfMask';

import {
	FacebookShareButton,
	FacebookIcon,
	WhatsappShareButton,
	WhatsappIcon
} from "react-share";

import { AxiosError } from 'axios';

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

const FormPixCachOut = (props: any) => {
	const {
		allFields,
		copiaEcola,
		cpfCnpj,
		valorPix,
		email,
		telefone,
		menssagemEnvio,
		chaveAleatoria,
		setFieldRedux,
		invalidFields,
		resetUserRegisterDataRedux,
	} = props;

	const apiClient = setupAPIClient();
	const user = useSelector((state: any) => state.userReducer.user);
	const dispatch = useDispatch();

	const divRef = useRef(null);

	
	const [nPagina, setNpagina] = useState(1);
	const [getOptionPix, setGetOptionPix] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [loadSpinerModal, setLoadSpinerModal] = useState(false);
	const [erroMensageRetorno, setErroMensageRetorno] = useState('');
	const [erroCodeRetorno, setErroCodeRetorno] = useState('');
	//const [validaMaskValor, setValidaMaskValor] = useState('');
	const [menssageToken, setMenssageToken] = useState('');
	const [modalIsOpen, setIsOpen] = useState(false);
	const [dadosDoPixOrigen, setDadosDoPixOrigen] = useState<typeContaPix>();
	const [valorTransacao, setValorTransacao] = useState('0');
	const [menssagemPix, setMenssagemPix] = useState('');
	const [linkBase64, setLinkBase64] = useState('');
	const [abilitaQrCode, setAbilitaQrCode] = useState(false);
	const [startPause, setStartPause] = useState(false);
	const [codigoValidacao, setCodigoValidacao] = useState('');
	const [borderInputCodigo, setBorderInputCodigo] = useState(false);
	const [modalRetornoTransacao, setModalRetornoTransacao] = useState(false);
	const [dadosRetornoTransacao, setDadosRetornoTransacao] =
		useState<TypeDadossucesso>();
	const [inputCpf, setInputCpf] = useState('');

	let erroRetonoCod = '';
	let erroRetonoMensage = '';

	const optionsKeyPix = [
		{ value: 1, label: 'Copia e cola' },
		{ value: 2, label: 'Cpf ou Cnpj' },
		{ value: 3, label: 'E-mail' },
		{ value: 4, label: 'Telefone' },
		{ value: 5, label: 'ChaveAleatória' },
	];
	const handleValueChangeCpfOrCnpj = ({
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

	const getSaldoApi = async () => {
		try {
			const response = await getSaldo();
			if (response.data.status === 200 && response?.data?.data?.total) {
				dispatch(setSaldoData(response?.data?.data?.total ?? 0));
			}
		} catch (error) {
			console.log(error);
		}
	};

	async function handleTransfer(KeyPix) {

		setIsLoading(true);
		const responseSaldo = await getSaldo();
		if (responseSaldo.status == 200) {

			if (formaTavalorCelcoin(String(valorPix.valor)) > responseSaldo.data.data.total) {
				console.log('conferindo slado', formaTavalorCelcoin(String(valorPix.valor)), '>', responseSaldo.data.data.total);
				toast.error(
					`Saldo insuficiênte para a transação`,
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
				return
			}
		} else {

			toast.error(
				`Erro ao na consulta`,
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

			return
		}


		console.log('data form', getOptionPix);
		let validaValorTransacao = '0';
		let tipoChaveRecebida = null;
		let dadosCopiaEcola = null;

		setLoadSpinerModal(true);
		setErroMensageRetorno('');
		setErroCodeRetorno('');

		switch (getOptionPix) {
			case 1:
				console.log('COPIA E COLA 2', KeyPix, 'valido', copiaEcola.valor);
				dadosCopiaEcola = await validaCopiaEcola(KeyPix);

				if (dadosCopiaEcola == null) {
					tipoChaveRecebida = 0;
					validaValorTransacao = '0';
				} else {
					tipoChaveRecebida = dadosCopiaEcola.merchantAccountInformation.key;
					validaValorTransacao = dadosCopiaEcola.transactionAmount;
				}

				break;

			case 2:
				console.log(
					'valor cpf cnpj no envio',
					cpfCnpj.valor,
					'valido',
					cpfCnpj.isValid
				);
				console.log(
					'lavor para passa envio',
					valorPix.valor,
					'valido',
					valorPix.isValid
				);
				tipoChaveRecebida = KeyPix.replace(/[^\d]+/g, '');
				validaValorTransacao = valorPix.valor;

				break;

			case 3:
				console.log('chavecnpj aqui', KeyPix);
				tipoChaveRecebida = KeyPix;
				validaValorTransacao = valorPix.valor;
				break;

			case 4:
				console.log('telefone', KeyPix)
				tipoChaveRecebida = '+55' + KeyPix
				validaValorTransacao = valorPix.valor;
				break;

			case 5:
				tipoChaveRecebida = KeyPix;
				validaValorTransacao = valorPix.valor;
				break;

			default:
				break;
		}
		console.log('T', tipoChaveRecebida);
		console.log('value', validaValorTransacao);

		// eslint-disable-next-line no-empty
		if (tipoChaveRecebida == 0) {
		} else {
			try {
				const response = await apiClient.get(
					`/consulta/chave/pix/${user.numeroConta}?chave=${tipoChaveRecebida}`
				);
				console.log('Valor do pix', response);
				setLoadSpinerModal(false);
				setIsOpen(true);
				setDadosDoPixOrigen(response.data.data.body);
				setValorTransacao(validaValorTransacao);
				setMenssagemPix(menssagemEnvio.valor);

				sendToken('sms');
			} catch (error) {
				if (error instanceof AxiosError) {
					console.log('Cod', error);
					erroRetonoCod = error?.response?.data?.data?.error?.errorCode;
					erroRetonoMensage = error?.response?.data?.data?.error?.message;
					setErroMensageRetorno(erroRetonoMensage);
					setErroCodeRetorno(erroRetonoCod);
					setIsLoading(false);
				} else {
					console.log('erro não sei', error);
					setIsLoading(false);
				}

				setLoadSpinerModal(false);
			}
		}
	}

	async function sendToken(tipo: string) {

		console.log('VALIDANDO TIPO PAGAMENTO', typePayment);
		let tipoStringEnvio = '';
		let dadosTelefoneOuEmail = '';
		setIsLoading(true);

		if (typePayment == 'sms') {
			console.log('tipo Telefone', user.telefone.replace('+55', ''));

			tipoStringEnvio = 'Telefone';
			dadosTelefoneOuEmail = user.telefone.replace('+55', '');
			console.log('dados pegando aqui ', dadosTelefoneOuEmail);
			validaSmsOuEmail(tipo, dadosTelefoneOuEmail);
			setMenssageToken('Insira o código enviado para seu telefone para validar a transação');

		} else {
			setIsLoading(false);
			setMenssageToken('Insira o código gerado pelo GlobalSafy');
		}
		//tipo= 'mobile'
		/*
		switch (tipo) {
			case 'sms':
				console.log('tipo Telefone', user.telefone.replace('+55', ''));

				tipoStringEnvio = 'Telefone';
				dadosTelefoneOuEmail = user.telefone.replace('+55', '');
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
				dadosTelefoneOuEmail = user.telefone.replace('+55', '');

				try {
					const response = await validaMobile(tipo, dadosTelefoneOuEmail);
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
					setIsLoading(false);
					console.log('dados mobile', response);
				} catch (error) {
					console.log(error);
					if (error instanceof AxiosError) {
						console.log('Cod', error);
						erroRetonoCod = error.response.data.data.error.errorCode;
						erroRetonoMensage = error.response.data.data.error.message;
						setIsLoading(false);
						return null;
					} else {
						if (error instanceof TypeError) {
							console.log('caiu aqui', error);
							erroRetonoCod = 'BT0001';
							erroRetonoMensage = 'Erro interno tente mais tarde';
						}
					}
					setLoadSpinerModal(false);
					setAbilitaQrCode(false);
					setIsLoading(false);
				}

				break;

			default:
				setIsLoading(false);
				break;
		}
		*/
	}

	async function validaSmsOuEmail(tipo, dadosTelefoneOuEmail) {

		try {
			const response = await veryFiWatZapPhone(tipo, dadosTelefoneOuEmail);
			if (response.data.status === 200) {
				if (response.data.data.error) {
					//	setValidaTipoAutenticacao('sms');
					setStartPause(true);
					setIsLoading(false);
					sendTokenSms('sms', dadosTelefoneOuEmail);
				} else {
					try {
						const response = await sendTokenWatZap(dadosTelefoneOuEmail);
						if (response.data.status === 200) {
							let tipoStringEnvio = 'Whatsapp';

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
							setIsLoading(false);
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
						setLoadSpinerModal(false);
						setIsLoading(false);
						sendTokenSms(tipo, dadosTelefoneOuEmail)
					}
				}

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
			setLoadSpinerModal(false);
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
				setStartPause(true);
				setIsLoading(false);
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
			setLoadSpinerModal(false);
			setIsLoading(false);
		}
	}
	async function validaCopiaEcola(stringcopiaEcola) {
		let retornoKeyDadosCopiaEcola = '';
		const chaveCopiaEcola = {
			emv: `${stringcopiaEcola}`,
		};
		console.log('dados', chaveCopiaEcola);
		try {
			const response = await apiClient.post(
				`/consulta/emv/pix`,
				chaveCopiaEcola
			);
			//console.log('Retorno dados pix Copia e cola',response.data);
			console.log('Retorno dados pix Copia e cola', response.data.data);
			setValorTransacao(
				formaTavalorCelcoinInverso(String(response.data.data.transactionAmount))
			);
			retornoKeyDadosCopiaEcola = response.data.data;

			return retornoKeyDadosCopiaEcola;
		} catch (error) {
			if (error instanceof AxiosError) {
				//return null;
				console.log('erro', error);
				erroRetonoCod = error?.response?.data.code;
				erroRetonoMensage = error?.response?.data?.message;
				setErroMensageRetorno(erroRetonoMensage);
				setErroCodeRetorno(erroRetonoCod);
				resetUserRegisterDataRedux();
			} else {
				console.log('erro não sei', error);
			}

			setLoadSpinerModal(false);
			setIsLoading(false);
		}
	}

	const verifyFieldsByPage = (page: number) => {
		const invalidFieldsByPage = invalidFields.filter(
			(field: string) => allFields[field]?.page === page
		);
		let isValid = true;
		const limpadoc = '';
		let campo = '';
		if (page === 1) {
			if (!copiaEcola.isValid) {
				isValid = false;
				campo = 'o copia e cola';
			}
			if (!valorPix.isValid) {
				isValid = false;
				campo = 'o valor';
			}
			//if (copiaEcola.isValid == true && valorPix.isValid == true) {
			//return null;
			//}
			console.log(valorPix.valor, 'valido', valorPix.isValid);
			console.log(copiaEcola.valor, 'valido', copiaEcola.isValid);
		} else if (page === 2) {
			if (!cpfCnpj.isValid) {
				isValid = false;
				campo = 'o cpf ou cnpj';
			}
			if (!valorPix.isValid) {
				isValid = false;
				campo = 'o valor';
			}
		} else if (page === 3) {
			if (!email.isValid) {
				isValid = false;
				campo = 'o email';
			}

			if (!valorPix.isValid) {
				isValid = false;
				campo = 'o valor';
			}
		} else if (page === 4) {
			console.log(telefone.valor, 'valido', telefone.isValid);
			console.log(valorPix.valor, 'valido', valorPix.isValid);
			if (!telefone.isValid) {
				isValid = false;
				campo = 'o Telefone';
			}
			if (!valorPix.isValid) {
				isValid = false;
				campo = 'o valor';
			}
		} else if (page === 5) {
			if (!chaveAleatoria.isValid) {
				isValid = false;
				campo = 'A chave';
			}
			if (!valorPix.isValid) {
				isValid = false;
				campo = 'o valor';
			}
		}

		if (!isValid) {
			toast.error(`Preencha corretamente ${campo}`, {
				position: 'top-center',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: false,
				draggable: true,
				progress: undefined,
				theme: 'colored',
			});
			return false;
		}

		return invalidFieldsByPage?.length === 0;
	};

	const handleNextPage = async () => {
		const isValidsFields = verifyFieldsByPage(getOptionPix);
		if (getOptionPix === 1) {
			console.log('copia e cola', isValidsFields);
			if (isValidsFields) {
				setIsLoading(true);
				handleTransfer(copiaEcola.valor);
			}
		} else if (getOptionPix === 2) {
			if (isValidsFields) {
				setIsLoading(true);

				let limpadoc = '';
				limpadoc = cpfCnpj.valor.replace(/[^\d]+/g, '');

				if (limpadoc.length == 11) {
					handleTransfer(limpadoc);
				}
				if (limpadoc.length == 14) {
					handleTransfer(limpadoc);
				}
			}
		} else if (getOptionPix === 3) {
			console.log('email', isValidsFields);
			if (isValidsFields) {
				setIsLoading(true);
				handleTransfer(email.valor);
			}
		} else if (getOptionPix === 4) {
			if (isValidsFields) {
				setIsLoading(true);
				handleTransfer(telefone.valor);
				setNpagina((prev) => prev + 1);
			}
		} else if (getOptionPix === 5) {
			if (isValidsFields) {
				//await registerAccountApi();
				handleTransfer(chaveAleatoria.valor);
				//setIsLoading(true);
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

	async function handleSandPix() {
		setIsLoading(true);
		console.log('valor da transação', valorTransacao);
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
			setIsLoading(false);
		} else {
			console.log('dados da conta retorno api', dadosDoPixOrigen);
			let dadosEnviaPix = {};
			if (typePayment == 'sms') {
				dadosEnviaPix = {
					valor: formaTavalorCelcoin(String(valorTransacao)),
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
						tipo_conta: dadosDoPixOrigen.account.accountType,
					},
					mensagem_envio: menssagemPix,

					valida: {
						telefone: `${user.telefone.replace('+55', '')}`,
						token: codigoValidacao,
					},
				};
			} else {
				dadosEnviaPix = {
					valor: formaTavalorCelcoin(String(valorTransacao)),
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
						tipo_conta: dadosDoPixOrigen.account.accountType,
					},
					mensagem_envio: menssagemPix,

					dispositivo: {
						conta: user.numeroConta,
						totp_code: codigoValidacao,
					},
				};
			}


			console.log('json dados pix com .env', dadosEnviaPix);
			try {
				const response = await pixCachOut(dadosEnviaPix, typePayment);
				if (response?.data?.status === 200 || response?.data?.status === 201) {
					//console.log('Recebe retorno api',response.data)
					//console.log('strutura para o stato', dadosEnviaPix )
					setLoadSpinerModal(false);
					setDadosRetornoTransacao(response.data.data);
					setModalRetornoTransacao(true);
					setIsOpen(false);
					setInputCpf('');
					await getSaldoApi();
					setIsLoading(false);
				} else {
					toast.error('Erro ao enviar pix', {
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
					setIsLoading(false);
				}
				if (response?.data?.status === 422) {

				}
				setIsLoading(false);
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
					setIsLoading(false);
				} else {
					if (error instanceof TypeError) {
						console.log('caiu aqui', error);
						erroRetonoCod = 'BT0001';
						erroRetonoMensage = 'Erro interno tente mais tarde';
					}
				}
				setLoadSpinerModal(false);
				setIsLoading(false);
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
		resetUserRegisterDataRedux();
	}

	const generatePdf = async () => {
		// Chamando o componente Pdf com a referência da div e as opções
		const options = {}; // Deixar as opções como um objeto vazio
		const pdf = await Pdf(divRef, options);
		// Obtendo o Blob do PDF
		const pdfBlob = await pdf.output('blob');
		// Salvando o Blob como um arquivo PDF
		saveAs(pdfBlob, user?.name);
	  };
	useEffect(() => {
		return () => {
			resetUserRegisterDataRedux();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps

	}, [getOptionPix]);

	return (
		<>

			<div className={styles.containeFormPix}>


				<section className={styles.sectionInputsPix}>
					<Select
						options={optionsKeyPix}
						value={optionsKeyPix.find((c) => c.value === getOptionPix)}
						onChange={(val) => setGetOptionPix(val.value)}
						className={styles.inputSelect}
					/>

					{getOptionPix === 1 && (
						<>
							<div>
								<InputMask
									placeholder="Copia e cola*"
									mask={null}
									value={copiaEcola.valor}
									onChange={async (event) => {
										const inputValue = event.target.value;

										let isValid = false;
										if (inputValue == '') {
											isValid = false;
											const auxInvalidFields = [...invalidFields, 'copiaEcola'];
											setFieldRedux('invalidFields', auxInvalidFields);
										} else {
											isValid = true;
											const auxInvalidFields = invalidFields.filter(
												(field: string) => field !== 'copiaEcola'
											);
											setFieldRedux('invalidFields', auxInvalidFields);
										}
										handleValueChange({
											name: 'copiaEcola',
											valor: inputValue,
											isValid: isValid,
											page: 1,
										});
									}}
									className={styles.input}
									style={{ borderColor: getColorError('copiaEcola') }}
								/>
								{invalidFields.includes('copiaEcola') && (
									<p className={styles.labelError}>Insira o codigo</p>
								)}
							</div>
						</>
					)}

					{getOptionPix === 2 && (
						<>
							<CpfCnpjInput
								onValueChange={handleValueChangeCpfOrCnpj}
								page={1}
								inputProps={{
									value: cpfCnpj.valor,
								}}
								borderColor={getColorError('cpfCnpj')}
							/>
						</>
					)}

					{getOptionPix === 3 && (
						<>
							<div>
								<InputMask
									placeholder="E-mail*"
									mask={null}
									value={email.valor}
									onChange={async (event) => {
										const inputValue = event.target.value;
										let isValid = false;
										if (inputValue.length < 9) {
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
											page: 3,
										});
									}}
									className={styles.input}
									style={{ borderColor: getColorError('email') }}
								/>
								{invalidFields.includes('email') && (
									<p className={styles.labelError}>Digite um E-mail válido</p>
								)}
							</div>
						</>
					)}

					{getOptionPix === 4 && (
						<>
							<div>
								<InputMask
									placeholder="Telefone*"
									mask="(99) 99999-9999"
									value={telefone.valor}
									onChange={(event) => {
										const inputValue = maskPhone(event.target.value);

										let isValid = false;
										if (inputValue.replace(/\D/g, '').length != 11) {
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
											valor: inputValue.replace(/\D/g, ''),
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
						</>
					)}

					{getOptionPix === 5 && (
						<>
							<div>
								<InputMask
									placeholder="Chave aleatória*"
									mask={null}
									value={chaveAleatoria.valor}
									onChange={async (event) => {
										const inputValue = event.target.value;

										let isValid = false;
										if (inputValue == '') {
											isValid = false;
											const auxInvalidFields = [
												...invalidFields,
												'chaveAleatoria',
											];
											setFieldRedux('invalidFields', auxInvalidFields);
										} else {
											isValid = true;
											const auxInvalidFields = invalidFields.filter(
												(field: string) => field !== 'chaveAleatoria'
											);
											setFieldRedux('invalidFields', auxInvalidFields);
										}
										handleValueChange({
											name: 'chaveAleatoria',
											valor: inputValue,
											isValid: isValid,
											page: 1,
										});
									}}
									className={styles.input}
									style={{ borderColor: getColorError('chaveAleatoria') }}
								/>
								{invalidFields.includes('chaveAleatoria') && (
									<p className={styles.labelError}>Insira a chave</p>
								)}
							</div>
						</>
					)}

					{getOptionPix === 6 && <></>}
					{getOptionPix > 0 && (
						<>
							<div>
								<InputMask
									placeholder="Valor*"
									mask={null}
									value={valorPix.valor}
									onChange={async (event) => {
									
										const inputValue = moneyMask(event.target.value);
										let isValid = false;
										if (inputValue < '0,0') {
											isValid = false;
											const auxInvalidFields = [...invalidFields, 'valorPix'];
											setFieldRedux('invalidFields', auxInvalidFields);
										} else {
											isValid = true;
											const auxInvalidFields = invalidFields.filter(
												(field: string) => field !== 'valorPix'
											);
											setFieldRedux('invalidFields', auxInvalidFields);
										}
										handleValueChange({
											name: 'valorPix',
											valor: inputValue,
											isValid: isValid,
											page: 1,
										});
									}}
									className={styles.input}
									style={{ borderColor: getColorError('valorPix') }}
								/>
								{invalidFields.includes('valorPix') && (
									<p className={styles.labelError}>O valor não pode ser 0,0</p>
								)}
							</div>
							<div>
								<InputMask
									placeholder="menssagem"
									mask={null}
									value={menssagemEnvio.valor}
									onChange={async (event) => {
										//const inputValue = event.target.value;
										const inputValue = event.target.value;
										let isValid = true;

										handleValueChange({
											name: 'menssagemEnvio',
											valor: inputValue,
											isValid: isValid,
											page: 1,
										});
									}}
									className={styles.input}
									style={{ borderColor: getColorError('menssagemEnvio') }}
								/>
								{invalidFields.includes('menssagemEnvio') && (
									<p className={styles.labelError}>O valor não pode ser 0,0</p>
								)}
							</div>
						</>
					)}
					<div>
						{getOptionPix > 0 && (
							<PageButtons showBack={false} onNext={handleNextPage} />
						)}
						{erroMensageRetorno != '' && (
							<div className={styles.alertErroCelcoin}>
								<Alert variant="filled" severity="error">
									Codigo {erroCodeRetorno}. {erroMensageRetorno}
								</Alert>
							</div>
						)}
						{getOptionPix === 7 && (
							<>
								<div className={styles.rowStyle}>
									<p
										className={styles.labelAlert}
										style={{ fontSize: '1.3rem' }}
									>
										<br />
										Houve um erro ☹️
										<br />
										<br />
										Tente novamente mais tarde!
									</p>
								</div>
							</>
						)}
					</div>
				</section>
			</div>
			<BlockTela isOpen={modalIsOpen} onClose={() => { setIsOpen(!modalIsOpen) }}>

				<section  id="comprovante" className={styles.containerModalPixSucesso}>
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
								{dadosDoPixOrigen != undefined ? dadosDoPixOrigen.keyType : ''}:
								{dadosDoPixOrigen != undefined ? camuflarDoc(dadosDoPixOrigen.key) : ''}
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

								<div className={styles.contententButtom}>
									<Buttom
										onClick={() => {
											sendToken('sms');
										}}
									>
										<p className={styles.textoReenvia}>Reenviar Código</p> {/*useCountDows(hoursMinSecs, startPause)*/}
									</Buttom>
								</div>
							</div>
							<p className={styles.labelError}>
								{menssageToken}
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
			</BlockTela>

			<div className={styles.recebeContainerModal}>
				<BlockTela isOpen={modalRetornoTransacao} onClose={() => { setModalRetornoTransacao(!modalRetornoTransacao) }}>
					<section ref={divRef} id="comprovante" className={styles.containerModalPixSucesso}>
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
								<p>
									{GetDateNoW()} as {GetTime()}
								</p>
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
								<p>
									Status:
									{dadosRetornoTransacao != undefined
										? dadosRetornoTransacao.status
										: ''}
								</p>
							</div>
							<div className={styles.containerbuttomEnviarPix}>
								<Buttom
									type="button"
									//onClick={() => generatePdf()}
									onClick={() => geraPdfComprovante(divRef, user?.name)}
									//geraPdfComprovante
									loading={false}
								>
									GERAR PDF
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
				</BlockTela>

			</div>
			<Loading isLoading={isLoading} />
		</>
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

		copiaEcola: getPropSegura(state, ['userRegisterReducer', 'copiaEcola'], {
			valor: '',
			isValid: false,
			page: 1,
		}),

		cpfCnpj: getPropSegura(state, ['userRegisterReducer', 'cpfCnpj'], {
			valor: '',
			isCpf: true,
			isCnpj: false,
			isValid: false,
			page: 1,
		}),

		email: getPropSegura(state, ['userRegisterReducer', 'email'], {
			valor: '',
			isCpf: true,
			isCnpj: false,
			isValid: false,
			page: 1,
		}),

		telefone: getPropSegura(state, ['userRegisterReducer', 'telefone'], {
			valor: '',
			isValid: false,
			page: 1,
		}),
		chaveAleatoria: getPropSegura(
			state,
			['userRegisterReducer', 'chaveAleatoria'],
			{
				valor: '',
				isValid: false,
				page: 1,
			}
		),

		valorPix: getPropSegura(state, ['userRegisterReducer', 'valorPix'], {
			valor: '',
			isValid: false,
			page: 1,
		}),

		menssagemEnvio: getPropSegura(state, ['userRegisterReducer', 'menssagemEnvio'], {
			valor: '',
			isValid: false,
			page: 1,
		}),
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

export default connect(mapStateToProps, mapDispatchToProps)(FormPixCachOut);

/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';

import { useSelector } from 'react-redux';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import Modal from 'react-modal';

import Image from 'next/image';

import { AiFillCheckCircle } from 'react-icons/ai';

import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { Spinner } from '../../components/Spinner/Spinner';
import GetDateNoW from '../../utils/functions/GetDateNow';
import { InputFormBit, SelectInputBit } from '../ui/InputFormBit';
import { MaskInput } from '../ui/InputFormBit';
import { Buttom } from '../ui/Buttom';
import { ButtomWarning } from '../../components/ui/Buttom';
import { AxiosError } from 'axios';
import { formaTavalorCelcoin } from '../../utils/cpfMask';
import { numeroParaReal } from '../../utils/maks';
import typePayment from '../../constants/typeValidationPayment'
import { validaDataBr } from '../../validacoes/DataBr';
import { smsOuEmail, veryFiWatZapPhone, sendTokenWatZap } from '../../api/validacaoTelefoneEmail';
import getAcount from '../../api/consultarConta';
import InputMask from 'react-input-mask';
import getImg from '../../assets';
import transferenciaInterna from '../../api/transferenciaEntreContas'
import { BlockTela } from '../../components/BlockTela/BlockTela';
import { printComprovante } from '../../utils/printComprovante'
import {geraPdfComprovante} from '../../utils/comprovantePdf'
import styles from './styles.module.scss';

interface TransferenciasPropos {
	tipo?: string;
	valorTr: string;
}

type dadosInputGFormProps = {
	addFavodecido: boolean;
	agendamento: string;
	conta: string;
	descricao: string;
	docFavorecido: string;
	agencia: string;
	nomeFavorecido: string;
	tipoConta: string;
	contaTemporaria?: string;
};

type TypeDadossucesso = {
	id: string;
	clientCode: string;
};

export function FormTransferencias({
	tipo,
	valorTr,
	...rest
}: TransferenciasPropos) {
	const user = useSelector((state: any) => state.userReducer.user);

	const divRef = useRef(null);

	const [typeOptionSchedule, setTypeOptionSchedule] = useState('');
	const [getNumbarAcount, setGetNumberAcount] = useState('');
	const [validaValorTransferencia, setValidaValorTransferencia] = useState('');
	const [validaDadosConta, setValidaDadosConta] = useState(false);
	const [guardaDadosForm, setGuardaDadosForm] =
		useState<dadosInputGFormProps>();
	const [dadosRetornoTransacao, setDadosRetornoTransacao] =
		useState<TypeDadossucesso>();
	const [modalIsOpen, setIsOpen] = useState(false);
	const [abreBodalTranfereciaCheckOut, setAbreBodalTranfereciaCheckOut] =
		useState(false);
	const [checkRetornoTransacao, setCheckRetornoTransacao] = useState(false);
	const [linkBase64, setLinkBase64] = useState('');
	const [abilitaQrCode, setAbilitaQrCode] = useState(false);
	const [startPause, setStartPause] = useState(false);
	const [codigoValidacao, setCodigoValidacao] = useState('');
	const [borderInputCodigo, setBorderInputCodigo] = useState(false);
	let erroRetonoCod = '';
	let erroRetonoMensage = '';
	const dateNow = new Date().toDateString();
	const schema = yup.object().shape({
		valorTransferencia: yup.string(),
		agencia: yup.string().required('* Agência é obrigatório'),
		contaTemporaria: yup.string(),
		conta: yup.string().required('* Conta é obrigatório'),
		nomeFavorecido: yup.string().max(50).required('* Nome é obrigatório'),
		docFavorecido: yup.string().required('* CPF/CNPJ é obrigatório'),
		addFavodecido: yup.boolean(),

		finalidade: yup.string(),
		descricao: yup.string(),

	});

	const {
		control,
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors },
	} = useForm<dadosInputGFormProps>({
		mode: 'onChange',
		resolver: yupResolver(schema),
	});

	const optionsBancos = [
		{ value: 1, label: 'Entre Contas' },
		//{ value: 2, label: 'Banco Inter' },
		//{ value: 3, label: 'Nunbank' },
		//{ value: 4, label: 'Caixa Económica federal' },
	];

	const optionsTipoConta = [
		{ value: 1, label: 'Conta poupança' },
		{ value: 2, label: 'Conta corrente' },
	];

	const optionsTipoTransacao = [
		{ value: 1, label: 'Ted' },
		{ value: 2, label: 'Doc' },
		{ value: 2, label: 'Pix' },
	];


	async function handleValidationAcount(dataAcount: any) {
		setIsOpen(true);

		// setSpinner(true)
		try {

			const response = await getAcount(dataAcount);
			console.log('dados da conta', response);
			if (response.status == 200) {
				setValue('nomeFavorecido', response.data.nome);
				setValue('docFavorecido', response.data.documento);
				setValue('conta', response.data.conta);
				setValue('agencia', '0001');
				setValidaDadosConta(true);
				setIsOpen(false);
			} else {
				if (response.status == 401 || response.status == 500) {
					setIsOpen(false);
				} else {
					console.log('erro')


				}
				setIsOpen(false);
			}

		} catch (error) {
			// setConfereDados(false)
			console.log(error);
			setValue('nomeFavorecido', '');
			setValue('docFavorecido', '');
			//  setLoadButtomSubmit(false)

		}

	}
	const handleTransfer: SubmitHandler<dadosInputGFormProps> = async (
		dataForm
	) => {
		if (validaValorTransferencia) {
			setGuardaDadosForm(dataForm);
			setAbreBodalTranfereciaCheckOut(true);
			//sendToken(user.tipo_auth_transacao);
			sendToken(typePayment);
		} else {
			toast.error(`Digite um valor valido`, {
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

		console.log('dados foprm', validaValorTransferencia);
	};

	const finalizaTrasferencia = async () => {
		setIsOpen(true);
		if (codigoValidacao.length == 6) {

			try {
				const response = await transferenciaInterna(typePayment, guardaDadosForm.conta, formaTavalorCelcoin(validaValorTransferencia), user.numeroConta, codigoValidacao, user.telefone);
				if (response.data.status === 201 && response?.data?.data) {
					setIsOpen(false);
					setDadosRetornoTransacao(response.data.data.body);
					setCheckRetornoTransacao(true);
					reset();

				}else{
					setIsOpen(false);
					toast.error(`Transação não efetuada`, {
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
				console.log('terceiro');
			} catch (error) {
				console.log(error);
			}
			/*
			try {
				const responseDebito = await AddSaldo(dataDebito, user.numeroConta);
				if (responseDebito.data.status === 200 && responseDebito?.data?.data) {
					//	setIsOpen(false)
					console.log('primeiro');
					try {
						const responseCredito = await AddSaldo(
							dataCredito,
							guardaDadosForm.conta
						);
						if (
							responseCredito.data.status === 200 &&
							responseCredito?.data?.data
						) {
							setDadosRetornoTransacao(responseCredito.data.data.body);
							setCheckRetornoTransacao(true);
						} else {
							try {
								const response = await AddSaldo(dataCredito, user.numeroConta);
								if (response.data.status === 200 && response?.data?.data) {
									//setRecebeStadoSaldo(response.data.data.total);
								}
								console.log('terceiro');
								disparaErro('');
							} catch (error) {
								console.log(error);
								disparaErro('');
							}
						}
						console.log('segundo');
						setIsOpen(false);
					} catch (error) {
						console.log(error);
						try {
							const response = await AddSaldo(dataCredito, user.numeroConta);
							if (response.data.status === 200 && response?.data?.data) {
								//setRecebeStadoSaldo(response.data.data.total);
							}
							console.log('terceiro');
						} catch (error) {
							console.log(error);
						}
					}
				} else {
					console.log('quarto');
				}
			} catch (error) {
				console.log(error);
				disparaErro('');
			}
			
			toast.error(`Inpisponível`, {
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
			*/
		} else {
			toast.error(`Insira o código`, {
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
		}

	};

	function disparaErro(paramTexto: string) {
		toast.error(`Falha na transação`, {
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
	}

	async function sendToken(tipo: string) {
		let tipoStringEnvio = '';
		let dadosTelefoneOuEmail = '';
		/*
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
				dadosTelefoneOuEmail = user.telefone;
				console.log('dados pegando aqui ', dadosTelefoneOuEmail);
				validaSmsOuEmail(tipo, dadosTelefoneOuEmail);

				break;

			case 'mobile':
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
					if (error instanceof AxiosError) {
					} else {
						if (error instanceof TypeError) {
							console.log('caiu aqui', error);
							erroRetonoCod = 'BT0001';
							erroRetonoMensage = 'Erro interno tente mais tarde';
						}
					}
					setIsOpen(false);
					setAbilitaQrCode(false);
				}
				break;

			default:
				break;
		}
		*/
		if (tipo == 'sms') {
			console.log('tipo Telefone', user.telefone.replace('+55', ''));

			tipoStringEnvio = 'Telefone';
			dadosTelefoneOuEmail = user.telefone.replace('+55', '');
			console.log('dados pegando aqui ', dadosTelefoneOuEmail);
			validaSmsOuEmail(tipo, dadosTelefoneOuEmail);
			//setMenssageToken('Insira o código enviado para seu telefone para validar a transação');

		} else {
			setIsOpen(false);
			//setMenssageToken('Insira o código gerado pelo GlobalSafy');
		}
	}

	async function validaSmsOuEmail(tipo, dadosTelefoneOuEmail) {
		/*
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
			if (error instanceof AxiosError) {
			} else {
				if (error instanceof TypeError) {
					console.log('caiu aqui', error);
					erroRetonoCod = 'BT0001';
					erroRetonoMensage = 'Erro interno tente mais tarde';
				}
			}
			setIsOpen(false);
		}
		*/
		try {
			const response = await veryFiWatZapPhone(tipo, dadosTelefoneOuEmail);
			if (response.data.status === 200) {
				//console.log('ERRO', response.data.data.error)
				if (response.data.data.error) {
					sendTokenSms(tipo, dadosTelefoneOuEmail);
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
							//setIsLoading(false);
						} else {

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
						//setLoadSpinerModal(false);
						//setIsLoading(false);
					}
				}

			} else {
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
						//	setIsLoading(false);
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
					//setLoadSpinerModal(false);
					//setIsLoading(false);
				}
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
			//setLoadSpinerModal(false);
			//setIsLoading(false);
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
				//	setIsLoading(false);
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
			//setLoadSpinerModal(false);
			//setIsLoading(false);
		}
	}

	function closeModal(paramModal) {
		switch (paramModal) {
			case 1:
				setDadosRetornoTransacao(null);
				setCheckRetornoTransacao(false);
				setGuardaDadosForm(null);
				setAbreBodalTranfereciaCheckOut(false);
				break;

			case 2:
				setDadosRetornoTransacao(null);
				setCheckRetornoTransacao(false);
				setGuardaDadosForm(null);
				setAbreBodalTranfereciaCheckOut(false);

				break;

			default:
				break;
		}
	}

	useEffect(() => {
		setValidaValorTransferencia(valorTr);
	}, [valorTr]);

	return (
		<div>
			<form onSubmit={handleSubmit(handleTransfer)}>
				{/*
				<Controller
					control={control}
					name="valorTransferencia"
					render={({ field: { onChange, onBlur, value } }) => (
						<input
							type="text"
							onChange={onChange}
							onBlur={onBlur}
							value={valorTr}
							hidden={false}
							id="boldCheckbox"
						/>
					)}
				/>

				{errors.valorTransferencia && (
					<p className={styles.erroInputForm}>
						{errors.valorTransferencia?.message}
					</p>
				)}
				 */}
				<section className={styles.containerTransferencia}>
					<div className={styles.tituloGroup}>
						<h5>Dados bancários</h5>
					</div>
					{validaDadosConta == false && (
						<div className={styles.containerBuscarConta}>
							<div className={styles.containerInutBuscarConta}>
								<label>Conta</label>
								<Controller
									control={control}
									name="contaTemporaria"
									render={({ field: { onChange, onBlur, value } }) => (
										<InputFormBit
											placeholder="Conta"
											type="text"
											onChange={(e) => {

												const novoValor = e.target.value;
												setGetNumberAcount(novoValor);

												onChange
											}
											}
											onBlur={onBlur}
											value={value}
										/>
									)}
								/>
								{errors.contaTemporaria && (
									<p className={styles.erroInputForm}>{errors.contaTemporaria?.message}</p>
								)}
							</div>
							<div className={styles.containerbuttomEnviarPix}>
								<Buttom
									type="button"
									onClick={() => handleValidationAcount(getNumbarAcount)}
									loading={false}
								>
									BUSCAR CONTA
								</Buttom>

							</div>
						</div>


					)}

					{validaDadosConta == true && (
						<>
							<div className={styles.iputGroup}>

								<div className={styles.containerInut}>
									<label>Agência</label>
									<Controller
										control={control}
										name="agencia"
										render={({ field: { onChange, onBlur, value } }) => (
											<InputFormBit
												placeholder="Agência"
												type="text"
												onChange={onChange}
												onBlur={onBlur}
												value={value}
											/>
										)}
									/>
									{errors.agencia && (
										<p className={styles.erroInputForm}>
											{errors.agencia?.message}
										</p>
									)}
								</div>
								<div className={styles.containerInut}>
									<label>Conta</label>
									<Controller
										control={control}
										name="conta"
										render={({ field: { onChange, onBlur, value } }) => (
											<InputFormBit
												placeholder="Conta"
												type="text"
												onChange={onChange}
												onBlur={onBlur}
												value={value}
											/>
										)}
									/>
									{errors.conta && (
										<p className={styles.erroInputForm}>{errors.conta?.message}</p>
									)}
								</div>
							</div>

							{/*  /////////////////// */}

							<div className={styles.tituloGroup}>
								<h5>Para quem ?</h5>
							</div>
							<div className={styles.iputGroup}>
								<div className={styles.containerInut}>
									<label>Nome do favorecido</label>
									<Controller
										control={control}
										name="nomeFavorecido"
										render={({ field: { onChange, onBlur, value } }) => (
											<InputFormBit
												placeholder="Nome favorecido"
												type="text"
												onChange={onChange}
												onBlur={onBlur}
												value={value}
											/>
										)}
									/>
									{errors.nomeFavorecido && (
										<p className={styles.erroInputForm}>
											{errors.nomeFavorecido?.message}
										</p>
									)}
								</div>
								<div className={styles.containerInut}>
									<label>Documento</label>
									<Controller
										control={control}
										name="docFavorecido"
										render={({ field: { onChange, onBlur, value } }) => (
											<MaskInput
												//mask="999.999.999-99"
												disabled
												placeholder="CPF/CNPJ"
												type="text"
												onChange={onChange}
												onBlur={onBlur}
												value={value}
											/>
										)}
									/>

									{errors.docFavorecido && (
										<p className={styles.erroInputForm}>
											{errors.docFavorecido?.message}
										</p>
									)}
								</div>
							</div>

							{/*  /////////////////// */}

							<div className={styles.iputGroupCheckAddFavorites}>
								<div>
									<input
										//className={styles.inputG}
										{...register('addFavodecido')}
										placeholder="addFavodecido"
										type="checkbox"
										name="addFavodecido"
									/>
								</div>
								<div>
									<label>Adicionar aos favoritos</label>
								</div>
							</div>

							{/*  /////////////////// */}




							{/*  /////////////////// */}

							<div className={styles.iputGroup}>
								<div className={styles.containerInut}>
									<label>Descrição</label>
									<Controller
										control={control}
										name="descricao"
										render={({ field: { onChange, onBlur, value } }) => (
											<MaskInput
												mask=""
												placeholder="Descrição"
												type="text"
												onChange={onChange}
												onBlur={onBlur}
												value={value}
											/>
										)}
									/>
								</div>
							</div>

							{/*  /////////////////// */}




							<div className={styles.ButtomSubmitTransfer}>
								<Buttom
									type="submit"
								//loading={loading}
								>
									Transferir
								</Buttom>
							</div>
						</>
					)}

				</section>
			</form>


			<BlockTela isOpen={abreBodalTranfereciaCheckOut} onClose={() => { setAbreBodalTranfereciaCheckOut(!abreBodalTranfereciaCheckOut) }}>
				<section className={styles.containerModalPixSucesso}>
					<header className={styles.headerModal}>
						<Image
							className={styles.imgBithLogo}
							src={getImg('logo.png')}
							alt="logo"
						/>
					</header>
					<div className={styles.dadosDetalhesPagamento}>
						{checkRetornoTransacao == true && (
							<div className={styles.inconePaymentSucces}>
								<AiFillCheckCircle size={64} color="#32A639" />
							</div>
						)}
						<div className={styles.tituloSucesso}>
							<h4>Dados para transferencia</h4>
							<h1> R${validaValorTransferencia}</h1>
						</div>
						{/* DADOS DE QUEM PAGOU */}
						<div className={styles.tituloSucesso}>
							<h4>Quem vai receber</h4>
						</div>
						<div className={styles.detalhamentoComprovante}>
							<p>
								{guardaDadosForm?.nomeFavorecido != undefined
									? guardaDadosForm?.nomeFavorecido
									: ''}
							</p>
							<p>
								Agência:
								{guardaDadosForm?.agencia != undefined
									? guardaDadosForm?.agencia
									: ''}
							</p>
							<p>
								Conta:
								{guardaDadosForm?.conta != undefined
									? guardaDadosForm?.conta
									: ''}
							</p>
							<p>
								:{' '}
								{guardaDadosForm?.agendamento == '1'
									? validaDataBr(dateNow)
									: ''}
							</p>
						</div>
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
							{/* <div className={styles.displayInpu}>
										<Buttom
											onClick={() => {sendToken(user.tipo_auth_transacao)}}
										>
											Reenviar Código useCountDows(hoursMinSecs, startPause)
										</Buttom>
									</div> */}
						</div>
						<p className={styles.labelError}>
							Insira o código enviado para seu telefone para validar a
							transação
						</p>

						<div className={styles.containerbuttomEnviarPix}>
							<Buttom
								type="button"
								onClick={() => finalizaTrasferencia()}
								loading={false}
							>
								ENVIAR PIX
							</Buttom>
							<p>&nbsp;</p>
							<ButtomWarning
								type="button"
								onClick={() => {
									closeModal(1);
								}}
								loading={false}
							>
								CANCELAR
							</ButtomWarning>
						</div>
					</div>
				</section>
			</BlockTela>

			
					<div className={styles.recebeContainerModal}>

						<BlockTela isOpen={checkRetornoTransacao} onClose={() => { setCheckRetornoTransacao(!checkRetornoTransacao) }}>
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
												? `R$: ${validaValorTransferencia}`
												: ''}
										</h1>
									</div>
									<div className={styles.detalhamentoComprovante}>
										<h4>{user?.name ?? ''}</h4>
										<p>{GetDateNoW()}</p>
										<p>Id da transação</p>
										<p>
											{dadosRetornoTransacao?.id != undefined
												? dadosRetornoTransacao?.id
												: ''}
										</p>
										<br />
									</div>

									{/* DADOS DE QUEM PAGOU */}

									<div className={styles.tituloSucesso}>
										<h4>Quem pagou</h4>
									</div>
									<div className={styles.detalhamentoComprovante}>
										<p>{user?.name != undefined ? user?.name : ''}</p>
										<p>Agência:{'0001'}</p>
										<p>
											Conta:
											{user?.numeroConta != undefined ? user?.numeroConta : ''}
										</p>
									</div>
									<div className={styles.tituloSucesso}>
										<h4>Quem recebeu</h4>
									</div>
									<div className={styles.detalhamentoComprovante}>
										<p>
											{guardaDadosForm?.nomeFavorecido != undefined
												? guardaDadosForm?.nomeFavorecido
												: ''}
										</p>
										<p>
											Agência:
											{guardaDadosForm?.agencia != undefined
												? guardaDadosForm?.agencia
												: ''}
										</p>
										<p>
											Conta:
											{dadosRetornoTransacao?.clientCode != undefined
												? guardaDadosForm?.conta
												: ''}
										</p>
									</div>
									<div className={styles.containerbuttomEnviarPix}>
										<Buttom
											type="button"
											//onClick={() => printComprovante('comprovante')}
											onClick={() => geraPdfComprovante(divRef, user?.name)}
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
			
			{modalIsOpen ? <Spinner /> : ''}
		</div>
	);
}

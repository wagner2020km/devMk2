/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';

import Alert from '@mui/material/Alert';

import InfoOutlined from '@mui/icons-material/InfoOutlined';

//import { useSelector } from 'react-redux';
import { Buttom, ButtomWarning } from 'components/ui/Buttom';
import Container from '../../layout/Container';
import { inverteData } from '../../validacoes/DataBr';
//import { moneyMask } from '../../utils/cpfMask'
import { toast } from 'react-toastify';
import {
	queryAcount,
	reserveAmount,
	makePayment,
} from '../../api/pagamentoConta';
import { getSaldo } from '../../api/carteira'
import Loading from '../../components/Loading';
import getImg from '../../assets';
import Pix from '../../lib/bibliotecaBit/icons/Pix';
import GetDateNoW from '../../utils/functions/GetDateNow';
import {
	validaDataBr,
	//pegaDataAtual,
	pegaApenasData,
} from '../../validacoes/DataBr';
import Modal from 'react-modal';
import typePayment from '../../constants/typeValidationPayment'
import { boletoMaskoleto } from '../../utils/maskBoleto';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import styles from './styles.module.scss';
import CropFree from '@mui/icons-material/CropFree';
import { FaBarcode } from 'react-icons/fa';
import { smsOuEmail, veryFiWatZapPhone, sendTokenWatZap } from '../../api/validacaoTelefoneEmail';
import { BlockTela } from '../../components/BlockTela/BlockTela';
import { AiOutlineCloseCircle, AiFillCheckCircle } from 'react-icons/ai';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { connect, useDispatch } from 'react-redux';
import { AxiosError } from 'axios';
import InputMask from 'react-input-mask';
import { numeroParaReal } from 'utils/maks';
import { geraPdfComprovante } from '../../utils/comprovantePdf'

interface dadosConfirmProps {
	assignor?: string;
	digitable?: string;
	payDueDate?: string;
	payer?: string;
	documentPayer?: string;
	recipient?: string;
	documentRecipient?: string;
	maxValue?: number;
	dueDateRegister?: string;
	settleDate?: string;
	totalUpdated?: number;
	originalValue?: number;
	totalWithDiscount?: number;
	totalWithAdditional?: number;
	typeDocument?: number;
	dueDate?: string,
}


type TypeProposSucess = {
	digitable: string;
}
interface DadosPropsSucess {
	id: string;
	clientRequestId: string;
	amount: number;
	transactionIdAuthorize: number;
	barCodeInfo: TypeProposSucess;


}

export default function Pagamento() {
	const user = useSelector((state: any) => state.userReducer.user);
	const dispatch = useDispatch();
	const divRef = useRef(null);
	const [optionCode, setOptionCode] = useState('');
	const [coudBar, setCoudBar] = useState('');
	const [statusCoude, setSstatusCoude] = useState(0);
	const [validaTipoAutenticacao, setValidaTipoAutenticacao] = useState(typePayment)
	const [errorMenssage, setErrorMenssage] = useState('');
	const [messageConfirmPag, setMessageConfirmPag] = useState(false);
	const [habilitaErro, setHabilitaErro] = useState(false);
	const [idTransaction, setIdTransaction] = useState('');
	const [modalConfirma, setModalConfirma] = useState(false);
	const [habilitaSucess, setHabilitaSucess] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [jsonDadosConfirma, setJsonDadosConfirma] = useState<dadosConfirmProps>();
	const [jsonDadosSucess, setJsonDadosSucess] = useState<DadosPropsSucess>();
	const [abilitaQrCode, setAbilitaQrCode] = useState(false);
	const [linkBase64, setLinkBase64] = useState('');
	const [codigoValidacao, setCodigoValidacao] = useState('');
	const [borderInputCodigo, setBorderInputCodigo] = useState(false);
	const [messageValidationCod, setMessageValidationCod] = useState('');
	const [habilitaPagamento, setHabilitaPagamento] = useState(false);

	let erroRetonoCod = '';
	let erroRetonoMensage = '';

	async function handlePayment() {

		setIsLoading(true);
		let dataJsonConfirm = {}
		try {
			const response = await queryAcount(optionCode, coudBar);
			const coudBarClean = coudBar.replace(/\D/g, '');
			if (response.status === 200) {

				const responseSaldo = await getSaldo();
				if (responseSaldo.status == 200) {


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
				console.log('Retorno TEste', response);
				switch (response?.data?.data?.type) {
					case 1:
						if (response?.data?.data?.value > responseSaldo.data.data.total) {
							console.log(response?.data?.data?.value, '>', responseSaldo.data.data.total);
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

						dataJsonConfirm = {
							assignor: response?.data?.data?.assignor,
							digitable: response?.data?.data?.digitable,
							payDueDate: response?.data?.data?.registerData?.settleDate,
							payer: response?.data?.data?.registerData?.payer,
							documentPayer: response?.data?.data?.registerData?.documentPayer,
							recipient: response?.data?.data?.registerData?.recipient,
							documentRecipient: response?.data?.data?.registerData?.documentRecipient,
							maxValue: response?.data?.data?.registerData?.maxValue,
							dueDateRegister: validaDataBr(response?.data?.data?.registerData?.dueDateRegister),
							settleDate: response?.data?.data?.settleDate,
							totalUpdated: response?.data?.data?.value,
							originalValue: response?.data?.data?.value,
							totalWithDiscount: response?.data?.data?.value,
							totalWithAdditional: response?.data?.data?.registerData?.totalWithAdditional,
							typeDocument: response?.data?.data?.type,
							dueDate: response?.data?.data?.dueDate,
						};


						break;

					case 2:
						if (response?.data?.data?.registerData?.totalUpdated > responseSaldo.data.data.total) {
							console.log(response?.data?.data?.registerData?.totalUpdated, '>', responseSaldo.data.data.total);
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
						dataJsonConfirm = {
							assignor: response?.data?.data?.assignor,
							digitable: response?.data?.data?.digitable,
							payDueDate: response?.data?.data?.registerData?.payDueDate,
							payer: response?.data?.data?.registerData?.payer,
							documentPayer: response?.data?.data?.registerData?.documentPayer,
							recipient: response?.data?.data?.registerData?.recipient,
							documentRecipient: response?.data?.data?.registerData?.documentRecipient,
							maxValue: response?.data?.data?.registerData?.maxValue,
							dueDateRegister: validaDataBr(response?.data?.data?.registerData?.dueDateRegister),
							settleDate: response?.data?.data?.settleDate,
							totalUpdated: response?.data?.data?.registerData?.totalUpdated,
							originalValue: response?.data?.data?.registerData?.originalValue,
							totalWithDiscount: response?.data?.data?.registerData?.totalWithDiscount,
							totalWithAdditional: response?.data?.data?.registerData?.totalWithAdditional,
							typeDocument: response?.data?.data?.type,
							dueDate: response?.data?.data?.dueDate,
						};
						setIdTransaction(response?.data?.data?.transactionId);
						setJsonDadosConfirma(dataJsonConfirm);

						break;

					default:
						break;
				}

				setIdTransaction(response?.data?.data?.transactionId);
				setJsonDadosConfirma(dataJsonConfirm);

				if (validaTipoAutenticacao == 'sms') {
					console.log('tipo Telefone', user.telefone.replace('+55', ''));



					validaSmsOuEmail(validaTipoAutenticacao, user.telefone.replace('+55', ''));
					//setMenssageToken('Insira o código enviado para seu telefone para validar a transação');

				}
				//console.log('json retorno', dataJsonConfirm);
				setCodigoValidacao('');
				setHabilitaErro(false);
				setModalConfirma(false);
				setErrorMenssage('');
				setSstatusCoude(response?.response?.status);
			} else {
				setHabilitaErro(true);
				setErrorMenssage(response?.response?.data?.data?.message);
				setIsLoading(false);
			}
		} catch (error) {
			console.log(error);
			setHabilitaErro(true);
			setModalConfirma(false);
			setErrorMenssage(error?.response?.data);
			setSstatusCoude(error?.response?.status);
		}
	}

	async function confirmPayment() {
		console.log(idTransaction);
		setIsLoading(true);
		try {

			const response = await makePayment(validaTipoAutenticacao, idTransaction, 'digitavel', jsonDadosConfirma?.digitable, jsonDadosConfirma?.totalUpdated, codigoValidacao, user.numeroConta, user.telefone);
			if (response.status === 201) {
				console.log(response);
				setJsonDadosSucess(response?.data?.data?.body);
				setHabilitaSucess(true);
				setMessageConfirmPag(true);
				setErrorMenssage('');
				setIsLoading(false);
			} else {
				setHabilitaSucess(false);
				setErrorMenssage(response?.response?.data?.data?.error?.message);
				setIsLoading(false);
				setModalConfirma(false);
				setJsonDadosConfirma({});
				setHabilitaErro(true);
				setMessageConfirmPag(false);
			}
		} catch (error) {
			setHabilitaSucess(false);
			setMessageConfirmPag(false);
			setHabilitaErro(true);
			setErrorMenssage(error?.response?.data?.data?.error?.message);
			setSstatusCoude(error?.response?.status);
			setModalConfirma(false);
			setIsLoading(false);
		}
	}


	async function validaSmsOuEmail(tipo, dadosTelefoneOuEmail) {
		try {
			const response = await veryFiWatZapPhone(tipo, dadosTelefoneOuEmail);
			if (response.data.status === 200) {
				//console.log('ERRO', response.data.data.error)
				if (response.data.data.error) {
					setValidaTipoAutenticacao('sms');
					sendTokenSms(dadosTelefoneOuEmail);
				} else {
					try {
						const response = await sendTokenWatZap(dadosTelefoneOuEmail);

						if (response.data.status === 200) {
							setModalConfirma(true);
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
							//	setStartPause(true);
							setIsLoading(false);
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
						setModalConfirma(true);
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
						//setStartPause(true);
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
					//setLoadSpinerModal(false);
					setIsLoading(false);
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

	async function sendTokenSms(dadosTelefoneOuEmail) {
		try {
			const response = await smsOuEmail(validaTipoAutenticacao, dadosTelefoneOuEmail);
			if (response.data.status === 200) {
				let tipoStringEnvio = '';

				if (validaTipoAutenticacao == 'sms') {
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
				//setStartPause(true);
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


	function closeModal() {
		setMessageConfirmPag(false);
		setModalConfirma(false);
	}


	useEffect(() => {
		//console.log('estado ecolhido', optionCode, coudBar);
		if (coudBar.length < 53 || coudBar.length > 54) {
			//setHabilitaPagamento(true);
		} else {
			//setHabilitaPagamento(false);
		}
	}, [coudBar]);
	return (
		<Container>
			<section className={styles.containerTransferencia}>
				<div className={styles.cardLeft}>
					<div className={styles.titleContainer}>
						<FaBarcode size={24} color="#000" />
						<h3>Pagamento de boletos</h3>
					</div>
					<div className={styles.cardTransferencia}>
						<div>
							<FormControl>
								<FormLabel id="demo-row-radio-buttons-group-label">
									Tipo
								</FormLabel>
								<RadioGroup
									row
									aria-labelledby="demo-row-radio-buttons-group-label"
									name="row-radio-buttons-group"
									onChange={(e) => setOptionCode(e.target.value)}
								>
									<FormControlLabel
										value="0"
										control={<Radio />}
										label="Boleto Bancário"
									/>
									<FormControlLabel
										value="1"
										control={<Radio />}
										label="Água, luz, etc"
									/>
									<FormControlLabel
										value="2"
										control={<Radio />}
										label="Tributos"
									/>
								</RadioGroup>
							</FormControl>
						</div>
						<div className={styles.divInputCoudBar}>
							<TextField
								label="Código barras"
								id="fullWidth"
								value={boletoMaskoleto(coudBar)}
								className={styles.inputCoudBar}
								onChange={(e) => setCoudBar(e.target.value)}
								size="small"
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<FaBarcode size={24} color="#000" />
										</InputAdornment>
									),
								}}
							/>
						</div>
						{errorMenssage != '' && (
							<div className={styles.alertErroCelcoin}>
								<Alert variant="filled" severity="error">
									Codigo {errorMenssage}
								</Alert>
							</div>
						)}
						<div className={styles.divInputCoudBar}>
							<Buttom
								type="button"
								onClick={() => handlePayment()}
								loading={false}
								disabled={habilitaPagamento}
							>
								Continuar
							</Buttom>
						</div>
					</div>
				</div>
				<div className={styles.cardRigth}>
					<div className={styles.titleContainer}>
						<FaBarcode size={24} color="#000" />
						<h3>Informações</h3>
					</div>
					<div className={styles.cardTransferencia}>
						<Alert icon={<InfoOutlined fontSize="inherit" />} severity="info">
							<p>
								<span>Como funciona:</span>{' '}
							</p>
							<p>1 - Selecione uma das opções de pagamento desejada.</p>
							<p>2 - Insira o código de barras.</p>
							<p>3 - Confira os dados da pagamento.</p>
							<p>4 - Digite o código enviado para o seu endereço de contato.</p>
							<p>
								5 - Click em CONFIRMAR para finalizar a transação se todos os
								dados estiverem corretos.
							</p>
						</Alert>
					</div>
				</div>

				<BlockTela isOpen={modalConfirma} onClose={() => { setModalConfirma(!modalConfirma) }}>
					<section ref={divRef} id="comprovante" className={styles.containerModalPixSucesso}>
						<header className={styles.headerModal}>
							<Image
								className={styles.imgBithLogo}
								src={getImg('logo.png')}
								alt="logo"
							/>
						</header>
						<div className={styles.dadosDetalhesPagamento}>
							{messageConfirmPag == true ? (
								<div className={styles.inconePaymentSucces}>
									<AiFillCheckCircle size={64} color="#32A639" />
								</div>
							) : (
								''
							)}
							<div className={styles.tituloSucesso}>
								<h4>Dados do Pagamento</h4>
								<h1> {numeroParaReal(jsonDadosConfirma?.totalUpdated)}</h1>
							</div>
							{/* DADOS DE QUEM PAGOU */}
							<div className={styles.tituloSucesso}>
								<h4>Quem vai receber</h4>
							</div>
							<div className={styles.detalhamentoComprovante}>
								<p>
									{jsonDadosConfirma != undefined
										? jsonDadosConfirma.assignor
										: ''}
								</p>

								{jsonDadosConfirma != undefined
									? jsonDadosConfirma.typeDocument == 2
										?
										<>
											<p>
												Documento:
												{jsonDadosConfirma != undefined
													? jsonDadosConfirma.documentRecipient
													: ''}
											</p>
										</>
										: ''
									: ''}

								{jsonDadosConfirma != undefined
									? jsonDadosConfirma.typeDocument == 1
										?
										<>
											<p>
												Vencimento:
												{jsonDadosConfirma.dueDate != undefined
													? validaDataBr(jsonDadosConfirma.dueDate)
													: ''}
											</p>
										</>
										: ''
									: ''}

								<p>

									Valor pag:
									{jsonDadosConfirma != undefined
										? numeroParaReal(jsonDadosConfirma?.totalUpdated)
										: ''}
								</p>
								<p>
									Valor Adic:
									{jsonDadosConfirma != undefined
										? numeroParaReal(jsonDadosConfirma?.totalWithAdditional)
										: ''}
								</p>
								<p>
									Valor com Desc:
									{jsonDadosConfirma != undefined
										? numeroParaReal(jsonDadosConfirma?.totalWithDiscount)
										: ''}
								</p>
								<p>Código de barras:</p>
								<p>
									{jsonDadosConfirma != undefined
										? boletoMaskoleto(jsonDadosConfirma.digitable)
										: ''}
								</p>
								<div>
									{abilitaQrCode == true ? <img src={`${linkBase64}`} /> : ''}
								</div>

								{messageConfirmPag == true ? (
									<div className={styles.detalhamentoComprovante}>
										<p>Data Pagamento</p>
										<p>{GetDateNoW()}</p>
									</div>
								) : (
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

													validaSmsOuEmail(validaTipoAutenticacao, user.telefone.replace('+55', ''))
												}}
											>
												Reenviar Código{' '}
												{/*useCountDows(hoursMinSecs, startPause)*/}
											</Buttom>
										</div>
									</div>
								)}
							</div>
							{habilitaSucess == true && (
								<div className={styles.detalhamentoComprovante}>
									<p>
										Id tranação:
										{jsonDadosSucess != undefined
											? jsonDadosSucess?.id
											: ''}
									</p>
									<p>
										Id cliente:
										{jsonDadosSucess != undefined
											? jsonDadosSucess?.clientRequestId
											: ''}
									</p>
								</div>
							)}
							{messageConfirmPag == true ? (
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
									<p>&nbsp;</p>
									<ButtomWarning
										type="button"
										onClick={closeModal}
										loading={false}
									>
										CANCELAR
									</ButtomWarning>
								</div>
							) : (
								<div className={styles.containerbuttomEnviarPix}>
									<Buttom
										type="button"
										onClick={confirmPayment}
										loading={false}
									>
										PAGAR
									</Buttom>
									<p>&nbsp;</p>
									<ButtomWarning
										type="button"
										onClick={closeModal}
										loading={false}
									>
										CANCELAR
									</ButtomWarning>
								</div>
							)}
						</div>
					</section>
				</BlockTela>
			</section>
			<Loading isLoading={isLoading} />
		</Container>
	);
}

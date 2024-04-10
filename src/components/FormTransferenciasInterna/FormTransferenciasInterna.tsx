/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import Modal from 'react-modal';

import Image from 'next/image';
import InputMask from 'react-input-mask';
import { AiFillCheckCircle } from 'react-icons/ai';
import Select from 'react-select';
import * as yup from 'yup';
import { connect } from 'react-redux';
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
import { validaDataBr } from '../../validacoes/DataBr';
import { smsOuEmail, validaMobile } from '../../api/validacaoTelefoneEmail';
import { AddSaldo } from '../../api/carteira';
import getImg from '../../assets';
import { verificarNomeCompleto } from '../../validacoes/validarMascaras';
import CpfCnpjInput from '../../components/ui/InputCpfCnpj';
import {
	resetUserRegisterData,
	setUserRegisterField,
} from '../../redux/actions/userRegisterActions';

import getPropSegura from '../../utils/getPropSegura';
import styles from './styles.module.scss';

interface TransferenciasPropos {
	tipo?: string;
	valorTr: string;
}

type TypeDadossucesso = {
	id: string;
	clientCode: string;
};

const FormaTransferenciasInterna = (props: any) => {
	const user = useSelector((state: any) => state.userReducer.user);
	const [typeOptionSchedule, setTypeOptionSchedule] = useState('');
	const [validaValorTransferencia, setValidaValorTransferencia] = useState('');
	const [modalRetornoTransacao, setModalRetornoTransacao] = useState(false);
	const [guardaDadosForm, setGuardaDadosForm] = useState([]);
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
	const [bancoOption, setBancoOption] = useState(4);
	let erroRetonoCod = '';
	let erroRetonoMensage = '';
	const dateNow = new Date().toDateString();

	const {
		allFields,
		addFavodecido,
		agencia,
		agendamento,
		conta,
		descricao,
		docFavorecido,
		finalidade,
		nomeBanco,
		nomeFavorecido,
		tipoConta,
		tipoTransacao,
		dataAgendamento,
		valorTransferencia,
		setFieldRedux,
		invalidFields,
		resetUserRegisterDataRedux,
	} = props;

	const [nPagina, setNpagina] = useState(1);
	const [isLoading, setIsLoading] = useState(false);

	const handleValueChangeCpfOrCnpj = ({
		name,
		valor,
		isCpf,
		isCnpj,
		isValid,
	}) => {
		setFieldRedux(name, {
			name,
			valor,
			isCpf,
			isCnpj,
			isValid,
		});
	};

	const handleValueChange = ({ name, valor, isValid }) => {
		setFieldRedux(name, {
			name,
			valor,
			isValid,
		});
	};

	const optionsBancos = [
		{ value: 1, label: 'Banco do Brasil' },
		{ value: 2, label: 'Banco Inter' },
		{ value: 3, label: 'Nunbank' },
		{ value: 4, label: 'Caixa Económica federal' },
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
	//  console.log('errors', errors)
	//  function onSubmitHandler: SubmitHandler<dadosInputGFormProps> = (data){
	//  console.log('errors', data)
	//  }

	const handleTransfer = async (dataForm) => {
		if (validaValorTransferencia) {
			setGuardaDadosForm(dataForm);
			setAbreBodalTranfereciaCheckOut(true);
			//	sendToken(user.tipo_auth_transacao, '31986400076')
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
		const dataCredito = {
			total: formaTavalorCelcoin(validaValorTransferencia),
			descricao: guardaDadosForm[0].descricao,
			tipo: 'CREDITO',
		};

		const dataDebito = {
			total: formaTavalorCelcoin(validaValorTransferencia),
			descricao: guardaDadosForm[0].descricao,
			tipo: 'DEBITO',
		};

		const daDos = {
			data: guardaDadosForm,
			valorTratado: validaValorTransferencia,
			stadoModa: true,
		};

		try {
			const responseDebito = await AddSaldo(dataDebito, user.numeroConta);
			if (responseDebito.data.status === 200 && responseDebito?.data?.data) {
				//	setIsOpen(false)
				console.log('primeiro');
				try {
					const responseCredito = await AddSaldo(
						dataCredito,
						guardaDadosForm[0].conta
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
	};

	function disparaErro(paramTexto: string) {
		toast.error(`Falaha na transação`, {
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

	async function sendToken(tipo: string, dadosEnvio: string) {
		switch (tipo) {
			case 'sms':
				console.log('tipo codigo', tipo);
				try {
					const response = await smsOuEmail(tipo, dadosEnvio);
					if (response.data.status === 200) {
						let tipoStringEnvio = '';

						if (tipo == 'sms') {
							tipoStringEnvio = 'Telefone';
						} else {
							tipoStringEnvio = 'E-mail';
						}

						toast.success(
							`Um código foi enviado para o ${tipoStringEnvio}: ${dadosEnvio}`,
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
					setIsOpen(false);
				}

				break;

			case 'email':
				break;

			case 'mobile':
				try {
					const response = await validaMobile(tipo, dadosEnvio);
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<form onSubmit={handleTransfer}>
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
					<div className={styles.iputGroup}>
						<div className={styles.containerInut}>
							<label>Nome do banco</label>
							<Select
								options={optionsBancos}
								value={optionsBancos.find((c) => c.value === nomeBanco.valor)}
								onChange={(val) => setBancoOption(val.value)}
								className={styles.inputSelect}
							/>
						</div>
						<div className={styles.containerInut}>
							<label>Agência</label>
							<InputMask
								placeholder="Agência"
								mask={null}
								value={agencia.valor}
								onChange={(event) => {
									const inputValue = event.target.value;
									if (inputValue.length < 4) {
										const auxInvalidFields = [...invalidFields, 'agencia'];
										setFieldRedux('invalidFields', auxInvalidFields);
									} else {
										const auxInvalidFields = invalidFields.filter(
											(field: string) => field !== 'agencia'
										);
										setFieldRedux('invalidFields', auxInvalidFields);
									}
									handleValueChange({
										name: 'agencia',
										valor: inputValue,
										isValid: true,
									});
								}}
								className={styles.input}
								style={{ borderColor: getColorError('agencia') }}
							/>
							{invalidFields.includes('agencia') && (
								<p className={styles.labelError}></p>
							)}
						</div>
						<div className={styles.containerInut}>
							<label>Conta</label>
							<InputMask
								placeholder="Conta"
								mask={null}
								value={conta.valor}
								onChange={(event) => {
									const inputValue = event.target.value;
									if (inputValue.length < 4) {
										const auxInvalidFields = [...invalidFields, 'conta'];
										setFieldRedux('invalidFields', auxInvalidFields);
									} else {
										const auxInvalidFields = invalidFields.filter(
											(field: string) => field !== 'conta'
										);
										setFieldRedux('invalidFields', auxInvalidFields);
									}
									handleValueChange({
										name: 'conta',
										valor: inputValue,
										isValid: true,
									});
								}}
								className={styles.input}
								style={{ borderColor: getColorError('conta') }}
							/>
							{invalidFields.includes('conta') && (
								<p className={styles.labelError}></p>
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
							<InputMask
								placeholder="Nome Favoreciso*"
								mask={null}
								value={nomeFavorecido.valor}
								onChange={(event) => {
									const { value } = event.target;
									let isValid = false;
									if (!verificarNomeCompleto(value)) {
										isValid = false;
										const auxInvalidFields = [
											...invalidFields,
											'nomeFavorecido',
										];
										setFieldRedux('invalidFields', auxInvalidFields);
									} else {
										isValid = true;
										const auxInvalidFields = invalidFields.filter(
											(field: string) => field !== 'nomeFavorecido'
										);
										setFieldRedux('invalidFields', auxInvalidFields);
									}
									setFieldRedux('nomeFavorecido', {
										name: 'nomeFavorecido',
										valor: value,
										isValid: isValid,
									});
								}}
								className={styles.input}
								style={{ borderColor: getColorError('nomeFavorecido') }}
							/>
							{invalidFields.includes('nomeFavorecido') && (
								<p className={styles.labelError}>Digite seu nome completo</p>
							)}
						</div>
						<div className={styles.containerInut}>
							<label>CPF/CNPJ</label>
							<CpfCnpjInput
								onValueChange={handleValueChangeCpfOrCnpj}
								inputProps={{
									value: docFavorecido.valor,
								}}
								borderColor={getColorError('docFavorecido')}
							/>
						</div>
					</div>

					{/*  /////////////////// */}

					<div className={styles.iputGroupCheckAddFavorites}>
						<div>
							<input
								//className={styles.inputG}
								//{...register('addFavodecido')}
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

					<div className={styles.tituloGroup}>
						<h5>Detalhes da transferência ?</h5>
					</div>
					<div className={styles.iputGroup}>
						<div className={styles.containerInut}>
							<label>Tipo de conta</label>
						</div>
						<div className={styles.containerInut}>
							<label>Tipo de transação</label>
						</div>
					</div>

					{/*  /////////////////// */}

					<div className={styles.iputGroup}>
						<div className={styles.containerInut}>
							<label>Finalidade</label>
						</div>
						<div className={styles.containerInut}>
							<label>Descrição</label>
						</div>
					</div>

					{/*  /////////////////// */}

					<div className={styles.tituloGroup}>
						<h5>Transferir quando? ?</h5>
					</div>
					<div className={styles.containerAgendamento}>
						<div className={styles.cardLeft}>
							<div className={styles.iputGroupCheck}>
								<div>
									<input
										type="radio"
										name="agendamento"
										value="1"
										//{...register('agendamento')}
										placeholder="agendamento"
										// required
									/>
									<label>Hoje ou no próximo dia útil</label>
								</div>

								<div>
									<input
										type="radio"
										name="agendamento"
										value="2"
										//{...register('agendamento')}
										placeholder="agendamento"
										// required
									/>
								</div>

								<label>Agendar</label>
							</div>
						</div>
						<div className={styles.carRigth}>
							{typeOptionSchedule === '2' && (
								<div className={styles.containerInut}></div>
							)}
						</div>
					</div>

					<div className={styles.ButtomSubmitTransfer}>
						<Buttom
							type="submit"
							//loading={loading}
						>
							Transferir
						</Buttom>
					</div>
				</section>
			</form>
			{abreBodalTranfereciaCheckOut == true && (
				<Modal
					className={styles.modalContainerSucesso}
					isOpen={abreBodalTranfereciaCheckOut}
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
									{guardaDadosForm[0].nomeFavorecido != undefined
										? guardaDadosForm[0].nomeFavorecido
										: ''}
								</p>
								<p>
									Agência:
									{guardaDadosForm[0].agencia != undefined
										? guardaDadosForm[0].agencia
										: ''}
								</p>
								<p>
									Conta:
									{guardaDadosForm[0].conta != undefined
										? guardaDadosForm[0].conta
										: ''}
								</p>
								<p>
									:{' '}
									{guardaDadosForm[0].agendamento == '1'
										? validaDataBr(dateNow)
										: ''}
								</p>
							</div>
							<div>
								{abilitaQrCode == true ? <img src={`${linkBase64}`} /> : ''}
							</div>
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
				</Modal>
			)}

			<div>
				{checkRetornoTransacao == true && (
					<Modal
						className={styles.modalContainerSucesso}
						isOpen={checkRetornoTransacao}
						disablePortal
						disableEnforceFocus
						disableAutoFocus
						open
						contentLabel="Example Modal"
					>
						<section
							id="comprovante"
							className={styles.containerModalPixSucesso}
						>
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
									<h4>Wagner</h4>
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
										{guardaDadosForm[0].nomeFavorecido != undefined
											? guardaDadosForm[0].nomeFavorecido
											: ''}
									</p>
									<p>
										Agência:
										{guardaDadosForm[0].agencia != undefined
											? guardaDadosForm[0].agencia
											: ''}
									</p>
									<p>
										Conta:
										{dadosRetornoTransacao?.clientCode != undefined
											? guardaDadosForm[0].conta
											: ''}
									</p>
								</div>
								<div className={styles.containerbuttomEnviarPix}>
									<Buttom
										type="button"
										//onClick={() => printComprovante(1)}
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
				)}
			</div>

			{modalIsOpen ? <Spinner /> : ''}
		</div>
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
		nomeBanco: getPropSegura(state, ['userRegisterReducer', 'nomeBanco'], {
			valor: '',
			isCpf: true,
			isCnpj: false,
			isValid: false,
			page: 1,
		}),
		agencia: getPropSegura(state, ['userRegisterReducer', 'agencia'], {
			valor: '',
			isValid: false,
		}),
		conta: getPropSegura(state, ['userRegisterReducer', 'conta'], {
			valor: '',
			isValid: false,
		}),
		nomeFavorecido: getPropSegura(
			state,
			['userRegisterReducer', 'nomeFavorecido,'],
			{
				valor: '',
				isValid: false,
			}
		),
		docFavorecido: getPropSegura(
			state,
			['userRegisterReducer', 'docFavorecido,'],
			{
				valor: '',
				isCpf: true,
				isCnpj: false,
				isValid: false,
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

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FormaTransferenciasInterna);

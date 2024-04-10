/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import Modal from 'react-modal';

import Image from 'next/image';
import CpfCnpjInput from '../../components/ui/InputCpfCnpj';
import { AiFillCheckCircle } from 'react-icons/ai';
import { verificarNomeCompleto } from '../../validacoes/validarMascaras';
import * as yup from 'yup';
import { connect } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import getPropSegura from '../../utils/getPropSegura';
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
import InputMask from 'react-input-mask';
import getImg from '../../assets';
import Select from 'react-select';
import PageButtons from './PageButtons';

import {
	resetUserRegisterData,
	setUserRegisterField,
} from '../../redux/actions/userRegisterActions';

import styles from './styles.module.scss';
import { useStepContext } from '@mui/material';

interface TransferenciasPropos {
	tipo?: string;
	valorTr: string;
}

type dadosInputGFormProps = {
	addFavodecido: boolean;
	agencia: string;
	agendamento: string;
	conta: string;
	descricao: string;
	docFavorecido: string;
	finalidade: string;
	nomeBanco: string;
	nomeFavorecido: string;
	tipoConta: string;
	tipoTransacao: string;
	dataAgendamento?: string;
	valorTransferencia: string;
};

type TypeDadossucesso = {
	id: string;
	clientCode: string;
};

const FormTransferenciasForm = (props: any) => {
	const {
		allFields,
		addFavodecido,
		agencia,
		agendamento,
		conta,
		descricao,
		cpfCnpj,
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

	const user = useSelector((state: any) => state.userReducer.user);

	const [typeOptionSchedule, setTypeOptionSchedule] = useState('');
	const [validaValorTransferencia, setValidaValorTransferencia] = useState('');
	const [modalRetornoTransacao, setModalRetornoTransacao] = useState(false);
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

	const [optionBank, setOptionBank] = useState(0);
	const [optionAcount, setOptionAcount] = useState(0);
	const [optionTransaction, setOptionTransaction] = useState(0);
	const [optionAgendamentoHoje, setOprionAgendamentoHoje] = useState(true);
	const [optionAgendamentoOutros, setOprionAgendamentoOutros] = useState(false);
	const [agendamentoPagamento, setAgendamentoPagamento] = useState('');
	let erroRetonoCod = '';
	let erroRetonoMensage = '';
	const dateNow = new Date().toDateString();

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

	const handleTransfer = () => {
		const dataForm = {
			addFavodecido: addFavodecido.valor,
			agencia: agencia.valor,
			agendamento: agendamento.valor,
			conta: conta.valor,
			descricao: descricao.valor,
			docFavorecido: cpfCnpj.valor,
			finalidade: finalidade.valor,
			nomeBanco: nomeBanco.valor,
			nomeFavorecido: nomeFavorecido.valor,
			tipoConta: tipoConta.valor,
			tipoTransacao: tipoTransacao.valor,
			dataAgendamento: dataAgendamento.valor,
			valorTransferencia: valorTransferencia.valor,
		};
		if (validaValorTransferencia) {
			console.log('dados formulario', dataForm);
			setGuardaDadosForm(dataForm);
			setAbreBodalTranfereciaCheckOut(true);
			sendToken(user.tipo_auth_transacao);
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
			descricao: guardaDadosForm.descricao,
			tipo: 'CREDITO',
		};

		const dataDebito = {
			total: formaTavalorCelcoin(validaValorTransferencia),
			descricao: guardaDadosForm.descricao,
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

	function selectAgendamento(event) {
		console.log(event.target.value);
		setAgendamentoPagamento(event.target.value);
		const isValid = true;
		const auxInvalidFields = invalidFields.filter(
			(field: string) => field !== 'agendamento'
		);
		setFieldRedux('invalidFields', auxInvalidFields);

		handleValueChange({
			name: 'agendamento',
			valor: event.target.value,
			isValid: isValid,
		});
	}
	///// nova autenticação form

	const getColorError = (field: string) => {
		if (invalidFields.includes(field)) {
			return '#FF0000';
		}
		if (allFields[field]?.isValid) {
			return '#32A639';
		}
	};

	const verifyFieldsByPage = () => {
		const invalidFieldsByPage = invalidFields.filter(
			(field: string) => allFields[field]
		);
		let isValid = true;
		const limpadoc = '';
		let campo = '';

		console.log('agencia', agencia.isValid);
		console.log('conta', conta.isValid);
		console.log('nomeFavorecido', nomeFavorecido.isValid);
		console.log('cpfCnpj', cpfCnpj.isValid);
		console.log('tipoConta', tipoConta.isValid);
		console.log('tipoTransacao', tipoTransacao.isValid);
		console.log('finalidade', finalidade.isValid);
		console.log('descricao', descricao.isValid);
		console.log('agendamento', agendamento.isValid);
		console.log('dataAgendamento', dataAgendamento.isValid);
		console.log('addFavodecido', addFavodecido.isValid);
		console.log('validaValorTransferencia', valorTransferencia.isValid);
		if (!agencia.isValid) {
			isValid = false;
			campo = 'a agencia';
		}
		if (!conta.isValid) {
			isValid = false;
			campo = 'a conta';
		}
		if (!nomeFavorecido.isValid) {
			isValid = false;
			campo = 'o nome completo';
		}
		if (!cpfCnpj.isValid) {
			isValid = false;
			campo = 'o ducumento';
		}
		if (!tipoConta.isValid) {
			isValid = false;
			campo = 'o tipo de conta';
		}
		if (!tipoTransacao.isValid) {
			isValid = false;
			campo = 'o tipo de transação';
		}
		if (!finalidade.isValid) {
			isValid = false;
			//campo = 'o valor';
			campo = 'a finalidade';
		}
		if (!descricao.isValid) {
			isValid = false;
			//campo = 'o valor';
			campo = 'a descrição';
		}
		if (!agendamento.isValid) {
			isValid = false;
			campo = 'o agendamento';
		}

		if (!dataAgendamento.isValid) {
			isValid = false;
			campo = 'o agendamento data';
		}

		if (!addFavodecido.isValid) {
			isValid = false;
			campo = 'o add ';
		}
		if (!valorTransferencia.isValid) {
			isValid = false;
			campo = 'o Valor';
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
		console.log('tamanho invalid', isValid);
		return invalidFieldsByPage?.length === 0;
	};
	function handleSubmit() {}

	const handleNextPage = async () => {
		const isValidsFields = verifyFieldsByPage();
		console.log('verifica', isValidsFields);
		if (isValidsFields == true) {
			handleTransfer();
			console.log('verifica', isValidsFields);
		}
	};
	useEffect(() => {
		const isValid = true;
		const auxInvalidFields = [...invalidFields, 'nomeBanco'];
		setFieldRedux('invalidFields', auxInvalidFields);

		handleValueChange({
			name: 'valorTransferencia',
			valor: props.valorTr,
			isValid: true,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.valorTr]);

	useEffect(() => {
		return () => {
			resetUserRegisterDataRedux();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<section className={styles.containerTransferencia}>
				<div className={styles.tituloGroup}>
					<h5>Dados bancários</h5>
				</div>
				<div className={styles.iputGroup}>
					<div className={styles.containerInut}>
						<label>Nome do banco</label>
						<SelectInputBit
							placeholder="Tipo transação"
							value={nomeBanco.valor}
							onChange={async (event) => {
								const inputValue = event.target.value;
								let isValid = true;
								console.log('valor conta', event.target.value);
								if (inputValue == '0') {
									isValid = true;
									const auxInvalidFields = [...invalidFields, 'nomeBanco'];
									setFieldRedux('invalidFields', auxInvalidFields);
								} else {
									isValid = true;
									const auxInvalidFields = invalidFields.filter(
										(field: string) => field !== 'nomeBanco'
									);
									setFieldRedux('invalidFields', auxInvalidFields);
								}
								handleValueChange({
									name: 'nomeBanco',
									valor: inputValue,
									isValid: true,
								});
							}}
						>
							{optionsBancos.map((opt) => (
								<option value={opt.value}>{opt.label}</option>
							))}
						</SelectInputBit>
					</div>
					<div className={styles.containerInut}>
						<InputMask
							placeholder="Agência*"
							mask={null}
							value={agencia.valor}
							onChange={async (event) => {
								const inputValue = event.target.value;
								let isValid = false;
								if (inputValue.length < 4) {
									isValid = false;
									const auxInvalidFields = [...invalidFields, 'agencia'];
									setFieldRedux('invalidFields', auxInvalidFields);
								} else {
									isValid = true;
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
							<p className={styles.labelError}>Digite um E-mail válido</p>
						)}
					</div>
					<div className={styles.containerInut}>
						<label>Conta</label>
						<InputMask
							placeholder="Conta*"
							mask={null}
							value={conta.valor}
							onChange={async (event) => {
								const inputValue = event.target.value;
								let isValid = false;
								if (inputValue.length < 4) {
									isValid = false;
									const auxInvalidFields = [...invalidFields, 'conta'];
									setFieldRedux('invalidFields', auxInvalidFields);
								} else {
									isValid = true;
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
							<p className={styles.labelError}>Digite um E-mail válido</p>
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
							placeholder="Nome Completo*"
							mask={null}
							value={nomeFavorecido.valor}
							onChange={(event) => {
								const { value } = event.target;
								let isValid = false;
								if (!verificarNomeCompleto(value)) {
									isValid = false;
									const auxInvalidFields = [...invalidFields, 'nomeFavorecido'];
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
									isValid: true,
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
								value: cpfCnpj.valor,
							}}
							borderColor={getColorError('cpfCnpj')}
						/>
					</div>
				</div>

				{/*  /////////////////// */}

				<div className={styles.iputGroupCheckAddFavorites}>
					<div>
						<input
							//className={styles.inputG}

							placeholder="addFavodecido"
							type="checkbox"
							name="addFavodecido"
							onChange={async (event) => {
								const inputValue = event.target.value;
								let isValid = true;
								console.log('valor conta', event.target.value);
								if (inputValue) {
									isValid = true;
									const auxInvalidFields = [...invalidFields, 'addFavodecido'];
									setFieldRedux('invalidFields', auxInvalidFields);
								} else {
									isValid = true;
									const auxInvalidFields = invalidFields.filter(
										(field: string) => field !== 'addFavodecido'
									);
									setFieldRedux('invalidFields', auxInvalidFields);
								}
								handleValueChange({
									name: 'addFavodecido',
									valor: inputValue,
									isValid: true,
								});
							}}
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
						<SelectInputBit
							placeholder="Tipo transação"
							value={tipoConta.valor}
							onChange={async (event) => {
								const inputValue = event.target.value;
								let isValid = true;
								console.log('valor conta', event.target.value);
								if (inputValue == '0') {
									isValid = true;
									const auxInvalidFields = [...invalidFields, 'tipoConta'];
									setFieldRedux('invalidFields', auxInvalidFields);
								} else {
									isValid = true;
									const auxInvalidFields = invalidFields.filter(
										(field: string) => field !== 'tipoConta'
									);
									setFieldRedux('invalidFields', auxInvalidFields);
								}
								handleValueChange({
									name: 'tipoConta',
									valor: inputValue,
									isValid: true,
								});
							}}
						>
							{optionsTipoConta.map((opt) => (
								<option value={opt.value}>{opt.label}</option>
							))}
						</SelectInputBit>
					</div>
					<div className={styles.containerInut}>
						<label>Tipo de transação</label>

						<SelectInputBit
							placeholder="Tipo transação"
							value={tipoTransacao.valor}
							onChange={async (event) => {
								const inputValue = event.target.value;
								console.log('tipo transação', event.target.value);
								let isValid = true;
								if (inputValue == '0') {
									isValid = true;
									const auxInvalidFields = [...invalidFields, 'tipoTransacao'];
									setFieldRedux('invalidFields', auxInvalidFields);
								} else {
									isValid = true;
									const auxInvalidFields = invalidFields.filter(
										(field: string) => field !== 'tipoTransacao'
									);
									setFieldRedux('invalidFields', auxInvalidFields);
								}
								handleValueChange({
									name: 'tipoTransacao',
									valor: inputValue,
									isValid: true,
								});
							}}
						>
							{optionsTipoTransacao.map((opt) => (
								<option value={opt.value}>{opt.label}</option>
							))}
						</SelectInputBit>
					</div>
				</div>

				{/*  /////////////////// */}

				<div className={styles.iputGroup}>
					<div className={styles.containerInut}>
						<label>Finalidade</label>

						<InputMask
							placeholder="Conta*"
							mask={null}
							value={finalidade.valor}
							onChange={async (event) => {
								const inputValue = event.target.value;
								let isValid = false;
								if (inputValue.length < 4) {
									isValid = false;
									const auxInvalidFields = [...invalidFields, 'finalidade'];
									setFieldRedux('invalidFields', auxInvalidFields);
								} else {
									isValid = true;
									const auxInvalidFields = invalidFields.filter(
										(field: string) => field !== 'finalidade'
									);
									setFieldRedux('invalidFields', auxInvalidFields);
								}
								handleValueChange({
									name: 'finalidade',
									valor: inputValue,
									isValid: true,
								});
							}}
							className={styles.input}
							style={{ borderColor: getColorError('finalidade') }}
						/>
						{invalidFields.includes('finalidade') && (
							<p className={styles.labelError}>Digite um E-mail válido</p>
						)}
					</div>
					<div className={styles.containerInut}>
						<label>Descrição</label>

						<InputMask
							placeholder="Descrição*"
							mask={null}
							value={descricao.valor}
							onChange={async (event) => {
								const inputValue = event.target.value;
								let isValid = false;
								if (inputValue.length < 4) {
									isValid = false;
									const auxInvalidFields = [...invalidFields, 'descricao'];
									setFieldRedux('invalidFields', auxInvalidFields);
								} else {
									isValid = true;
									const auxInvalidFields = invalidFields.filter(
										(field: string) => field !== 'descricao'
									);
									setFieldRedux('invalidFields', auxInvalidFields);
								}
								handleValueChange({
									name: 'descricao',
									valor: inputValue,
									isValid: true,
								});
							}}
							className={styles.input}
							style={{ borderColor: getColorError('descricao') }}
						/>
						{invalidFields.includes('descricao') && (
							<p className={styles.labelError}>Digite um E-mail válido</p>
						)}
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
									placeholder="agendamento"
									checked={agendamentoPagamento === '1'}
									onChange={selectAgendamento}
									// required
								/>
								<label>Hoje ou no próximo dia útil</label>
							</div>

							<div>
								<input
									type="radio"
									name="agendamento"
									value="2"
									placeholder="agendamento"
									checked={agendamentoPagamento === '2'}
									onChange={selectAgendamento}

									// required
								/>
							</div>
						</div>
					</div>
					<div className={styles.carRigth}>
						{agendamento.valor === '2' && (
							<div className={styles.containerInut}>
								<InputFormBit
									placeholder="Data transação"
									type="date"
									//onChange={onChange}

									value={dataAgendamento.valor}
									onChange={async (event) => {
										const inputValue = event.target.value;
										let isValid = false;
										if (inputValue.length < 4 || agendamentoPagamento == '2') {
											isValid = true;
											const auxInvalidFields = [
												...invalidFields,
												'dataAgendamento',
											];
											setFieldRedux('invalidFields', auxInvalidFields);
										} else {
											isValid = true;
											const auxInvalidFields = invalidFields.filter(
												(field: string) => field !== 'dataAgendamento'
											);
											setFieldRedux('invalidFields', auxInvalidFields);
										}
										handleValueChange({
											name: 'dataAgendamento',
											valor: inputValue,
											isValid: true,
										});
									}}
								/>
							</div>
						)}
					</div>
				</div>

				<div className={styles.ButtomSubmitTransfer}>
					<PageButtons showBack={false} onNext={handleNextPage} />
				</div>
			</section>

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
			isValid: false,
		}),

		agencia: getPropSegura(state, ['userRegisterReducer', 'agencia'], {
			valor: '',
			isCpf: true,
			isCnpj: false,
			isValid: false,
		}),

		conta: getPropSegura(state, ['userRegisterReducer', 'conta'], {
			valor: '',
			isValid: false,
		}),

		nomeFavorecido: getPropSegura(
			state,
			['userRegisterReducer', 'nomeFavorecido'],
			{
				valor: '',
				isValid: false,
			}
		),

		cpfCnpj: getPropSegura(state, ['userRegisterReducer', 'cpfCnpj'], {
			valor: '',
			isCpf: true,
			isCnpj: false,
			isValid: false,
		}),

		finalidade: getPropSegura(state, ['userRegisterReducer', 'finalidade'], {
			valor: '',
			isValid: false,
		}),

		descricao: getPropSegura(state, ['userRegisterReducer', 'descricao'], {
			valor: '',
			isValid: false,
		}),

		tipoConta: getPropSegura(state, ['userRegisterReducer', 'tipoConta'], {
			valor: '',
			isValid: false,
		}),

		tipoTransacao: getPropSegura(
			state,
			['userRegisterReducer', 'tipoTransacao'],
			{
				valor: '',
				isValid: false,
			}
		),

		agendamento: getPropSegura(state, ['userRegisterReducer', 'agendamento'], {
			valor: '',
			isValid: false,
		}),

		dataAgendamento: getPropSegura(
			state,
			['userRegisterReducer', 'dataAgendamento'],
			{
				valor: '',
				isValid: false,
			}
		),

		addFavodecido: getPropSegura(
			state,
			['userRegisterReducer', 'addFavodecido'],
			{
				valor: '',
				isValid: false,
			}
		),

		valorTransferencia: getPropSegura(
			state,
			['userRegisterReducer', 'valorTransferencia'],
			{
				valor: '',
				isValid: false,
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
)(FormTransferenciasForm);

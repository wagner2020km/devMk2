/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import Modal from 'react-modal';
import {
	resetUserRegisterData,
	setUserRegisterField,
} from '../../redux/actions/userRegisterActions';
import getPropSegura from '../../utils/getPropSegura';
import { AlertColor } from '@mui/material/Alert';
import { connect } from 'react-redux';
import Image from 'next/image';
import { decryptID } from '../../utils/encryptId';
import { virifyCpgCnpj } from '../../validacoes/maskCpfCnpj';
import { InputFormBitClean, TextArea } from '../../components/ui/InputFormBit';
import { AiFillCheckCircle } from 'react-icons/ai';
import { Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Button, Stack, Hidden } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import AlertSnack from '../../components/AlertSnack/AlertSnack'
import { moneyMask } from '../../utils/cpfMask';
import { toast } from 'react-toastify';
import { Spinner } from '../../components/Spinner/Spinner';
import GetDateNoW from '../../utils/functions/GetDateNow';
import { useDispatch } from 'react-redux';
//import { Buttom } from '../ui/Buttom';
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
import { geraPdfComprovante } from '../../utils/comprovantePdf'
import styles from './styles.module.scss';


type dadosInputGFormProps = {
	addFavodecido: boolean;
	agendamento: string;
	descricao: string;
	docFavorecido: string;
	agencia: string;
	nomeFavorecido: string;
	tipoConta: string;
	contaTemporaria?: string;
	valorTransferencia: string;
	numeroConta: string;
};

type TypeDadossucesso = {
	id: string;
	clientCode: string;
};

const FormTransferencias = (props: any) => {

	const user = useSelector((state: any) => state.userReducer.user);
	const dispatch = useDispatch();
	const divRef = useRef(null);
	const router = useRouter();
	const { acountCode } = router.query;
	console.log('Id do plano', acountCode);

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

	const [openAlert, setOpenAlert] = useState(false);
	const [nPagina, setNpagina] = useState(1);
	const [menssageAlert, setMenssageAlert] = useState('');
	const [typeAlert, setTypeAlert] = useState<AlertColor>('success');

	let erroRetonoCod = '';
	let erroRetonoMensage = '';
	const dateNow = new Date().toDateString();


	const {
		allFields,
		contaTemporaria,
		numeroConta,
		valorTransferencia,
		agencia,
		nomeFavorecido,
		docFavorecido,
		addFavodecido,
		descricao,
		setFieldRedux,
		invalidFields,
		resetUserRegisterDataRedux,
	} = props;

	const {
		control,
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors },
	} = useForm<dadosInputGFormProps>({
		mode: 'onChange',

	});



	const handleValueChange = ({ name, valor, isValid, page }: {
		name: string;
		valor: string; // Add this line to explicitly declare the type
		isValid: boolean;
		page: number;
	}) => {
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

			if (!contaTemporaria.isValid) {
				isValid = false;
				handleClick('Conta é obrigatório', 'error');
			}


		}

		if (page === 2) {

			if (!valorTransferencia.isValid) {
				isValid = false;
				handleClick('Valor é obrigatório', 'error');
			}
			if (!nomeFavorecido.isValid) {

				isValid = false;
				handleClick('Nome completo é obrigatório', 'error');
			}
			if (!agencia.isValid) {
				isValid = false;
				handleClick('Agência é obrigatório', 'error');
			}
			if (!contaTemporaria.isValid) {
				isValid = false;
				handleClick('Conta é obrigatório', 'error');
			}
			if (!docFavorecido.isValid) {
				isValid = false;
				handleClick('Documento é obrigatório', 'error');
			}

		}

		if (!isValid) {

			return false;
		}

		return isValid;
	};

	const handleNextPage = async () => {

		const isValidsFields = verifyFieldsByPage(nPagina);


		if (nPagina === 1) {
			if (isValidsFields) {

				handleSearchAcount(contaTemporaria.valor)
			}
		}
		if (nPagina === 2) {
			if (isValidsFields) {
				console.log('passando em verifyFieldsByPage verdadeiro', isValidsFields);
				finalizaTrasferencia()
			}
		}
	};

	const handleClick = (menssage: string, type: AlertColor) => {
		setMenssageAlert(menssage);
		setTypeAlert(type)
		setOpenAlert(true);
	};



	async function handleValidationAcount(dataAcount: any) {
		setIsOpen(true);

		// setSpinner(true)
		try {

			const response = await getAcount(dataAcount);
			console.log('dados da conta', response);
			if (response.status == 200) {
				setValue('nomeFavorecido', response.data.nome);
				//setValue('docFavorecido', response.data.documento);
				//setValue('conta', response.data.conta);
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
			//setValue('docFavorecido', false);
			//  setLoadButtomSubmit(false)

		}

	}
	const handleSearchAcount = async (numberAcount: any) => {

		console.log('Recebe numero conta para pewsuisa', numberAcount)
		if (numberAcount == 5585) {
			handleValueChange({
				name: 'numeroConta',
				valor: numberAcount,
				isValid: true,
				page: 2,
			});
			setNpagina(2)
			setValidaDadosConta(true);
		}

	}
	const finalizaTrasferencia = async () => {

		console.log(contaTemporaria.valor)
		console.log(valorTransferencia.valor)
		console.log(agencia.valor)
		console.log(nomeFavorecido.valor)
		console.log(docFavorecido.valor)
		console.log(addFavodecido.valor)
		console.log(descricao.valor)
		
	};

	

	


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

		if (acountCode) {
			handleSearchAcount(decryptID(String(acountCode)))
		}
	}, [acountCode]);

	useEffect(() => {

		dispatch(resetUserRegisterData());


	}, [dispatch]);
	return (
		<div>

			<section className={styles.containerTransferencia}>
				<div className={styles.tituloGroup}>
					<h5>Dados bancários</h5>
				</div>
				{validaDadosConta == false && (
					<div className={styles.iputGroup}>
						<div className={styles.containerInut}>
							<label>Conta</label>
							<Controller
								control={control}
								name="contaTemporaria"
								render={({ field: { onChange, onBlur, value } }) => (
									<InputFormBitClean
										placeholder="Número da conta"
										type="text"
										onChange={(event) => {
											const inputValue = event.target.value;
											let isValid = true;

											if (inputValue == '') {
												isValid = false;

												const auxInvalidFields = [
													...invalidFields,
													'contaTemporaria',
												];
												setFieldRedux('invalidFields', auxInvalidFields);

											} else {

												isValid = true;
												const auxInvalidFields = invalidFields.filter(
													(field: string) => field !== 'contaTemporaria'
												);
												setFieldRedux('invalidFields', auxInvalidFields);
											}

											handleValueChange({
												name: 'contaTemporaria',
												valor: inputValue,
												isValid: isValid,
												page: 1,
											});
										}}

										value={contaTemporaria.valor}
									/>
								)}

							/>
						</div>
						<div className={styles.containerInutButtom}>
							<Button
								type="submit"
								variant="contained"
								color="primary"
								onClick={() => handleNextPage()}
							>
								Persquisar
							</Button>
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
										<InputFormBitClean
											placeholder="Agência"
											type="email"
											readOnly={true}
											onChange={(event) => {
												const inputValue = event.target.value;
												let isValid = true;

												if (inputValue == '') {
													isValid = false;

													const auxInvalidFields = [
														...invalidFields,
														'agencia',
													];
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
													page: 2,
												});
											}}

											value={agencia.valor}
										/>
									)}
								/>

							</div>
							<div className={styles.containerInut}>
								<label>Conta</label>
								<Controller
									control={control}
									name="numeroConta"
									render={({ field: { onChange, onBlur, value } }) => (
										<InputFormBitClean
											placeholder="Número da conta"
											type="text"
											readOnly={true}
											onChange={(event) => {
												const inputValue = event.target.value;
												let isValid = true;

												if (inputValue == '') {
													isValid = false;

													const auxInvalidFields = [
														...invalidFields,
														'numeroConta',
													];
													setFieldRedux('invalidFields', auxInvalidFields);

												} else {

													isValid = true;
													const auxInvalidFields = invalidFields.filter(
														(field: string) => field !== 'numeroConta'
													);
													setFieldRedux('invalidFields', auxInvalidFields);
												}

												handleValueChange({
													name: 'numeroConta',
													valor: inputValue,
													isValid: isValid,
													page: 2,
												});
											}}

											value={numeroConta.valor}
										/>
									)}

								/>
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
										<InputFormBitClean
											placeholder="Nome"
											type="text"
											readOnly={true}
											onChange={(event) => {
												const inputValue = event.target.value;
												let isValid = true;

												if (inputValue == '') {
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

												handleValueChange({
													name: 'nomeFavorecido',
													valor: inputValue,
													isValid: isValid,
													page: 2,
												});
											}}

											value={nomeFavorecido.valor}
										/>
									)}
								/>

							</div>
							<div className={styles.containerInut}>
								<label>Documento</label>

								<Controller
									control={control}
									name="docFavorecido"
									render={({ field: { onChange, onBlur, value } }) => (

										<InputFormBitClean
											placeholder="Número da conta"
											type="text"
											readOnly={true}
											onChange={(event) => {
												console.log('asdadasdasdasd')
												const inputValue = virifyCpgCnpj(event.target.value);
												let isValid = true;

												if (inputValue == '') {
													isValid = false;

													const auxInvalidFields = [
														...invalidFields,
														'docFavorecido',
													];
													setFieldRedux('invalidFields', auxInvalidFields);

												} else {

													isValid = true;
													const auxInvalidFields = invalidFields.filter(
														(field: string) => field !== 'docFavorecido'
													);
													setFieldRedux('invalidFields', auxInvalidFields);
												}

												handleValueChange({
													name: 'docFavorecido',
													valor: inputValue,
													isValid: isValid,
													page: 2,
												});
											}}

											value={docFavorecido.valor}
										/>
									)}
								/>
							</div>
						</div>

						{/*  /////////////////// */}
						<div className={styles.iputGroup}>
							<div className={styles.containerInut}>
								<label>Valor:</label>
								<Controller
									control={control}
									name="valorTransferencia"
									render={({ field: { onChange, onBlur, value } }) => (
										<InputFormBitClean
											placeholder="0,00"
											type="text"
											onChange={(event) => {
												const inputValue = moneyMask(event.target.value);
												let isValid = true;

												if (inputValue == '') {
													isValid = false;

													const auxInvalidFields = [
														...invalidFields,
														'valorTransferencia',
													];
													setFieldRedux('invalidFields', auxInvalidFields);

												} else {

													isValid = true;
													const auxInvalidFields = invalidFields.filter(
														(field: string) => field !== 'valorTransferencia'
													);
													setFieldRedux('invalidFields', auxInvalidFields);
												}

												handleValueChange({
													name: 'valorTransferencia',
													valor: inputValue,
													isValid: isValid,
													page: 2,
												});
											}}

											value={valorTransferencia.valor}
										/>
									)}
								/>

							</div>
							<div className={styles.iputGroupCheckAddFavorites}>
								<div>
									<Controller
										name="addFavodecido"
										control={control}
										defaultValue={false}
										render={({ field }) => (
											<Checkbox
												{...field}
												onChange={(e) => {
													const inputValue = e.target.checked;
													let isValid = true;

													if (!inputValue) {
														isValid = false;
														console.log('check', isValid)
														const auxInvalidFields = [...invalidFields, 'addFavodecido'];
														setFieldRedux(auxInvalidFields);
													} else {
														console.log('check', isValid)
														const auxInvalidFields = invalidFields.filter(
															(field) => field !== 'addFavodecido'
														);
														setFieldRedux(auxInvalidFields);
													}

													handleValueChange({
														name: 'addFavodecido',
														valor: String(isValid),
														isValid: isValid,
														page: 2,
													});
												}}
											/>
										)}
									/>

								</div>
								<div>
									<label>Adicionar aos favoritos</label>
								</div>
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
										<InputFormBitClean
											placeholder="Número da conta"
											type="text"
											//readOnly={!!dataOrder?.customer?.email}
											onChange={(event) => {
												const inputValue = event.target.value;
												let isValid = true;

												if (inputValue == '') {
													isValid = false;

													const auxInvalidFields = [
														...invalidFields,
														'descricao',
													];
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
													isValid: isValid,
													page: 2,
												});
											}}

											value={descricao.valor}
										/>
									)}
								/>
							</div>
						</div>

						{/*  /////////////////// */}




						<div className={styles.ButtomSubmitTransfer}>

							<Button
								type="submit"
								variant="contained"
								color="primary"
								onClick={() => handleNextPage()}
							>
								Transferir
							</Button>
							<Button
								type="submit"
								variant="contained"
								color="warning"
								onClick={() => handleValidationAcount(getNumbarAcount)}
							>
								Cancelar
							</Button>

						</div>
					</>
				)}

			</section>
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
								{guardaDadosForm?.contaTemporaria != undefined
									? guardaDadosForm?.contaTemporaria
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
							{/*
							<Buttom
								type="button"
								onClick={() => finalizaTrasferencia()}
								loading={false}
							>
								ENVIAR PIX
							</Buttom>
								*/}

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
										? guardaDadosForm?.contaTemporaria
										: ''}
								</p>
							</div>
							<div className={styles.containerbuttomEnviarPix}>
								{/*
										<Buttom
											type="button"
											//onClick={() => printComprovante('comprovante')}
											onClick={() => geraPdfComprovante(divRef, user?.name)}
											loading={false}
										>
											GERAR PDF
										</Buttom>
											*/}

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
			{
				openAlert && (
					<AlertSnack
						message={menssageAlert}
						typeMessage={typeAlert}
						openAlertComponent={openAlert}
						onBack={() => { setOpenAlert(!openAlert) }}
					/>
				)
			}
			{modalIsOpen ? <Spinner /> : ''}
		</div>
	);
}

const mapStateToProps = (state: any) => {
	return {
		allFields: getPropSegura(state, ['userRegisterReducer'], {}),
		invalidFields: getPropSegura(
			state,
			['userRegisterReducer', 'invalidFields'],
			[]
		),

		contaTemporaria: getPropSegura(
			state,
			['userRegisterReducer', 'contaTemporaria'],
			{
				valor: '',
				isValid: false,
				page: 1,
			}
		),

		numeroConta: getPropSegura(
			state,
			['userRegisterReducer', 'numeroConta'],
			{
				valor: '',
				isValid: false,
				page: 2,
			}
		),


		valorTransferencia: getPropSegura(
			state,
			['userRegisterReducer', 'valorTransferencia'],
			{
				valor: '',
				isValid: false,
				page: 2,
			}
		),


		agencia: getPropSegura(
			state,
			['userRegisterReducer', 'agencia'],
			{
				valor: '',
				isValid: false,
				page: 2,
			}
		),

		nomeFavorecido: getPropSegura(
			state,
			['userRegisterReducer', 'nomeFavorecido'],
			{
				valor: '',
				isValid: false,
				page: 2,
			}
		),

		docFavorecido: getPropSegura(
			state,
			['userRegisterReducer', 'docFavorecido'],
			{
				valor: '',
				isValid: false,
				page: 2,
			}
		),

		addFavodecido: getPropSegura(
			state,
			['userRegisterReducer', 'addFavodecido'],
			{
				valor: '',
				isValid: false,
				page: 2,
			}
		),

		descricao: getPropSegura(
			state,
			['userRegisterReducer', 'descricao'],
			{
				valor: '',
				isValid: false,
				page: 2,
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

export default connect(mapStateToProps, mapDispatchToProps)(FormTransferencias);
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import {
	resetUserRegisterData,
	setUserRegisterField,
} from '../../redux/actions/userRegisterActions';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import AlertSnack from '../../components/AlertSnack/AlertSnack'
import Link from 'next/link';
import { useMediaQuery } from 'usehooks-ts';
import Container from '../../layout/Container';
import { InputFormBitClean, TextArea } from '../../components/ui/InputFormBit';
import { MdWifiCalling, MdStore, MdStreetview, MdSecurity } from "react-icons/md";
import ExportToExcel from '../../components/ExportToExcel/ExportToExcel'
import { Spinner } from '../../components/Spinner/Spinner';
import Select from 'react-select';

import ProtectedPage from '../../components/ProtectedPage/ProtectedPage'
import styles from './styles.module.scss';

import Extrato from '../../lib/bibliotecaBit/icons/Extrato';

import Pagination from '../../components/Pagination/Pagination';
import ButtonOptions from '../../components/ButtonOptions/ButtonOptions'


import 'react-day-picker/dist/style.css';
import getPropSegura from '../../utils/getPropSegura';

import { AlertColor } from '@mui/material/Alert';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Button, Stack, Hidden } from '@mui/material';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ContentCut from '@mui/icons-material/ContentCut';
import Edit from '@mui/icons-material/Edit';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import Cloud from '@mui/icons-material/Cloud';



import {
	validaDataBr,
	pegaDataAtual,
	pegaApenasData,
} from '../../validacoes/DataBr';

import { validaDiaDoMes, pegaHoraMinuto } from '../../utils/GetDate';
import { FaEdit, FaKey } from 'react-icons/fa';
import { AiFillProfile } from 'react-icons/ai';

interface ListExtratoProps {
	id: number;
	agencia: number;
	conta_corrente: string;
	nome?: string;
	sigla: string;
	tipo_transacao: string;
	valor: number;
}

type dadosInputGFormProps = {
	selectStatus: number;
	selectPerfil: number;
	cep: string
	rua: string;
	bairro: string;
	numero: string;
	estado: string;
	cidade: string;
	complemento: string

};

const StyledPaper = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(2),
	maxWidth: 400,
	color: theme.palette.text.primary,
}));


const dataLogistaJson = [
	{
		value: 1,
		label: 'Wagner',

	},
	{
		value: 2,
		label: 'Thiago',
	},
	{
		value: 3,
		label: 'Eduardo',
	},
	{
		value: 4,
		label: 'Adriano',
	},
	{
		value: 5,
		label: 'Daniel',
	}
]

const dataPerfilJson = [
	{
		value: 1,
		label: 'Cliente',

	},
	{
		value: 2,
		label: 'Gerente',
	},
	{
		value: 3,
		label: 'Admin',
	},

]

const dataStatusJson = [
	{
		value: 1,
		label: 'Ativo',

	},
	{
		value: 2,
		label: 'Inativo',
	}

]

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>,
) {
	return <Slide direction="up" ref={ref} {...props} />;
});


const dadosPerfil = (props: any) => {
	const user = useSelector((state: any) => state.userReducer.user);
	const saldo = useSelector((state: any) => state.saldoReducer.saldo);
	const isMobile = useMediaQuery('(max-width: 600px)');
	const [openAlert, setOpenAlert] = useState(false);
	const [nPagina, setNpagina] = useState(1);
	const [menssageAlert, setMenssageAlert] = useState('');
	const [typeAlert, setTypeAlert] = useState<AlertColor>('success');
	const [modalIsOpen, setIsOpen] = useState(false);



	const [modalDataOpen, setModalDataOpen] = React.useState(false);
	const [modalStatusOpen, setModalStatusOpen] = React.useState(false);

	const {
		allFields,
		selectStatus,
		selectPerfil,
		cep,
		rua,
		bairro,
		numero,
		estado,
		cidade,
		complemento,
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
	console.log('verificando se e mobile', isMobile)
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

	const handleClick = (menssage: string, type: AlertColor) => {
		setMenssageAlert(menssage);
		setTypeAlert(type)
		setOpenAlert(true);
	};

	const handleClickOpen = (modal: number) => {
		switch (modal) {
			case 1:
				setModalDataOpen(!modalDataOpen);
				break;

			case 2:
				setModalStatusOpen(!modalDataOpen);
				break;

			default:
				break;
		}


	};

	const handleClose = (modal: number) => {
		switch (modal) {
			case 1:
				setModalDataOpen(!modalDataOpen);
				break;

			case 2:
				setModalStatusOpen(!modalStatusOpen);
				break;

			default:
				break;
		}
	};

	const verifyFieldsByPage = (page: number) => {
		const invalidFieldsByPage = invalidFields.filter(
			(field: string) => allFields[field]?.page === page
		);
		let isValid = true;

		if (page === 1) {

			if (!cidade.isValid) {
				isValid = false;
				handleClick('Nome completo é obrigatório', 'error');
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
				//chama função search
			}
		}
	};


	return (
		<Container>
			<ProtectedPage
				errorMessage={'Acesso negado para o serviço'}
				errorType={'error'}
				page={'logista'}
			>
				<div className={styles.containerGeral}>
					<div className={styles.cardForm}>
						<div className={styles.contentDataForm}>

							<div className={styles.formSearch}>

								<Box sx={{ flexGrow: 1, overflow: 'hidden', px: 3 }}>
									<StyledPaper sx={{ my: 1, mx: 'auto', p: 2 }}>
										<MenuList>
											<MenuItem onClick={() => { handleClickOpen(1) }}>
												<ListItemIcon>
													<FaEdit size={20} color="#0fa89f" />
												</ListItemIcon>
												<ListItemText>Editar dados</ListItemText>

											</MenuItem >
											<MenuItem onClick={() => { handleClickOpen(2) }}>
												<ListItemIcon>
													<AiFillProfile size={20} color="#0fa89f" />

												</ListItemIcon>
												<ListItemText>Alterar status</ListItemText>

											</MenuItem>
											<MenuItem onClick={() => { handleClickOpen(2) }}>
												<ListItemIcon>
													<FaKey size={20} color="#0fa89f" />
												</ListItemIcon>
												<ListItemText>Alterar senha</ListItemText>

											</MenuItem>
										</MenuList>
									</StyledPaper>
								</Box>
								<Box sx={{ flexGrow: 1, overflow: 'hidden', px: 3 }}>
									<StyledPaper sx={{ my: 1, mx: 'auto', p: 2 }}>
										{/* Grid container para o primeiro bloco */}
										<Grid container alignItems="center" spacing={2}>
											<Grid item>
												<MdStreetview size={24} color="#0fa89f" />
											</Grid>
											<Grid item xs>
												<Typography noWrap>Cliente</Typography>
											</Grid>
										</Grid>
										<Box sx={{ paddingTop: 2 }}>
											<Grid container alignItems="center" spacing={2}>
												<Grid item>
													<Typography variant="h6" gutterBottom>Nome:</Typography>
												</Grid>
												<Grid item xs>
													<Typography noWrap>Wagner silva</Typography>
												</Grid>
											</Grid>
										</Box>
										<Box sx={{ paddingTop: 2 }}>
											<Grid container alignItems="center" spacing={1}>
												<Grid item>
													<Typography variant="h6" gutterBottom>Documento:</Typography>
												</Grid>
												<Grid item xs>
													<Typography noWrap>407.804.276-05</Typography>
												</Grid>
											</Grid>
										</Box>
										<Box sx={{ paddingTop: 2 }}>
											<Grid container alignItems="center" spacing={1}>
												<Grid item>
													<Typography variant="h6" gutterBottom>N Conta:</Typography>
												</Grid>
												<Grid item xs>
													<Typography noWrap>1233256</Typography>
												</Grid>
											</Grid>
										</Box>
									</StyledPaper>
								</Box>
								<Box sx={{ flexGrow: 1, overflow: 'hidden', px: 3 }}>
									<StyledPaper sx={{ my: 1, mx: 'auto', p: 2 }}>
										{/* Grid container para o primeiro bloco */}
										<Grid container alignItems="center" spacing={2}>
											<Grid item>
												<MdStore size={24} color="#0fa89f" />
											</Grid>
											<Grid item xs>
												<Typography noWrap>Endereço</Typography>
											</Grid>
										</Grid>
										<Box sx={{ paddingTop: 2 }}>
											<Grid container alignItems="center" spacing={1}>
												<Grid item>
													<Typography variant="h6" gutterBottom>Rua:</Typography>
												</Grid>
												<Grid item xs>
													<Typography noWrap>José Rufino, N 222, casa</Typography>
												</Grid>
											</Grid>
										</Box>
										<Box sx={{ paddingTop: 2 }}>
											<Grid container alignItems="center" spacing={1}>
												<Grid item>
													<Typography variant="h6" gutterBottom>Bairro:</Typography>
												</Grid>
												<Grid item xs>
													<Typography noWrap>Jardim felicidade</Typography>
												</Grid>
											</Grid>
										</Box>
										<Box sx={{ paddingTop: 2 }}>
											<Grid container alignItems="center" spacing={1}>
												<Grid item>
													<Typography variant="h6" gutterBottom>Cidade:</Typography>
												</Grid>
												<Grid item xs>
													<Typography noWrap>BH/MG</Typography>
												</Grid>
											</Grid>
										</Box>
									</StyledPaper>
								</Box>
								<Box sx={{ flexGrow: 1, overflow: 'hidden', px: 3 }}>
									<StyledPaper sx={{ my: 1, mx: 'auto', p: 2 }}>
										{/* Grid container para o primeiro bloco */}
										<Grid container alignItems="center" spacing={2}>
											<Grid item>
												<MdWifiCalling size={24} color="#0fa89f" />
											</Grid>
											<Grid item xs>
												<Typography noWrap>Contato</Typography>
											</Grid>
										</Grid>
										<Box sx={{ paddingTop: 2 }}>
											<Grid container alignItems="center" spacing={1}>
												<Grid item>
													<Typography variant="h6" gutterBottom>Telefone fixo:</Typography>
												</Grid>
												<Grid item xs>
													<Typography noWrap>Não informado</Typography>
												</Grid>
											</Grid>
										</Box>
										<Box sx={{ paddingTop: 2 }}>
											<Grid container alignItems="center" spacing={1}>
												<Grid item>
													<Typography variant="h6" gutterBottom>Telefone Celular:</Typography>
												</Grid>
												<Grid item xs>
													<Typography noWrap>(31) 986400075</Typography>
												</Grid>
											</Grid>
										</Box>
										<Box sx={{ paddingTop: 2 }}>
											<Grid container alignItems="center" spacing={1}>
												<Grid item>
													<Typography variant="h6" gutterBottom>E-mail:</Typography>
												</Grid>
												<Grid item xs>
													<Typography noWrap>wagnervaguim@gmail.com</Typography>
												</Grid>
											</Grid>
										</Box>
									</StyledPaper>
								</Box>
							</div>
						</div>
					</div>
					<Dialog
						fullWidth={true}
						maxWidth={'lg'}
						open={modalDataOpen}
						TransitionComponent={Transition}
						keepMounted
						//	onClose={() => { handleClose(1) }}
						aria-describedby="alert-dialog-slide-description"
					>
						<DialogTitle>{"Dados do cliente"}</DialogTitle>
						<DialogContent>
							<DialogContentText id="alert-dialog-slide-description">
								<div className={styles.contentDataForm}>
									<div className={styles.formSearch}>
										<div className={styles.containerInut}>
											<h4>E-mail:</h4>
											<Controller
												control={control}
												name="rua"
												render={({ field: { onChange, onBlur, value } }) => (
													<InputFormBitClean
														placeholder="E-mail"
														type="email"
														//readOnly={!!dataOrder?.customer?.email}
														onChange={(event) => {
															const inputValue = event.target.value;
															let isValid = true;

															if (inputValue == '') {
																isValid = false;

																const auxInvalidFields = [
																	...invalidFields,
																	'rua',
																];
																setFieldRedux('invalidFields', auxInvalidFields);

															} else {

																isValid = true;
																const auxInvalidFields = invalidFields.filter(
																	(field: string) => field !== 'rua'
																);
																setFieldRedux('invalidFields', auxInvalidFields);
															}

															handleValueChange({
																name: 'rua',
																valor: inputValue,
																isValid: isValid,
																page: 1,
															});
														}}

														value={rua.valor}
													/>
												)}
											/>
										</div>
										<div className={styles.containerInut}>
											<h4>Telefone fixo:</h4>
											<Controller
												control={control}
												name="rua"
												render={({ field: { onChange, onBlur, value } }) => (
													<InputFormBitClean
														placeholder="Telefone fixo"
														type="text"
														//readOnly={!!dataOrder?.customer?.email}
														onChange={(event) => {
															const inputValue = event.target.value;
															let isValid = true;

															if (inputValue == '') {
																isValid = false;

																const auxInvalidFields = [
																	...invalidFields,
																	'rua',
																];
																setFieldRedux('invalidFields', auxInvalidFields);

															} else {

																isValid = true;
																const auxInvalidFields = invalidFields.filter(
																	(field: string) => field !== 'rua'
																);
																setFieldRedux('invalidFields', auxInvalidFields);
															}

															handleValueChange({
																name: 'rua',
																valor: inputValue,
																isValid: isValid,
																page: 1,
															});
														}}

														value={rua.valor}
													/>
												)}
											/>
										</div>
										<div className={styles.containerInut}>
											<h4>Telefone Celular:</h4>
											<Controller
												control={control}
												name="rua"
												render={({ field: { onChange, onBlur, value } }) => (
													<InputFormBitClean
														placeholder="Telefone celular"
														type="text"
														//readOnly={!!dataOrder?.customer?.email}
														onChange={(event) => {
															const inputValue = event.target.value;
															let isValid = true;

															if (inputValue == '') {
																isValid = false;

																const auxInvalidFields = [
																	...invalidFields,
																	'rua',
																];
																setFieldRedux('invalidFields', auxInvalidFields);

															} else {

																isValid = true;
																const auxInvalidFields = invalidFields.filter(
																	(field: string) => field !== 'rua'
																);
																setFieldRedux('invalidFields', auxInvalidFields);
															}

															handleValueChange({
																name: 'rua',
																valor: inputValue,
																isValid: isValid,
																page: 1,
															});
														}}

														value={rua.valor}
													/>
												)}
											/>
										</div>
									</div>
									<div className={styles.formSearch}>
										<div className={styles.containerInut}>
											<h4>Cep:</h4>
											<Controller
												control={control}
												name="cep"
												render={({ field: { onChange, onBlur, value } }) => (
													<InputFormBitClean
														placeholder="Cep"
														type="text"
														//readOnly={!!dataOrder?.customer?.email}
														onChange={(event) => {
															const inputValue = event.target.value;
															let isValid = true;

															if (inputValue == '') {
																isValid = false;

																const auxInvalidFields = [
																	...invalidFields,
																	'cep',
																];
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
																page: 1,
															});
														}}

														value={cep.valor}
													/>
												)}
											/>
										</div>
									</div>
									<div className={styles.formSearch}>
										<div className={styles.containerInut}>
											<h4>Bairro:</h4>
											<Controller
												control={control}
												name="bairro"
												render={({ field: { onChange, onBlur, value } }) => (
													<InputFormBitClean
														placeholder="Bairro"
														type="text"
														//readOnly={!!dataOrder?.customer?.email}
														onChange={(event) => {
															const inputValue = event.target.value;
															let isValid = true;

															if (inputValue == '') {
																isValid = false;

																const auxInvalidFields = [
																	...invalidFields,
																	'bairro',
																];
																setFieldRedux('invalidFields', auxInvalidFields);

															} else {

																isValid = true;
																const auxInvalidFields = invalidFields.filter(
																	(field: string) => field !== 'bairro'
																);
																setFieldRedux('invalidFields', auxInvalidFields);
															}

															handleValueChange({
																name: 'bairro',
																valor: inputValue,
																isValid: isValid,
																page: 1,
															});
														}}

														value={bairro.valor}
													/>
												)}
											/>
										</div>
										<div className={styles.containerInut}>
											<h4>Rua:</h4>
											<Controller
												control={control}
												name="rua"
												render={({ field: { onChange, onBlur, value } }) => (
													<InputFormBitClean
														placeholder="Rua"
														type="text"
														//readOnly={!!dataOrder?.customer?.email}
														onChange={(event) => {
															const inputValue = event.target.value;
															let isValid = true;

															if (inputValue == '') {
																isValid = false;

																const auxInvalidFields = [
																	...invalidFields,
																	'rua',
																];
																setFieldRedux('invalidFields', auxInvalidFields);

															} else {

																isValid = true;
																const auxInvalidFields = invalidFields.filter(
																	(field: string) => field !== 'rua'
																);
																setFieldRedux('invalidFields', auxInvalidFields);
															}

															handleValueChange({
																name: 'rua',
																valor: inputValue,
																isValid: isValid,
																page: 1,
															});
														}}

														value={rua.valor}
													/>
												)}
											/>
										</div>
										<div className={styles.containerInut}>
											<h4>Número:</h4>
											<Controller
												control={control}
												name="numero"
												render={({ field: { onChange, onBlur, value } }) => (
													<InputFormBitClean
														placeholder="Número"
														type="text"
														//readOnly={!!dataOrder?.customer?.email}
														onChange={(event) => {
															const inputValue = event.target.value;
															let isValid = true;

															if (inputValue == '') {
																isValid = false;

																const auxInvalidFields = [
																	...invalidFields,
																	'numero',
																];
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
																page: 1,
															});
														}}

														value={numero.valor}
													/>
												)}
											/>
										</div>
										<div className={styles.containerInut}>
											<h4>Complemento:</h4>
											<Controller
												control={control}
												name="complemento"
												render={({ field: { onChange, onBlur, value } }) => (
													<InputFormBitClean
														placeholder="Complemento"
														type="text"
														//readOnly={!!dataOrder?.customer?.email}
														onChange={(event) => {
															const inputValue = event.target.value;
															let isValid = true;

															if (inputValue == '') {
																isValid = false;

																const auxInvalidFields = [
																	...invalidFields,
																	'complemento',
																];
																setFieldRedux('invalidFields', auxInvalidFields);

															} else {

																isValid = true;
																const auxInvalidFields = invalidFields.filter(
																	(field: string) => field !== 'complemento'
																);
																setFieldRedux('invalidFields', auxInvalidFields);
															}

															handleValueChange({
																name: 'complemento',
																valor: inputValue,
																isValid: isValid,
																page: 1,
															});
														}}

														value={complemento.valor}
													/>
												)}
											/>
										</div>
									</div>
									<div className={styles.formSearch}>
										<div className={styles.containerInut}>
											<h4>Cidade:</h4>
											<Controller
												control={control}
												name="cidade"
												render={({ field: { onChange, onBlur, value } }) => (
													<InputFormBitClean
														placeholder="Cidade"
														type="text"
														//readOnly={!!dataOrder?.customer?.email}
														onChange={(event) => {
															const inputValue = event.target.value;
															let isValid = true;

															if (inputValue == '') {
																isValid = false;

																const auxInvalidFields = [
																	...invalidFields,
																	'cidade',
																];
																setFieldRedux('invalidFields', auxInvalidFields);

															} else {

																isValid = true;
																const auxInvalidFields = invalidFields.filter(
																	(field: string) => field !== 'cidade'
																);
																setFieldRedux('invalidFields', auxInvalidFields);
															}

															handleValueChange({
																name: 'cidade',
																valor: inputValue,
																isValid: isValid,
																page: 1,
															});
														}}

														value={cidade.valor}
													/>
												)}
											/>
										</div>
										<div className={styles.containerInut}>
											<h4>Estado:</h4>
											<Controller
												control={control}
												name="estado"
												render={({ field: { onChange, onBlur, value } }) => (
													<InputFormBitClean
														placeholder="Estado"
														type="text"
														//readOnly={!!dataOrder?.customer?.email}
														onChange={(event) => {
															const inputValue = event.target.value;
															let isValid = true;

															if (inputValue == '') {
																isValid = false;

																const auxInvalidFields = [
																	...invalidFields,
																	'estado',
																];
																setFieldRedux('invalidFields', auxInvalidFields);

															} else {

																isValid = true;
																const auxInvalidFields = invalidFields.filter(
																	(field: string) => field !== 'estado'
																);
																setFieldRedux('invalidFields', auxInvalidFields);
															}

															handleValueChange({
																name: 'estado',
																valor: inputValue,
																isValid: isValid,
																page: 1,
															});
														}}

														value={estado.valor}
													/>
												)}
											/>
										</div>
										<div className={styles.containerInut}>
											<h4>Perfil:</h4>
											<Controller
												control={control}
												name="selectPerfil"
												render={({ field: { onChange, onBlur, value } }) => (
													<Select
														placeholder="Selecione o status"
														options={dataPerfilJson}
														className="basic-single"
														value={dataPerfilJson.find((c) => c.value === Number(value))}
														onChange={(val: any) => {

															onChange(val.value)
															const inputValue = val.value;
															let isValid = false;
															if (inputValue > 0) {
																isValid = true;
																const auxInvalidFields = [
																	...invalidFields,
																	'selectPerfil',
																];
																setFieldRedux('invalidFields', auxInvalidFields);
															} else {
																isValid = false;
																const auxInvalidFields = invalidFields.filter(
																	(field: string) => field !== 'selectPerfil'
																);
																setFieldRedux('invalidFields', auxInvalidFields);
															}
															handleValueChange({
																name: 'selectPerfil',
																valor: inputValue,
																isValid: isValid,
																page: 1,
															});
														}}
														defaultValue={dataPerfilJson.length > 0 ? { value: dataPerfilJson[0]?.value, label: dataPerfilJson[0]?.label } : null} // Define a primeira opção como padrão
													/>
												)}
											/>
										</div>
									</div>
									<div className={styles.cardButtomSearch}>
										<div className={styles.contentButtom}>
											<Button
												type="submit"
												variant="contained"
												color="warning"
												onClick={() => { handleClose(1) }}
											>
												Fechar
											</Button>
										</div>
										<div className={styles.contentButtom}>
											<Button
												type="submit"
												variant="contained"
												color="success"
											>
												Pesquisar
											</Button>
										</div>
									</div>
								</div>
							</DialogContentText>
						</DialogContent>
					</Dialog>
					<Dialog
						fullWidth={true}
						maxWidth={'lg'}
						open={modalStatusOpen}
						TransitionComponent={Transition}
						keepMounted
						//	onClose={() => { handleClose(2) }}
						aria-describedby="alert-dialog-slide-description"
					>
						<DialogTitle>{"Status da Conta"}</DialogTitle>
						<DialogContent>
							<DialogContentText id="alert-dialog-slide-description">
								<div className={styles.contentDataForm}>
									<div className={styles.formSearch}>
										<div className={styles.containerInut}>
											<h4>Status</h4>
											<Controller
												control={control}
												name="selectStatus"
												render={({ field: { onChange, onBlur, value } }) => (
													<Select
														placeholder="Selecione o status"
														options={dataStatusJson}
														className="basic-single"
														value={dataStatusJson.find((c) => c.value === Number(value))}
														onChange={(val: any) => {

															onChange(val.value)
															const inputValue = val.value;
															let isValid = false;
															if (inputValue > 0) {
																isValid = true;
																const auxInvalidFields = [
																	...invalidFields,
																	'selectStatus',
																];
																setFieldRedux('invalidFields', auxInvalidFields);
															} else {
																isValid = false;
																const auxInvalidFields = invalidFields.filter(
																	(field: string) => field !== 'selectStatus'
																);
																setFieldRedux('invalidFields', auxInvalidFields);
															}
															handleValueChange({
																name: 'selectStatus',
																valor: inputValue,
																isValid: isValid,
																page: 1,
															});
														}}
														defaultValue={dataStatusJson.length > 0 ? { value: dataStatusJson[0]?.value, label: dataStatusJson[0]?.label } : null} // Define a primeira opção como padrão
													/>
												)}
											/>
										</div>
										<div className={styles.containerInut}>
											<h4>Motivo</h4>
											<Controller
												control={control}
												name="selectStatus"
												render={({ field: { onChange, onBlur, value } }) => (
													<Select
														placeholder="Selecione o status"
														options={dataStatusJson}
														className="basic-single"
														value={dataStatusJson.find((c) => c.value === Number(value))}
														onChange={(val: any) => {

															onChange(val.value)
															const inputValue = val.value;
															let isValid = false;
															if (inputValue > 0) {
																isValid = true;
																const auxInvalidFields = [
																	...invalidFields,
																	'selectStatus',
																];
																setFieldRedux('invalidFields', auxInvalidFields);
															} else {
																isValid = false;
																const auxInvalidFields = invalidFields.filter(
																	(field: string) => field !== 'selectStatus'
																);
																setFieldRedux('invalidFields', auxInvalidFields);
															}
															handleValueChange({
																name: 'selectStatus',
																valor: inputValue,
																isValid: isValid,
																page: 1,
															});
														}}
														defaultValue={dataStatusJson.length > 0 ? { value: dataStatusJson[0]?.value, label: dataStatusJson[0]?.label } : null} // Define a primeira opção como padrão
													/>
												)}
											/>
										</div>
									</div>
									<div className={styles.formSearch}>
										<div className={styles.containerInuttextArea}>
											<h4>Descrição</h4>
											<Controller
												control={control}
												name="selectStatus"

												render={({ field: { onChange, onBlur, value } }) => (
													<TextArea
														rows={30}
														cols={10}
														placeholder="Estado"

														//readOnly={!!dataOrder?.customer?.email}
														onChange={(event) => {
															const inputValue = event.target.value;
															let isValid = true;

															if (inputValue == '') {
																isValid = false;

																const auxInvalidFields = [
																	...invalidFields,
																	'estado',
																];
																setFieldRedux('invalidFields', auxInvalidFields);

															} else {

																isValid = true;
																const auxInvalidFields = invalidFields.filter(
																	(field: string) => field !== 'estado'
																);
																setFieldRedux('invalidFields', auxInvalidFields);
															}

															handleValueChange({
																name: 'estado',
																valor: inputValue,
																isValid: isValid,
																page: 1,
															});
														}}

														value={estado.valor}
													/>
												)}
											/>
										</div>
									</div>
									<div className={styles.cardButtomSearch}>
										<div className={styles.contentButtom}>
											<Button
												type="submit"
												variant="contained"
												color="warning"
												onClick={() => { handleClose(2) }}
											>
												Fechar
											</Button>
										</div>
										<div className={styles.contentButtom}>
											<Button
												type="submit"
												variant="contained"
												color="success"
											>
												Pesquisar
											</Button>
										</div>
									</div>
								</div>
							</DialogContentText>
						</DialogContent>
					</Dialog>
					{modalIsOpen ? <Spinner /> : ''}
				</div>
			</ProtectedPage >

		</Container >
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

		selectStatus: getPropSegura(
			state,
			['userRegisterReducer', 'selectStatus'],
			{
				valor: '',
				isValid: false,
				page: 1,
			}
		),

		selectPerfil: getPropSegura(
			state,
			['userRegisterReducer', 'selectPerfil'],
			{
				valor: '',
				isValid: false,
				page: 1,
			}
		),

		cep: getPropSegura(
			state,
			['userRegisterReducer', 'cep'],
			{
				valor: '',
				isValid: false,
				page: 1,
			}
		),
		rua: getPropSegura(
			state,
			['userRegisterReducer', 'rua'],
			{
				valor: '',
				isValid: false,
				page: 1,
			}
		),
		bairro: getPropSegura(
			state,
			['userRegisterReducer', 'bairro'],
			{
				valor: '',
				isValid: false,
				page: 1,
			}
		),
		numero: getPropSegura(
			state,
			['userRegisterReducer', 'numero'],
			{
				valor: '',
				isValid: false,
				page: 1,
			}
		),
		estado: getPropSegura(
			state,
			['userRegisterReducer', 'estado'],
			{
				valor: '',
				isValid: false,
				page: 1,
			}
		),

		cidade: getPropSegura(
			state,
			['userRegisterReducer', 'cidade'],
			{
				valor: '',
				isValid: false,
				page: 1,
			}
		),

		complemento: getPropSegura(
			state,
			['userRegisterReducer', 'complemento'],
			{
				valor: '',
				isValid: false,
				page: 1,
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

export default connect(mapStateToProps, mapDispatchToProps)(dadosPerfil);
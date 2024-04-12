import React, { useState, useContext, useEffect, useCallback } from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import {
	resetUserRegisterData,
	setUserRegisterField,
} from '../../redux/actions/userRegisterActions';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { useMediaQuery } from 'usehooks-ts';
import Container from '../../layout/Container';

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


import {
	validaDataBr,
	pegaDataAtual,
	pegaApenasData,
} from '../../validacoes/DataBr';

import { validaDiaDoMes, pegaHoraMinuto } from '../../utils/GetDate';

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
	selectLogista: number;
	selectStatus: number;
	selectPerfil: number;

};

const dataTesteJson = [
	{
		id: 1,
		nome: 'Wagner',
		numeroConta: '002152',
		perfil: 1,
		status: 'Ativo',
	},
	{
		id: 2,
		nome: 'Thiago',
		numeroConta: '0025685',
		perfil: 1,
		status: 'Ativo',
	},
	{
		id: 3,
		nome: 'Eduardo',
		numeroConta: '00145258',
		perfil: 1,
		status: 'Ativo',
	},
	{
		id: 4,
		nome: 'Adriano',
		numeroConta: '20112',
		perfil: 1,
		status: 'Ativo',
	},
	{
		id: 5,
		nome: 'Daniel',
		numeroConta: '88542',
		perfil: 1,
		status: 'Ativo',
	}
]

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

const actions = [
	{
		id: 1,
		nameAction: 'Configura perfil',
		nameRoute: '/configPerfil',

	},
	{
		id: 2,
		nameAction: 'Dados perfil',
		nameRoute: '/dadosPerfil',
	}

]

const Usuarios = (props: any) => {
	const user = useSelector((state: any) => state.userReducer.user);
	const saldo = useSelector((state: any) => state.saldoReducer.saldo);
	const isMobile = useMediaQuery('(max-width: 600px)');
	const [openAlert, setOpenAlert] = useState(false);
	const [nPagina, setNpagina] = useState(1);
	const [menssageAlert, setMenssageAlert] = useState('');
	const [typeAlert, setTypeAlert] = useState<AlertColor>('success');
	const [modalIsOpen, setIsOpen] = useState(false);


	// init state pages
	const [actualPage, setActualPage] = useState(1);
	const [totalRegistro, setTotalRegistro] = useState(0);
	const [pageSize, setPageSize] = useState(0);
	const [pagePagination, setPagePagination] = useState(1);
	const [perPage, setPerPage] = useState(50);
	const [nextPage, setNextPage] = useState(1);
	const [backNextPage, setBackPage] = useState(0);

	const [buttomIn, setButtomIn] = useState(false);
	const [buttomOut, setButtomOut] = useState(false);
	const [buttomAll, setBtttomAll] = useState(false);
	const [buttomClean, setButtomClean] = useState(false);
	const limitPage = 10;
	const {
		allFields,
		selectLogista,
		selectStatus,
		selectPerfil,
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

	const verifyFieldsByPage = (page: number) => {
		const invalidFieldsByPage = invalidFields.filter(
			(field: string) => allFields[field]?.page === page
		);
		let isValid = true;

		if (page === 1) {

			if (!selectLogista.isValid) {
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


	const handleTransactionEc = async () => {

	}


	useEffect(() => {

		if (pagePagination == pageSize) {
			setPagePagination(0)
		} else {
			setPagePagination(nextPage);
		}
		handleTransactionEc()
	}, [actualPage])

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

								<div className={styles.containerInut}>
									<h3>Clientes</h3>
									<Controller
										control={control}
										name="selectLogista"
										render={({ field: { onChange, onBlur, value } }) => (
											<Select
												placeholder="Selecione o cliente"
												options={dataLogistaJson}
												className="basic-single"
												value={dataLogistaJson.find((c) => c.value === Number(value))}
												onChange={(val: any) => {
													console.log('dados do select', selectLogista)
													onChange(val.value)
													const inputValue = val.value;
													let isValid = false;
													if (inputValue > 0) {
														isValid = true;
														const auxInvalidFields = [
															...invalidFields,
															'parcelaCartao',
														];
														setFieldRedux('invalidFields', auxInvalidFields);
													} else {
														isValid = false;
														const auxInvalidFields = invalidFields.filter(
															(field: string) => field !== 'parcelaCartao'
														);
														setFieldRedux('invalidFields', auxInvalidFields);
													}
													handleValueChange({
														name: 'parcelaCartao',
														valor: inputValue,
														isValid: isValid,
														page: 1,
													});
												}}
												defaultValue={dataLogistaJson.length > 0 ? { value: dataLogistaJson[0]?.value, label: dataLogistaJson[0]?.label } : null} // Define a primeira opção como padrão
											/>
										)}
									/>
								</div>
								<div className={styles.containerInut}>
									<h3>Perfil</h3>
									<Controller
										control={control}
										name="selectPerfil"
										render={({ field: { onChange, onBlur, value } }) => (
											<Select
												placeholder="Selecione o perfil"
												options={dataPerfilJson}
												className="basic-single"
												value={dataPerfilJson.find((c) => c.value === Number(value))}
												onChange={(val: any) => {
													console.log('dados do select', selectLogista)
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
								<div className={styles.containerInut}>
									<h3>Status</h3>
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
													console.log('dados do select', selectLogista)
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
							<div className={styles.cardButtomSearch}>
								<div className={styles.contentButtom}>
									<Button
										type="submit"
										variant="contained"
										color="warning"
									>
										limpar
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



						<div className={styles.titleContainer}>
							<Extrato size={23} color="#000" />
							<h4>Lista de Clientes</h4>
						</div>
						<div className={styles.dadosExtrato1}>
							<div className={styles.exporExcel}>
								<ExportToExcel excelData={dataTesteJson} fileName={"Export"} />
							</div>
							{isMobile == false ? (
								<Paper sx={{ width: '100%', overflow: 'auto' }}>
									<TableContainer>
										<Table sx={{ minWidth: 650 }} aria-label="caption table">
											<caption>
												<footer className={styles.paginationContainer}>
													<Stack direction="row" alignItems="center" spacing={2}>
														<div>
															<h4>
																{totalRegistro <= perPage ? totalRegistro : perPage} de {totalRegistro}, página {actualPage} de {pageSize}
															</h4>
														</div>
														<Hidden smDown>
															<div className={styles.containerLinkPagination}>
																<Pagination
																	limit={perPage}
																	total={totalRegistro}
																	offset={actualPage}
																	nextPage={nextPage}
																	backNextPage={backNextPage}
																	totalOfPage={perPage}
																	setOffset={setActualPage}
																/>
															</div>
														</Hidden>
													</Stack>
												</footer>
											</caption>
											<TableHead>
												<TableRow>
													<TableCell align="left" style={{ fontWeight: 'bold' }}>ID USUARIO</TableCell>
													<TableCell align="left" style={{ fontWeight: 'bold' }}>NOME</TableCell>
													<TableCell align="left" style={{ fontWeight: 'bold' }}>CONTA</TableCell>
													<TableCell align="left" style={{ fontWeight: 'bold' }}>PERFIL</TableCell>
													<TableCell align="left" style={{ fontWeight: 'bold' }}>STATUS</TableCell>
													<TableCell align="right" style={{ fontWeight: 'bold' }}>AÇÕES</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{dataTesteJson.map((row) => (
													<TableRow key={row.id} className={styles.linhaTabela}>
														<TableCell component="th">{row.id}</TableCell>
														<TableCell align="left">{row.nome}</TableCell>
														<TableCell align="left">{row.numeroConta}</TableCell>
														<TableCell align="left">{row.perfil}</TableCell>
														<TableCell align="left">{row.status}</TableCell>
														<TableCell align="right">
															<ButtonOptions
																dataButton={actions}
																titleButton='Açoes'
															/>
															{/*
															<Button type="submit" variant="contained" color="warning">
																Visualizar
															</Button>
												*/}

														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
										<Hidden mdUp>
											<div className={styles.containerLinkPagination}>
												<Pagination
													limit={perPage}
													total={totalRegistro}
													offset={actualPage}
													nextPage={nextPage}
													backNextPage={backNextPage}
													totalOfPage={perPage}
													setOffset={setActualPage}
												/>
											</div>
										</Hidden>
									</TableContainer>
								</Paper>
							) : (
								<Paper sx={{ width: '100%', overflow: 'auto' }}>
									<Stack spacing={2} p={2}>
										{dataTesteJson.map((row) => (
											<div key={row.id} className={styles.linhaTabela}>
												<div className={styles.itemContainer}>
													<Typography variant="subtitle1">
														<span className={styles.label}>ID USUÁRIO:</span> {row.id}
													</Typography>
												</div>
												<div className={styles.itemContainer}>
													<Typography variant="subtitle1" >
														<span className={styles.label}>NOME:</span>{row.nome}
													</Typography>
												</div>
												<div className={styles.itemContainer}>
													<Typography variant="subtitle1" >
														<span className={styles.label}>CONTA:</span>{row.numeroConta}
													</Typography>
												</div>
												<div className={styles.itemContainer}>
													<Typography variant="subtitle1">
														<span className={styles.label}>PERFIL:</span> {row.perfil}
													</Typography>
												</div>
												<div className={styles.itemContainer}>
													<Typography variant="subtitle1">
														<span className={styles.label}>STATUS:</span> {row.status}
													</Typography>
												</div>
												<div className={styles.itemContainer}>
													<Button variant="contained" color="warning">
														Visualizar
													</Button>
												</div>
											</div>
										))}
										<Hidden mdUp>
											<div style={{ textAlign: 'center' }}>
												<Pagination
													limit={perPage}
													total={totalRegistro}
													offset={actualPage}
													nextPage={nextPage}
													backNextPage={backNextPage}
													totalOfPage={perPage}
													setOffset={setActualPage}
												/>
											</div>
										</Hidden>
									</Stack>
								</Paper>
							)}


						</div>

					</div>

					{modalIsOpen ? <Spinner /> : ''}
				</div>
			</ProtectedPage>

		</Container>
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

		selectLogista: getPropSegura(
			state,
			['userRegisterReducer', 'selectLogista'],
			{
				valor: '',
				isValid: false,
				page: 1,
			}
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

export default connect(mapStateToProps, mapDispatchToProps)(Usuarios);
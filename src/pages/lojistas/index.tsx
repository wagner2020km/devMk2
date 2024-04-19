import React, { useState, useContext, useEffect, useCallback } from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import {
	resetUserRegisterData,
	setUserRegisterField,
} from '../../redux/actions/userRegisterActions';
import AlertSnack from '../../components/AlertSnack/AlertSnack'
import { getContasGraficas, getContasGraficasFull } from '../../api/contasGraficas';
import Router from 'next/router';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { useMediaQuery } from 'usehooks-ts';
import Container from '../../layout/Container';
import { Minicards } from '../../components/MiniCads/MiniCards';
import ExportToExcel from '../../components/ExportToExcel/ExportToExcel'
import { Spinner } from '../../components/Spinner/Spinner';
import Select from 'react-select';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { getExtratos } from '../../api/extrato';
import { InputFormBitClean } from '../../components/ui/InputFormBit';
import ProtectedPage from '../../components/ProtectedPage/ProtectedPage'
import styles from './styles.module.scss';
import { encryptID } from '../../utils/encryptId';
import Extrato from '../../lib/bibliotecaBit/icons/Extrato';
import { moneyMask } from '../../utils/cpfMask';
import Pagination from '../../components/Pagination/Pagination';
import { getSaldo } from '../../api/carteira';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import getPropSegura from '../../utils/getPropSegura';
import TrendingUp from '@mui/icons-material/TrendingUp';
import TrendingDown from '@mui/icons-material/TrendingDown';
import { styled } from '@mui/material/styles';
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

interface ListAccountProps {
	ContaCorrente: string;
	agencia: number;
	nome_completo: string;
	nome?: string;
	sigla: string;
	tipo_transacao: string;
	valor: number;
}

type dadosInputGFormProps = {
	selectLogista: number;

};

type dadosSelectAccount = {
	value: number;
	label: string;

};
const dataTesteJson = [
	{
		id: 1,
		logista: 'Wagner',
		saldo: 150000,
	},
	{
		id: 2,
		logista: 'Thiago',
		saldo: 6000000,
	},
	{
		id: 3,
		logista: 'Eduardo',
		saldo: 3500000,
	},
	{
		id: 4,
		logista: 'Adriano',
		saldo: 200000,
	},
	{
		id: 5,
		logista: 'Daniel',
		saldo: 350000,
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
const Lojista = (props: any) => {
	const dispatch = useDispatch();
	const user = useSelector((state: any) => state.userReducer.user);
	const saldo = useSelector((state: any) => state.saldoReducer.saldo);
	const isMobile = useMediaQuery('(max-width: 600px)');
	const [openAlert, setOpenAlert] = useState(false);
	const [recebeStadoSaldo, setRecebeStadoSaldo] = useState(saldo ?? 0);
	const [habilitaSaldo, setHabilitaSaldo] = useState(false);
	const [listaContas, setListaContas] = useState([])
	const [dataListAccountSearch, setDataListAccountSearch] = useState<dadosSelectAccount[]>([])
	const [nPagina, setNpagina] = useState(1);
	const [menssageAlert, setMenssageAlert] = useState('');
	const [typeAlert, setTypeAlert] = useState<AlertColor>('success');
	const [blockCard, setBloqueCard] = useState(false);
	const [modalIsOpen, setIsOpen] = useState(false);


	// init state pages
	const [actualPage, setActualPage] = useState(1);
	const [totalRegistro, setTotalRegistro] = useState(0);
	const [pageSize, setPageSize] = useState(0);
	const [pagePagination, setPagePagination] = useState(1);
	const [perPage, setPerPage] = useState(5);
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

	async function listAccountGrafic() {
		console.log('dados ',selectLogista)
		setIsOpen(true);
		try {
			const response = await getContasGraficas(actualPage, perPage, '', selectLogista.valor);

			if (response?.status === 200) {

				console.log('CONTAS GRAFICAS', response?.data)
				setPagePagination(response?.data?.currentPage)
				setPageSize(response?.data?.totalPages);
				setPerPage(response?.data?.perpage);
				setTotalRegistro(response?.data?.total);
				setNextPage(response?.data?.nextPageNumber);
				setBackPage(response?.data?.prevPageNumber);
				setListaContas(response?.data?.data);
				setIsOpen(false);
			} else {
				if (response?.data?.message) {

				}

			}

		} catch (error) {
			setIsOpen(false);
			console.log(error);
		}
	}

	async function listAllAccountGrafic() {
		setIsOpen(true);
		try {
			const response = await getContasGraficasFull();

			if (response?.status === 200) {

				console.log('FULL', response?.data?.data)
				const newDataLst: dadosSelectAccount[] = [];
				for (let i = 1; i <= response?.data?.data.length; i++) {
					//console.log('contador aqui', i);
					const newData: dadosSelectAccount = {
						value: response?.data?.data[i]?.ContaCorrente,
						label: response?.data?.data[i]?.nome.toUpperCase()
					};

					newDataLst.push(newData);
				}
				setDataListAccountSearch(newDataLst)

			} else {
				if (response?.data?.message) {

				}

			}

		} catch (error) {
			setIsOpen(false);
			console.log(error);
		}
	}


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
		console.log('valor lojista', selectLogista.isValid)
		if (page === 1) {

			if (!selectLogista.isValid) {
				isValid = false;
				handleClick('Selecione o logista', 'error');
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
				listAccountGrafic();
			}
		}
	};


	const handleCleanFormAccount = async () => {
		try {
			// Aguarde a conclusão da ação de resetar os dados do registro do usuário
			//await dispatch(resetUserRegisterData());
			handleValueChange({
				name: 'selectLogista',
				valor: '',
				isValid: false,
				page: 1,
			});
			// Depois que os dados forem resetados, chame a função listAccountGrafic
			listAccountGrafic();
		  } catch (error) {
			console.error('Erro ao limpar dados do usuário:', error);
		  }
	}


	useEffect(() => {

		if (pagePagination == pageSize) {
			setPagePagination(0)
		} else {
			setPagePagination(nextPage);
		}
		listAllAccountGrafic();
		listAccountGrafic()
	}, [actualPage])

	useEffect(() => {
	//	listAccountGrafic()
	//	listAllAccountGrafic();
	}, [])

	//useEffect(() => {

		//dispatch(resetUserRegisterData());
	//}, [dispatch]);

	return (
		<Container>
			<ProtectedPage
				errorMessage={'Acesso negado para o serviço'}
				errorType={'error'}
				page={'logista'}
				enableError={user?.perfilid != 3 ? true : false}
			>
				<div className={styles.containerGeral}>
					<div className={styles.cardForm}>
						<div className={styles.contentDataForm}>
							<div className={styles.formSearch}>

								<div className={styles.containerInut}>
									<h3>Lojistas</h3>
									<Controller
										control={control}
										name="selectLogista"
										render={({ field: { onChange, onBlur, value } }) => (
											<Select
												placeholder="Selecione a Filial"
												options={dataListAccountSearch}
												className="basic-single"
												value={dataListAccountSearch.find((c) => c.value === Number(value))}
												onChange={(val: any) => {
													console.log('dados do select', selectLogista)
													onChange(val.value)
													const inputValue = val.value;
													console.log('dados do select', inputValue)
													let isValid = false;
													if (inputValue > 0) {
														isValid = true;
														const auxInvalidFields = [
															...invalidFields,
															'selectLogista',
														];
														setFieldRedux('invalidFields', auxInvalidFields);
													} else {
														isValid = false;
														const auxInvalidFields = invalidFields.filter(
															(field: string) => field !== 'selectLogista'
														);
														setFieldRedux('invalidFields', auxInvalidFields);
													}
													handleValueChange({
														name: 'selectLogista',
														valor: inputValue,
														isValid: isValid,
														page: 1,
													});
												}}
											//defaultValue={} // Define a primeira opção como padrão
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
										onClick={() =>{handleCleanFormAccount()}}
									>
										limpar
									</Button>
								</div>
								<div className={styles.contentButtom}>
									<Button
										type="submit"
										variant="contained"
										color="success"
										onClick={() => { handleNextPage() }}
									>
										Pesquisar
									</Button>
								</div>


							</div>
						</div>



						<div className={styles.titleContainer}>
							<Extrato size={23} color="#000" />
							<h4>Lista de logistas</h4>
						</div>
						<div className={styles.dadosExtrato1}>
							<div className={styles.exporExcel}>
								<ExportToExcel excelData={listaContas} fileName={"Export"} />
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
													<TableCell align="left" style={{ fontWeight: 'bold' }}>ID LOGISTA</TableCell>
													<TableCell align="left" style={{ fontWeight: 'bold' }}>CONTA</TableCell>
													<TableCell align="left" style={{ fontWeight: 'bold' }}>NOME</TableCell>
													<TableCell align="left" style={{ fontWeight: 'bold' }}>TIPO</TableCell>
													<TableCell align="left" style={{ fontWeight: 'bold' }}>SALDO</TableCell>
													<TableCell align="right" style={{ fontWeight: 'bold' }}>AÇÕES</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{listaContas.map((row) => (
													<TableRow key={row.cliente_id} className={styles.linhaTabela}>
														<TableCell component="th">{row.cliente_id}</TableCell>
														<TableCell component="th">{row.conta_corrente}</TableCell>
														<TableCell align="left">{row.nome_completo ? row.nome.toUpperCase() : row.nome}</TableCell>
														<TableCell align="left">{row.tipo_conta ? row.tipo_conta.toUpperCase() : row.tipo_conta}</TableCell>
														<TableCell align="left">{moneyMask(String(500.00))}</TableCell>
														<TableCell align="right">
															<Button
																variant="contained"
																color="warning"
																onClick={() => {
																	setIsOpen(true)
																	Router.push({
																		pathname: '/transferencia',
																		query: { acountCode: encryptID(row.ContaCorrente) }
																	});
																}}
															>
																Visualizar
															</Button>
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
										{listaContas.map((row) => (
											<div key={row.cliente_id} className={styles.linhaTabela}>
												<div className={styles.itemContainer}>
													<Typography variant="subtitle1">
														<span className={styles.label}>ID LOGISTA:</span> {row.cliente_id}
													</Typography>
												</div>
												<div className={styles.itemContainer}>
													<Typography variant="subtitle1" >
														<span className={styles.label}>CONTA:</span>{row.conta_corrente}
													</Typography>
												</div>
												<div className={styles.itemContainer}>
													<Typography variant="subtitle1" >
														<span className={styles.label}>NOME:</span>{row.nome ? row.nome.toUpperCase() : row.nome}
													</Typography>
												</div>
												<div className={styles.itemContainer}>
													<Typography variant="subtitle1" >
														<span className={styles.label}>TIPO:</span>{row.tipo_conta}
													</Typography>
												</div>
												<div className={styles.itemContainer}>
													<Typography variant="subtitle1">
														<span className={styles.label}>SALDO:</span> {moneyMask(String(500))}
													</Typography>
												</div>
												<div className={styles.itemContainer}>
													<Button
														variant="contained"
														color="warning"
														onClick={() => {
															Router.push({
																pathname: '/transferencia',
																query: { acountCode: encryptID(row.conta_corrente) }
															});
														}}
													>
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
			</ProtectedPage>

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

		selectLogista: getPropSegura(
			state,
			['userRegisterReducer', 'selectLogista'],
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

export default connect(mapStateToProps, mapDispatchToProps)(Lojista);
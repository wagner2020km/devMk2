import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

import Link from 'next/link';

import Container from '../../layout/Container';
import { Minicards } from '../../components/MiniCads/MiniCards';
import { Spinner } from '../../components/Spinner/Spinner';

import { canSSRAuth } from '../../utils/canSSRAuth';
import { getExtratos } from '../../api/extrato';

import styles from './styles.module.scss';
import { Buttom } from '../../components/ui/Buttom';
import IconTRansfer from '../../components/IconesBith/IconTRansfer';
import IconPix from '../../components/IconesBith/IconPix';
import IconContas from '../../components/IconesBith/IconContas';
import CartoesIcon from '../../lib/bibliotecaBit/icons/CartoesIcon';
import Extrato from '../../lib/bibliotecaBit/icons/Extrato';
import Pix from '../../lib/bibliotecaBit/icons/Pix';
import Entrada from '../../lib/bibliotecaBit/icons/Entrada';
import Saida from '../../lib/bibliotecaBit/icons/Saida';
import SetaExtrato from '../../lib/bibliotecaBit/icons/SetaExtrato';
import { InputFormBit } from '../../components/ui/InputFormBit';
import BotaoOpcoesExtrato from '../../components/ui/BotaoOpcoesExtrato';
import IconsBith from '../../lib/IconsBith/';
import { numeroParaReal } from '../../utils/maks';
import Pagination from '../../components/Pagination/Pagination';
import { getSaldo } from '../../api/carteira';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import TrendingUp from '@mui/icons-material/TrendingUp';
import TrendingDown from '@mui/icons-material/TrendingDown';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


import {
	validaDataBr,
	pegaDataAtual,
	pegaApenasData,
} from '../../validacoes/DataBr';

import {validaDiaDoMes, pegaHoraMinuto} from '../../utils/GetDate';

interface ListExtratoProps {
	id: number;
	agencia: number;
	conta_corrente: string;
	nome?: string;
	sigla: string;
	tipo_transacao: string;
	valor: number;
}

export default function Saldo() {
	const user = useSelector((state: any) => state.userReducer.user);
	const saldo = useSelector((state: any) => state.saldoReducer.saldo);

	const [recebeStadoSaldo, setRecebeStadoSaldo] = useState(saldo ?? 0);
	const [habilitaSaldo, setHabilitaSaldo] = useState(false);
	const [blockCard, setBloqueCard] = useState(false);
	const [modalIsOpen, setIsOpen] = useState(false);
	const [selected, setSelected] = useState<Date>();
	const [inputDateTextStart, setInputDateTextStart] = useState('');
	const [inputDateTextEnd, setInputDateTextEnd] = useState('');
	const [listKeyExtrato, setListKeyExtrato] = useState([]);
	const [perPage, setPerPage] = useState(2);
	const [totalDataFull, setTotalDataFull] = useState(0);
	const [quantytiPage, setQuantytiPage] = useState(0);
	const [actualPage, setActualPage] = useState(1);
	const [nextPage, setNextPage] = useState(0);
	const [backNextPage, setBackNextPage] = useState(0);
	const [showDataItensPage, setShowDataItensPage] = useState(0);
	const [typeSearch, setTypeSearch] = useState('');

	const [buttomIn, setButtomIn] = useState(false);
	const [buttomOut, setButtomOut] = useState(false);
	const [buttomAll, setBtttomAll] = useState(false);
	const [buttomClean, setButtomClean] = useState(false);

	const initialDays: Date[] = [];
	const [days, setDays] = useState<Date[] | undefined>(initialDays);
	const date = new Date();
	//console.log('Data atual',format(date, 'dd/MM/yyyy'))
	const limitPage = 10;
	let dataCompara = '';

	let footer = <p>Selecione o período.</p>;
	if (days && days.length > 0) {
		if (days[0]) {
			footer = <p>{format(days[0], 'dd/MM/yyyy')}</p>;
			footer = <p>De {format(days[0], 'dd/MM/yyyy')} á.</p>;
		}
		if (days[1]) {
			footer = <p>{format(days[1], 'dd/MM/yyyy')}</p>;
			footer = (
				<p>
					De {format(days[0], 'dd/MM/yyyy')} á {format(days[1], 'dd/MM/yyyy')}.
				</p>
			);
			if (days[0] > days[1]) {
				setDays([]);
				setInputDateTextStart('');
				setInputDateTextEnd('');
			}
		}
	}

	async function getSaldoApi() {
		try {
			const response = await getSaldo();
			if (response.status === 200 && response?.data?.data?.total) {
				setRecebeStadoSaldo(response.data.data.total);
			}
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		getSaldoApi();
	}, []);

	useEffect(() => {
		let dateFormatText = '';
		if (days != null) {
			if (days[0]) {
				dateFormatText = format(days[0], 'yyyy-MM-dd');
				console.log(dateFormatText);
				setInputDateTextStart(dateFormatText);
			}
			if (days[1]) {
				dateFormatText = format(days[1], 'yyyy-MM-dd');
				console.log(dateFormatText);
				setInputDateTextEnd(dateFormatText);
			}
		}
	}, [days]);

	useEffect(() => {
		switch (typeSearch) {
			case 'limpar':
				setDays([]);
				setInputDateTextStart('');
				setInputDateTextEnd('');
				setTypeSearch('');
				setActualPage(1);

				setInputDateTextStart('');
				setInputDateTextEnd('');
				setTypeSearch('');
				setBtttomAll(false);
				setButtomOut(false);
				setButtomIn(false);
				setButtomClean(true);

				break;

			case 'cashout':
				setBtttomAll(false);
				setButtomOut(true);
				setButtomIn(false);
				setButtomClean(false);

				break;

			case 'cashin':
				setBtttomAll(false);
				setButtomOut(false);
				setButtomIn(true);
				setButtomClean(false);
				break;

			case 'todos':
				setBtttomAll(true);
				setButtomOut(false);
				setButtomIn(false);
				setButtomClean(false);
				break;

			default:
				break;
		}
		//console.log('type search',typeSearch)

		const handleGetExtrato = async () => {
			setIsOpen(true);
			try {
				const response = await getExtratos(
					user.numeroConta,
					typeSearch,
					limitPage,
					actualPage,
					inputDateTextStart,
					inputDateTextEnd
				);
				console.log('response', response);
				console.log('dados da transação', response);
				let keys = response?.data?.data ?? [];
				const getPerPage = response?.data.perpage ?? 0;
				const getTotalPage = response?.data.totalPages ?? 0;
				const getTotalData = response?.data.total ?? 0;
				const actualPageNow = response?.data.currentPage ?? 0;
				const getnextPage = response?.data.nextPageNumber ?? 0;
				const getbackNextPage = response?.data.prevPageNumber ?? 0;
				const getShowCountDataPagePage = response?.data.count ?? 0;
				//	console.log('response Lista', keys);
				//	console.log('pagina é', actualPageNow)
				//	console.log('pagina é State', actualPage)
				setPerPage(getPerPage);
				setTotalDataFull(getTotalData);
				setQuantytiPage(getTotalPage);
				setNextPage(getnextPage);
				setBackNextPage(getbackNextPage);
				setListKeyExtrato(keys);
				setShowDataItensPage(getShowCountDataPagePage);
			} catch (error) {
				console.log(error);
			} finally {
				setIsOpen(false);
			}
		};
		console.log('estado botão agora', buttomOut);
		handleGetExtrato();
	}, [actualPage, typeSearch]);

	useEffect(() => {
		console.log('estado botão agora', buttomOut);
	}, [buttomOut]);
	return (
		<Container>
			<div className={styles.containerAcessoSaldo}>
				<div>
					<div className={styles.titleContainer}>
						<CartoesIcon size={23} color="#000" />
						<h3>Saldo</h3>
					</div>
					<div className={styles.cardDataPicke}>
						<h4></h4>
						<DayPicker
							locale={ptBR}
							mode="multiple"
							min={1}
							max={2}
							selected={days}
							onSelect={setDays}
							footer={footer}
						/>
					</div>
				</div>
				<div className={styles.cardRigth}>
					<h3></h3>
					<div>
						<div className={styles.agrupaDados}>
							<div className={styles.dadosDaConta}>
								<p>

									<span className={styles.textoGeral}>Saldo do dia: </span>
									<span className={styles.textoGeralBold}>
										{pegaDataAtual()}
									</span>
								</p>
								<p>

									<span className={styles.textoGeral}>Conta: </span>
									<span className={styles.textoGeralBold}>{user?.numeroConta}</span>
								</p>
								<p>

									<span className={styles.textoValorSaldo}>
										{numeroParaReal(recebeStadoSaldo)}
									</span>
									<span></span>
								</p>
							</div>

							<div >
								<form className={styles.formSearchExtrato}>
									<section className={styles.containerForm}>
										<div className={styles.containerInputDate}>
											<div className={styles.inputForm}>
												<InputFormBit
													type="date"
													onChange={(e) => { setInputDateTextStart(e.target.value) }}
													value={inputDateTextStart}
												/>
											</div>
											<div className={styles.inputForm}>
												<InputFormBit
													type="date"
													onChange={(e) => { setInputDateTextEnd(e.target.value) }}
													value={inputDateTextEnd}
												/>
											</div>
										</div>
										<div className={styles.containerButtonFormSearch}>
											<div className={styles.inputForm}>
												<BotaoOpcoesExtrato
													onClick={() => {
														setTypeSearch('cashout');
													}}
													typeIcon={'ArrowCircleDown'}
													textButtom="Saida"
													stateButtom={buttomOut}
												/>
											</div>
											<div className={styles.inputForm}>
												<BotaoOpcoesExtrato
													onClick={() => {
														setTypeSearch('cashin');
													}}
													typeIcon={'ArrowCircleUp'}
													textButtom="Entrada"
													stateButtom={buttomIn}
												/>
											</div>
											<div className={styles.inputForm}>
												<BotaoOpcoesExtrato
													onClick={() => {
														setTypeSearch('todos');
													}}
													typeIcon={'Expand'}
													textButtom="Todos"
													stateButtom={buttomAll}
												/>
											</div>
											<div className={styles.inputForm}>
												<BotaoOpcoesExtrato
													onClick={() => {
														setTypeSearch('limpar');
													}}
													typeIcon={'CleaningServices'}
													textButtom="Limpar"
													stateButtom={buttomClean}
												/>
											</div>
										</div>

									</section>
								</form>
							</div>
						</div>
					</div>
					<div className={styles.titleContainer}>
						<Extrato size={23} color="#000" />
						<h3>Extrato</h3>
					</div>
					<div className={styles.dadosExtrato1}>


						<Paper sx={{ width: '100%', overflow: 'hidden' }}>
							<TableContainer component={Paper}>
								<Table sx={{ minWidth: 650 }} aria-label="caption table">
									<caption>
										<footer className={styles.paginationContainer}>
											<div className={styles.containerDetailsPagination}>
												<div>
													<h4>
														{showDataItensPage} de {totalDataFull}, pagina {actualPage} de {quantytiPage}
													</h4>
												</div>
											</div>
											<div className={styles.containerLinkPagination}>
												<Pagination
													limit={limitPage}
													total={totalDataFull}
													offset={actualPage}
													nextPage={nextPage}
													backNextPage={backNextPage}
													totalOfPage={perPage}
													setOffset={setActualPage}
												/>
											</div>
										</footer>
									</caption>
									<TableHead>
										<TableRow>
											<TableCell align="left">Tipo</TableCell>
											<TableCell align="left">Nome</TableCell>
											<TableCell align="left">Valor</TableCell>
											<TableCell align="left">Detalhes</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{listKeyExtrato.map((row: any) => {
											if (pegaApenasData(row.data) != dataCompara) {
												dataCompara = pegaApenasData(row.data);

												return (
													<>
														<h5 className={styles.labelDataTransaction}>{validaDiaDoMes(row.data)} </h5>
														<TableRow key={row.id}>
															<TableCell component="th" >
																<div className={styles.valorExtrato}>
																	<div className={styles.conteinerTextIcon}>

																		{row.metodo == 'INTERNAL_TRANSFER' && (
																			<>
																				<div className={styles.cardDataIcon}>
																					<h5>Trans. interna {pegaHoraMinuto(row.data)}</h5>
																				</div>
																				<div className={styles.cardDataIcon}>
																					<IconTRansfer
																						height={32}
																						width={32}
																						primaryColor={'#14a69d'}
																						secondaryColor={'#14a69d'}
																					/>
																				</div>
																			</>




																		)}
																		{row.metodo == 'BILL_PAYMENTS' && (
																			<>
																			<div className={styles.cardDataIcon}>
																				<h5>Pg. Conta</h5>
																			</div>
																			<div className={styles.cardDataIcon}>
																				<IconContas
																					height={48}
																					width={48}
																					primaryColor={'#14a69d'}
																					secondaryColor={'#14a69d'}
																				/>
																			</div>
																		</>

																		)}
																		{row.metodo == 'PIX' && (
																			<>
																			<div className={styles.cardDataIcon}>
																				<h5>Pix</h5>
																			</div>
																			<div className={styles.cardDataIcon}>
																			<Pix size={32} color="#14a69d" />
																				
																			</div>
																		</>

																		)}

																		{row.tipo_transacao == 'CREDIT' ? <TrendingUp color='success' /> : <TrendingDown color='error' />}

																		<div className={styles.cardDataIcon}>
																		
																			{row?.status?.nome == 'Transação Aprovado' &&(
																				<h5 className={styles.textSuccess}>{row?.status?.nome.toUpperCase()}</h5>
																			)}
																			{row?.status?.nome == 'Pagamento Pendente' &&(
																				<h5 className={styles.textWarning}>{row?.status?.nome.toUpperCase()}</h5>
																			)}
																				{row?.status?.nome == 'Transação Não Aprovada' &&(
																				<h5 className={styles.textDanger}>{row?.status?.nome.toUpperCase()}</h5>
																			)}
																		</div>
																	</div>
																</div>
															</TableCell>
															<TableCell align="left">{row.nome}</TableCell>
															<TableCell align="left">{numeroParaReal(row.valor)}</TableCell>
															<TableCell align="left">
																{/*
															<Buttom type="submit" onClick={() => { }} loading={false}>
																Consultar
															</Buttom>
															*/}
															</TableCell>
														</TableRow>
													</>
												);
											} else {
												return (

													<TableRow key={row.id}>
														<TableCell component="th" >
															<div className={styles.valorExtrato}>
															<div className={styles.conteinerTextIcon}>
														
																		{row.metodo == 'INTERNAL_TRANSFER' && (
																			<>
																				<div className={styles.cardDataIcon}>
																					<h5>Trans. interna</h5>
																				</div>
																				<div className={styles.cardDataIcon}>
																					<IconTRansfer
																						height={32}
																						width={32}
																						primaryColor={'#14a69d'}
																						secondaryColor={'#14a69d'}
																					/>
																				</div>
																			</>




																		)}
																		{row.metodo == 'BILL_PAYMENTS' && (
																			<>
																			<div className={styles.cardDataIcon}>
																				<h5>Pg. Conta</h5>
																			</div>
																			<div className={styles.cardDataIcon}>
																				<IconContas
																					height={48}
																					width={48}
																					primaryColor={'#14a69d'}
																					secondaryColor={'#14a69d'}
																				/>
																			</div>
																		</>

																		)}
																		{row.metodo == 'PIX' && (
																			<>
																			<div className={styles.cardDataIcon}>
																				<h5>Pix</h5>
																			</div>
																			<div className={styles.cardDataIcon}>
																			<Pix size={32} color="#14a69d" />
																			</div>
																		</>

																		)}

																		{row.tipo_transacao == 'CREDIT' ? <TrendingUp color='success' /> : <TrendingDown color='error' />}

																		<div className={styles.cardDataIcon}>
																		{row.status.nome == 'Transação Aprovado' &&(
																				<h5 className={styles.textSuccess}>{row?.status?.nome.toUpperCase()}</h5>
																			)}
																			{row.status.nome == 'Pagamento Pendente' &&(
																				<h5 className={styles.textWarning}>{row?.status?.nome.toUpperCase()}</h5>
																			)}
																				{row.status.nome == 'Transação Não Aprovada' &&(
																				<h5 className={styles.textDanger}>{row?.status?.nome.toUpperCase()}</h5>
																			)}
																		</div>
																	</div>
															</div>
														</TableCell>
														<TableCell align="left">{row.nome}</TableCell>
														<TableCell align="left">{numeroParaReal(row.valor)}</TableCell>
														<TableCell align="left">
															{/*
															<Buttom type="submit" onClick={() => { }} loading={false}>
																Consultar
															</Buttom>
															*/}

														</TableCell>
													</TableRow>


												);
											}
										})}
									</TableBody>
								</Table>
							</TableContainer>
						</Paper>
					</div>
					<div className={styles.dadosExtrato2}>


						<Paper sx={{ width: '100%', overflow: 'hidden' }}>
							<TableContainer component={Paper}>
								<Table sx={{ minWidth: 1 }} aria-label="caption table">
									<caption>
										<footer className={styles.paginationContainer}>
											<div className={styles.containerDetailsPagination}>
												<div>
													<h4>
														{showDataItensPage} de {totalDataFull}, pagina {actualPage} de {quantytiPage}
													</h4>
												</div>
											</div>
											<div className={styles.containerLinkPagination}>
												<Pagination
													limit={limitPage}
													total={totalDataFull}
													offset={actualPage}
													nextPage={nextPage}
													backNextPage={backNextPage}
													totalOfPage={perPage}
													setOffset={setActualPage}
												/>
											</div>
										</footer>
									</caption>

									<TableBody>
										{listKeyExtrato.map((row: any) => {
											if (pegaApenasData(row.data) != dataCompara) {
												dataCompara = pegaApenasData(row.data);
												
												return (

													<div className={styles.grouprTable}>

														<TableRow key={row.id}>

															<div className={styles.groupLinha} style={{ background: '#D3D3D3	' }}>
																<TableCell component="th" align='center' className={styles.dadosLinha}>
																	{validaDataBr(dataCompara)}
																</TableCell>
															</div>
															<div className={styles.groupLinha}>
																<TableCell component="th" align='center' className={styles.dadosLinha}>{row.sigla}{row.sigla == 'C' ? <TrendingUp color='success' /> : <TrendingDown color='error' />}
																</TableCell>
															</div>

															<div>
																<TableCell align='center' className={styles.dadosLinha}>{numeroParaReal(row.valor)}</TableCell>
															</div>
															<div>
																<TableCell align="center" className={styles.dadosLinha}>
																	<Buttom type="submit" onClick={() => { }} loading={false}>
																		Consultar
																	</Buttom>
																</TableCell>
															</div>

														</TableRow>
													</div>
												);
											} else {
												return (

													<div className={styles.grouprTable}>

														<TableRow key={row.id}>

															<div className={styles.groupLinha}>
																<TableCell component="th" align='center' className={styles.dadosLinha}>{row.sigla}{row.sigla == 'C' ? <TrendingUp color='success' /> : <TrendingDown color='error' />}
																</TableCell>
															</div>

															<div>
																<TableCell align='center' className={styles.dadosLinha}>{numeroParaReal(row.valor)}</TableCell>
															</div>
															<div>
																<TableCell align="center" className={styles.dadosLinha}>
																	<Buttom type="submit" onClick={() => { }} loading={false}>
																		Consultar
																	</Buttom>
																</TableCell>
															</div>

														</TableRow>
													</div>

												);
											}
										})}
									</TableBody>
								</Table>
							</TableContainer>
						</Paper>
					</div>
				</div>

				{modalIsOpen ? <Spinner /> : ''}
			</div>
		</Container>
	);
}

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';


import Container from '../../layout/Container';
import styles from './styles.module.scss';
import { FaBarcode } from 'react-icons/fa';
import { FcList, FcTodoList } from "react-icons/fc";
import { CardMaquininha } from '../../components/CardMaquininha/CardMaquininha'
import { numeroParaReal } from 'utils/maks';
import { planosEquipamentos, listAllResquestMachine } from '../../api/aquisicaoEquipamento';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { connect, useDispatch } from 'react-redux';
import { Spinner } from '../../components/Spinner/Spinner';
import { dataUsaParaBr } from '../../utils/GetDate';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import AlertTitle from '@mui/material/AlertTitle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function Maquininha() {
	const user = useSelector((state: any) => state.userReducer.user);
	const dispatch = useDispatch();

	const [planos, setPlanos] = useState([])
	const [requestMachine, setRequestMachine] = useState([])
	const [isLoading, setIsLoading] = useState(true);
	const [expandedAccordion, setExpandedAccordion] = useState('panel1-header');

	const handleAccordionChange = (panel) => (event, isExpanded) => {
		setExpandedAccordion(isExpanded ? panel : null);
	};
	const getPlanosMaquinas = async () => {

		try {
			const response = await planosEquipamentos();
			if (response.status == 200) {
				setPlanos(response.data)
			}
			setIsLoading(false);
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
	}

	const getAllRequestMachine = async () => {

		try {
			const response = await listAllResquestMachine(user?.numeroConta);
			if (response.status == 200) {
				//	console.log("Request machine", response.data)

				setRequestMachine(response?.data)
			}
			setIsLoading(false);
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
	}

	useEffect(() => {
		getPlanosMaquinas();
		getAllRequestMachine();
	}, []);

	useEffect(() => {
		console.log('mostrar planos', planos)

	}, [planos]);
	return (
		<Container>

			<div>
				<Accordion
					expanded={expandedAccordion === 'panel1-header'}
					onChange={handleAccordionChange('panel1-header')}
				>
					<AccordionSummary
						expandIcon={<ArrowDropDownIcon />}
						aria-controls="panel1-content"
						id="panel1-header"
					>
						<section className={styles.containerTransferencia}>
							<div className={styles.cardLeft}>
								<div className={styles.titleContainer}>
									<FcList size={24} color="#ff9900" />
									<h3>Meus equipamentos</h3>
								</div>

							</div>
						</section>
					</AccordionSummary>
					<AccordionDetails>
						{requestMachine.length > 0 ? (
							<Typography>
								<TableContainer component={Paper}>
									<Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
										<TableHead>
											<TableRow>
												<TableCell align="center" width="auto" >Id Solicitação</TableCell>
												<TableCell align="center">Data</TableCell>
												<TableCell align="center">Status</TableCell>
												<TableCell align="center">Plano</TableCell>
												<TableCell align="center">Equipamento</TableCell>
												<TableCell align="center">Quantidade</TableCell>
												<TableCell align="center">N° Serial</TableCell>
												<TableCell align="center">Valor R$</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{requestMachine.map((row) => (
												<TableRow

													key={row?.seq_idssolicitacao_aquisicao}
													sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
												>
													<TableCell align="center" component="th" scope="row">
														{row?.seq_idssolicitacao_aquisicao}
													</TableCell>
													<TableCell align="center">{dataUsaParaBr(row?.criacaoAquisicao)}</TableCell>
													<TableCell align="center">sdfdfds</TableCell>
													<TableCell align="center">{row?.titulo}</TableCell>
													<TableCell align="center">{row?.modelo}</TableCell>
													<TableCell align="center">{row?.quantidade_equipamento}</TableCell>
													<TableCell align="center">NULL</TableCell>
													<TableCell align="center">{numeroParaReal(row?.quantidade_equipamento * row?.valor_contratacao)}</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							</Typography>
						) : (
							<Stack sx={{ width: '100%' }} spacing={2} textAlign={'center'}>
								<Alert severity="warning">
									<AlertTitle>Ops</AlertTitle>
									Não foi encontrado nenhum equipamentopara esta conta, <strong>volte mais tarde!!</strong>
								</Alert>
							</Stack>
						)}

					</AccordionDetails>
				</Accordion>
				<Accordion
					expanded={expandedAccordion === 'panel2-header'}
					onChange={handleAccordionChange('panel2-header')}
				>
					<AccordionSummary
						expandIcon={<ArrowDropDownIcon />}
						aria-controls="panel2-content"
						id="panel2-header"
					>
						<section className={styles.containerTransferencia}>
							<div className={styles.cardLeft}>
								<div className={styles.titleContainer}>
									<FcTodoList size={24} color="#ff9900" />
									<h3>Solicitar equipamentos</h3>
								</div>

							</div>
						</section>
					</AccordionSummary>
					<AccordionDetails>
						<Typography>
							<section className={styles.containerTransferencia}>
								<div className={styles.cardLeft}>

									<div className={styles.cardTransferencia}>
										<CardMaquininha
											dadosProps={planos}
										/>
									</div>
								</div>
							</section>
						</Typography>
					</AccordionDetails>
				</Accordion>
			</div>
			{isLoading ? <Spinner /> : null}
		</Container>
	);
}

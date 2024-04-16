import React, { useState, useEffect } from 'react';

import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { TabList, Tab, Tabs } from 'react-tabs';
import { useRouter } from 'next/router';
import Container from '../../layout/Container';
import Alert from '@mui/material/Alert';
import { decryptID } from '../../utils/encryptId';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { Minicards } from '../../components/MiniCads/MiniCards';
import  FormTransferencias  from '../../components/FormTransferencias/FormTransferencias';
import Loading from '../../components/Loading';
//import  FormTransferenciasInterna  from '../../components/FormTransferenciasInterna/FormTransferenciasInterna';
import { moneyMask } from '../../utils/cpfMask';
import IconsBith from '../../lib/IconsBith/';
import Brasil from '../../lib/bibliotecaBit/icons/Brasil';
import Router from 'next/router';
import { getSaldo } from '../../api/carteira';
import { numeroParaReal } from '../../utils/maks';
import 'react-tabs/style/react-tabs.css';

import styles from './styles.module.scss';

export default function Transferencia() {
	const saldo = useSelector((state: any) => state.saldoReducer.saldo);
	const router = useRouter();
	//const { acountCode } = router.query;
	
	const [habilitaSaldo, setHabilitaSaldo] = useState(false);
	const [getValorTransacao, setGetValorTRansacao] = useState('');
	const [buttomMenuOptionTransfer, setButtomMenuOptionTransfer] = useState(1);
	const [recebeStadoSaldo, setRecebeStadoSaldo] = useState(saldo ?? 0);
	const [isLoading, setIsLoading] = useState(false);
	function chengeSaldo() {
		setHabilitaSaldo(!habilitaSaldo);
	}

	async function getSaldoHeader() {
		try {
			const response = await getSaldo();
			if (response.data.status === 200 && response?.data?.data?.total) {
				setRecebeStadoSaldo(response.data.data.total);
			}
		} catch (error) {
			console.log(error);
		}
	}

	function handleRedirect(paramRedirect: string) {
		setIsLoading(true);
		Router.push(paramRedirect);
	}
	function handleChangeTranfer(param: Number) {
		switch (param) {
			case 1:
				setButtomMenuOptionTransfer(1);
				break;
			case 2:
				setButtomMenuOptionTransfer(2);
				break;
			default:
				break;
		}
	}


	useEffect(() => {
		getSaldoHeader();
	}, []);
	


	return (
		<Container>
			<section className={styles.containerTransferencia}>
				<div className={styles.cardLeft}>
					<div className={styles.titleContainer}>
						<Brasil size={16} color="#000" />
						<h3>Transferência</h3>
					</div>
					<div className={styles.cardTransferencia}>
						
						<Tabs>
							<TabList>
								<Tab>
									<button
										type="button"
										className={styles.buttomMenu}
										onClick={() => handleChangeTranfer(1)}
									>
										Nova conta
									</button>
								</Tab>
								<Tab>
									<button
										type="button"
										className={styles.buttomMenu}
										onClick={() => handleChangeTranfer(2)}
									>
										Favoritos
									</button>
								</Tab>
							</TabList>
							{buttomMenuOptionTransfer === 1 && (
								<div className={styles.containerform}>
									{/* <FormTransferenciasInterna valorTr={getValorTransacao} /><FormTransferencias valorTr={getValorTransacao} />*/}

									<FormTransferencias valorTr={getValorTransacao}/>
								</div>
							)}
							{buttomMenuOptionTransfer === 2 && (
								<div className={styles.containerform}>
									{/*<FavoritosDataTAble />*/}
								</div>
							)}
						</Tabs>
					</div>
				</div>
				<div className={styles.cardRigth}>
					<div className={styles.ContainerRigth}>
						<article>
							<div className={styles.titleContainer}>
								<h3>Como funciona?</h3>
							</div>
							<div className={styles.divComoFunciona}>
								<Alert icon={<InfoOutlined fontSize="large" />} severity="info">
									<p>
										1- Caso a transferência precise de aprovação, os operadores
										da conta receberão um e-mail auttomático para confirma-lá
									</p>
									<p>
										2- As transferências que não receberem todas a aprovações
										necessárias até as 17h do dia definidos serão agendadas para
										o próximo dia útil
									</p>
									<p>
										3- Ao optar pela recorrência, a repetição da operação
										ocorrerá sempre no mesmo dia. Caso a data da recorrência
										caia em um final de semana ou feriado, a transferência será
										realizada no próximo dia útil
									</p>
								</Alert>
							</div>
						</article>
						<div className={styles.acessoRapido}>
							<div className={styles.titleContainer}>
								<h3>Acesso rápido</h3>
							</div>
							<div className={styles.divAcessoRapido}>
								<div className={styles.divAcoes}>
									<Minicards
										nomeIcon={IconsBith.ICONBITH.transferir}
										tituloCard="Transferir"
										caminhoRef="/cadastrarConta"
										enable={false}
									/>

									<Minicards
										nomeIcon={IconsBith.ICONBITH.pagar}
										tituloCard="Pagar"
										caminhoRef="/cadastrarConta"
										enable={true}
										onClick={() => {
											handleRedirect('/pagamento');
										}}
									/>

									<Minicards
										nomeIcon={IconsBith.ICONBITH.extrato}
										tituloCard="Ver extrato"
										caminhoRef="/cadastrarConta"
										onClick={() => {
											handleRedirect('/saldo');
										}}
										enable={true}
									/>

									<Minicards
										nomeIcon={IconsBith.ICONBITH.depositar}
										tituloCard="Depositar"
										caminhoRef="/cadastrarConta"
										enable={false}
									/>
									<Minicards
										nomeIcon={IconsBith.ICONBITH.recarga}
										tituloCard="Recarga"
										caminhoRef="/cadastrarConta"
										enable={false}
									/>

									<Minicards
										nomeIcon={IconsBith.ICONBITH.cobrar}
										tituloCard="Cobrar"
										caminhoRef="/cadastrarConta"
										enable={false}
									/>
								</div>

								<div className={styles.divAcoes}>
									<Minicards
										nomeIcon={IconsBith.ICONBITH.todos}
										tituloCard="Todos"
										caminhoRef="/cadastrarConta"
										enable={false}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<Loading isLoading={isLoading} />
		</Container>
	);
}

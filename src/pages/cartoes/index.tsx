/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

import Link from 'next/link';

import Container from '../../layout/Container';
import Router from 'next/router';
import { Minicards } from '../../components/MiniCads/MiniCards';
import { ListaCartao } from '../../components/ListaCartao/ListaCartao';
import { useSelector } from 'react-redux';
import CartoesIcon from '../../lib/bibliotecaBit/icons/CartoesIcon';
import Dolar from '../../lib/bibliotecaBit/icons/Dolar';
import IconsBith from '../../lib/IconsBith/';
import Loading from '../../components/Loading';
import styles from './styles.module.scss';

export default function Cartoes() {
	const user = useSelector((state: any) => state.userReducer.user);
	const saldo = useSelector((state: any) => state.saldoReducer.saldo);
	const [isLoading, setIsLoading] = useState(false);

	function handleRedirect(paramRedirect: string) {
		setIsLoading(true);
		Router.push(paramRedirect);
	}
	return (
		<Container>
			<div className={styles.dadosContainerBody}>
				<div className={styles.dadosContainerLeft}>
					<div className={styles.titleContainer}>
						<CartoesIcon size={23} color="#000" />
						<h3>Cartões</h3>
					</div>
					<div className={styles.divCard}>
						<ListaCartao />
						<ListaCartao />
					</div>
				</div>
				<div className={styles.dadosContainerRigth}>
					<div className={styles.titleContainer}>
						<Dolar size={23} />
						<h3>cotação do dólar</h3>
					</div>
					<div className={styles.divCotacao}>
						<div className={styles.divListaCotacao}>
							<div className={styles.lista}>
								<span>09/04/2023</span>
								<span className={styles.underlinespan}></span>
								<span>R$ 5.27</span>
							</div>
							<div className={styles.lista}>
								<span>08/04/2023</span>
								<span className={styles.underlinespan}></span>
								<span>R$ 5.27</span>
							</div>
							<div className={styles.lista}>
								<span>07/04/2023</span>
								<span className={styles.underlinespan}></span>
								<span>R$ 5.27</span>
							</div>
						</div>
					</div>
					<div className={styles.titleContainer}>
						<CartoesIcon size={23} color="#000" />
						<h3>Histórico de cartões</h3>
					</div>
					<div className={styles.divHistorico}>
						<div className={styles.textcodigoBarra}>
							<p>
								Acesse aqui seu histórico de cartões
								<br />
								BithPay e configa suas faturas
							</p>
						</div>
					</div>

					<div className={styles.onptionHistorico}>
						<div className={styles.textOptionchaves}>
							<Link className={styles.linkOptionsPix} href="/">
								<p>Acessar</p>
							</Link>
						</div>
					</div>
					<div className={styles.titleContainer}>
						<h3>Acesso rápido</h3>
					</div>
					<div className={styles.divAcessoRapido}>
						<div className={styles.divAcoes}>
							<Minicards
								nomeIcon={IconsBith.ICONBITH.transferir}
								tituloCard="Transferir"
								caminhoRef="/transferencia"
								enable={true}
								onClick={() => {
									handleRedirect('/transferencia');
								}}
							/>
							<Minicards
								nomeIcon={IconsBith.ICONBITH.pagar}
								tituloCard="Pagar"
								caminhoRef="/cadastrarConta"
								enable={false}
							/>
							<Minicards
								nomeIcon={IconsBith.ICONBITH.extrato}
								tituloCard="Ver extrato"
								caminhoRef="/extrato"
								enable={true}
								onClick={() => {
									handleRedirect('/saldo');
								}}
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
			<Loading isLoading={isLoading} />
		</Container>
	);
}

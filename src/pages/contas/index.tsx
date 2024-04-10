/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
import Router from 'next/router';

import Container from '../../layout/Container';
import { Spinner } from '../../components/Spinner/Spinner';
import { ListarContas } from '../../components/ListarContas/Listarcontas';
import BotaoOpcoesExtrato from '../../components/ui/BotaoOpcoesExtrato';
import styles from './styles.module.scss';
import { getSaldo } from '../../api/carteira';

export default function Contas() {
	const user = useSelector((state: any) => state.userReducer.user);
	const saldo = useSelector((state: any) => state.saldoReducer.saldo);

	const [habilitaSaldo, setHabilitaSaldo] = useState(true);
	const [blockCard, setBloqueCard] = useState(false);
	const [modalIsOpen, setIsOpen] = useState(false);
	const [recebeStadoSaldo, setRecebeStadoSaldo] = useState(saldo ?? 0);

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

	function chengeSaldo() {
		setHabilitaSaldo(!habilitaSaldo);
		getSaldoApi();
	}

	function hendleBlockCard() {
		setBloqueCard(!blockCard);
	}

	function handleRedirect(paramRedirect: string) {
		setIsOpen(true);
		Router.push(paramRedirect);
	}

	useEffect(() => {
		getSaldoApi();
	}, []);

	return (
		<Container>
			<div className={styles.headerListarContas}>
				<div>
					<h5>Listar Contas</h5>
				</div>
				<div className={styles.optionsAcount}>
					<BotaoOpcoesExtrato
						onClick={() => {}}
						typeIcon={'AddHomeWork'}
						textButtom="Constas Júridicas"
						stateButtom={false}
					/>
					<BotaoOpcoesExtrato
						onClick={() => {}}
						typeIcon={'Group'}
						textButtom="Constas Fiísicas"
						stateButtom={false}
					/>
				</div>
			</div>
			<ListarContas />
			{modalIsOpen ? <Spinner /> : null}

			{/*  FIM SEGUNDO BLOCO */}
		</Container>
	);
}

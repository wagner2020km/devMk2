/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';

import Alert from '@mui/material/Alert';

import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import Container from '../../layout/Container';

import { FormPix } from '../../components/FormPix/FormPix';
import FormPixCachOut from '../../components/FormPixCachOut/FormPixCachOut';
//import { moneyMask } from '../../utils/cpfMask'
import { numeroParaReal } from '../../utils/maks';
import Brasil from '../../lib/bibliotecaBit/icons/Brasil';
import Pix from '../../lib/bibliotecaBit/icons/Pix';
import { getSaldo } from '../../api/carteira';
import styles from './styles.module.scss';

export default function GeraPix() {
	const saldo = useSelector((state: any) => state.saldoReducer.saldo);

	const [habilitaSaldo, setHabilitaSaldo] = useState(true);
	const [getValorTransacao] = useState('');
	const [recebeStadoSaldo, setRecebeStadoSaldo] = useState(saldo ?? 0);

	async function getSaldoApi() {
		try {
			const response = await getSaldo();
			if (response.data.status === 200 && response?.data?.data?.total) {
				setRecebeStadoSaldo(response.data.data.total);
			}
		} catch (error) {
			console.log(error);
		}
	}

	function chengeSaldo() {
		getSaldo();
		setHabilitaSaldo(!habilitaSaldo);
	}

	useEffect(() => {
		try {
			getSaldoApi();
		} catch (error) {
			console.log(error);
		}
	}, []);

	return (
		<Container>
			<section className={styles.containerTransferencia}>
				<div className={styles.cardLeft}>
					<div className={styles.titleContainer}>
						<Pix size={16} color="#000" />
						<h3>Pix</h3>
					</div>
					<div className={styles.cardTransferencia}>
						<div className={styles.dadosSaldo}>
							<figure>
								<Brasil size={16} />
							</figure>

							<h5>Saldo em conta corrente</h5>
						</div>
						<div className={styles.valorSaldo}>
							<div className={styles.saldoLeft}>
								<p>
									{' '}
									<span className={styles.textoGeral}></span>
									<span className={styles.textoValorSaldo}>
										{habilitaSaldo === true
											? numeroParaReal(saldo)
											: '*********'}
									</span>
									<span className={styles.textoGeral}>
										{habilitaSaldo === true ? '' : ''}
									</span>
								</p>
							</div>
							<div className={styles.iconeSaldo}>
								<button className={styles.buttomIcon} onClick={chengeSaldo}>
									{habilitaSaldo === true ? (
										<AiFillEye size={28} />
									) : (
										<AiFillEyeInvisible size={28} />
									)}
								</button>
							</div>
						</div>

						<div className={styles.containerform}>
							<FormPixCachOut />
						</div>
					</div>
				</div>
				<div className={styles.cardRigth}>
					<div className={styles.titleContainer}>
						<Pix size={16} color="#000" />
						<h3>Informações</h3>
					</div>
					<div className={styles.cardTransferencia}>
						<Alert icon={<InfoOutlined fontSize="inherit" />} severity="info">
							<p>
								<span>Como funciona:</span>{' '}
							</p>
							<p>
								1 - Selecione uma das opções de chaves pix disponíveis em tipo
								chave.
							</p>
							<p>2 - Insira a chave pix de acordo com a opção escolhida.</p>
							<p>3 - Insira o valor a ser transferido.</p>
							<p>4 - Click em CONTINUAR para validar a chave e aguarde.</p>
							<p>5 - Confira as informações e dados da conta.</p>
							<p>
								6 - Click em ENVIAR PIX para finalizar a transação se todos os
								dados estiverem corretos.
							</p>
						</Alert>
					</div>
				</div>
			</section>
		</Container>
	);
}

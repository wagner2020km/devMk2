import { Minicards } from '../../components/MiniCads/MiniCards';
import { CartaoCard } from '../../components/CartaoCard/CartaoCard';

import SetaExtrato from '../../lib/bibliotecaBit/icons/SetaExtrato';
import IconsBith from '../../lib/IconsBith/';

import Link from 'next/link';

import styles from './styles.module.scss';

export function ListaCartao() {
	return (
		<div className={styles.listCard}>
			<CartaoCard nomeCliente="Jeferson Silva" numeroCartao="1359" />
			<div className={styles.resumoFatura}>
				<h5>ABERTA</h5>
				<p className={styles.saldoFatura}>
					<span>R$ </span>10.990,34
				</p>
				<p className={styles.limiteCartao}>
					Limite disponível <span>R$ 9.809,04 </span>
				</p>

				<span>Melhor dia para compra: 5</span>

				<Link className={styles.linkFaturaRef} href="/asa">
					<p>Acessar fatura</p>
					<SetaExtrato color="#0511F2" size={10} />
				</Link>
			</div>
			<div className={styles.acoescartao}>
				<Minicards
					nomeIcon={IconsBith.ICONBITH.senha}
					tituloCard="Pagar QrCode"
					caminhoRef="/cadastrarConta"
				/>
				<Minicards
					nomeIcon={IconsBith.ICONBITH.googlepay}
					tituloCard="Pagar QrCode"
					caminhoRef="/cadastrarConta"
				/>
				<Minicards
					nomeIcon={IconsBith.ICONBITH.cartoes}
					tituloCard="Pagar QrCode"
					caminhoRef="/cadastrarConta"
				/>
				<Minicards
					nomeIcon={IconsBith.ICONBITH.beneficios}
					tituloCard="Pagar QrCode"
					caminhoRef="/cadastrarConta"
				/>
			</div>
		</div>
	);
}

import React, { useState } from 'react';

import Image from 'next/image';

import { MdOutlineSettings } from 'react-icons/md';

import getImg from '../../assets';

import styles from './styles.module.scss';

interface CartaoCardProps {
	nomeCliente: string;
	numeroCartao: string;
}
export function CartaoCard({ nomeCliente, numeroCartao }: CartaoCardProps) {
	const [blockCard, setBlockCard] = useState(false);

	function handleBlockCard() {
		setBlockCard(!blockCard);
	}
	return (
		<div className={styles.container}>
			<div className={styles.containerBody}>
				<div className={styles.cartao}>
					<div className={styles.topoCartao}>
						<div>
							<Image src={getImg('logo.png')} alt="logo" width={60} />
						</div>
						<div>
							<MdOutlineSettings size={18} color="#FFF" />
						</div>
					</div>

					<div className={styles.conteudoCartao}>
						<p>{nomeCliente}</p>
					</div>

					<div className={styles.rodapeCartao}>
						<div className={styles.tituloRodape}>
							<p>Final {numeroCartao}</p>
						</div>
						<div>
							<MdOutlineSettings size={18} color="#FFF" />
						</div>
					</div>
				</div>

				<div className={styles.buttomBlock}>
					<button onClick={handleBlockCard}>
						{blockCard ? 'Desbloquear' : 'Bloquear'}
					</button>
				</div>
			</div>
			<div className={styles.dadosClienteCartao}>
				<div>
					<p className={styles.tituloCartao}>cartão</p>
					<p className={styles.tituloDadosCartao}>final {numeroCartao}</p>
				</div>
				<div>
					<p className={styles.tituloCartao}>Nome gravado</p>
					<p className={styles.tituloDadosCartao}>{nomeCliente}</p>
				</div>
			</div>
		</div>
	);
}

import React from 'react';

import Image from 'next/image';

import getImg from '../../assets';

import Notificacao from '../../lib/bibliotecaBit/icons/Notificacao';

import styles from './styles.module.scss';

export function Rodape() {
	return (
		<div className={styles.containerRodape}>
			<div className={styles.dadosContatos}>
				<div className={styles.logo}>
					<Image src={getImg('logo_cinza.png')} alt="logo" width={75} />
				</div>
				<h5>FALE CONOSCO</h5>
				<br />
				<p>Horário de atendimento de 08:00 ás 20:00h.</p>
				<p>
					Ligue 3003 4070 (região metropolitana) ou 0800 940 0007 (Demais
					regiões)
				</p>
				<br />
				<p>
					Para reclamações, sugestões ou cancelamento de produtos e serviços:
				</p>
				<p>SAC: 0800 940 9999 - Deficiente de fala e Audição: 0800 979 7099</p>
				<p>Ouvidoria: 0800 9407772 | © Todos os direitos reservados</p>
			</div>
			<div className={styles.containerChate}>
				<div className={styles.chate}>
					<div className={styles.imgNotificacao}>
						<Notificacao size={48} color="var(--BACKGROUND_ICON_INFO)" />
					</div>
					<h5>
						{new Date().getFullYear()} - BithIve - Todos os direitos reservados
					</h5>
				</div>
			</div>
		</div>
	);
}

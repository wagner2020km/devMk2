import styles from './styles.module.scss';

import Image from 'next/image';

import getImg from '../../../assets';

import Notificacao from '../../../lib/bibliotecaBit/icons/Notificacao';

export function RodapeBith() {
	return (
		<div className={styles.containerRodape}>
			<div className={styles.logo}>
				<Image src={getImg('logo_cinza.png')} alt="logo" width={75} />
			</div>
			<div className={styles.dadosContatos}>
				<h5></h5>
				<br />
				<p></p>
				<p>

				</p>
				<br />
				<p>

				</p>
				<p></p>
				<p></p>
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

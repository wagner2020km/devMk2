import styles from './styles.module.scss';

import Image from 'next/image';

import getImg from '../../../assets';

import Notificacao from '../../../lib/bibliotecaBit/icons/Notificacao';

export function RodapeGlobal() {
	return (

		<div>
			<div className={styles.canaisAtendimento}>
				<h5>CANAIS DE ATENDIMENTO E REDES SOCIAS</h5>
			</div>
			<div className={styles.containerRodape}>
				{/*
			<div className={styles.logo}>
				<Image src={getImg('logo_oficial.png')} alt="logo" width={100} />
			</div>
			*/}

				<div className={styles.dadosContatos}>

					<p>Atendimento: (31) 9609-8534</p>

					<h5>Ouvidoria:</h5>
					<p>E-mail: contato@globalpaysolucoes.com.br</p>
				</div>
				<div className={styles.dadosContatos}>
					<h5>Redes sociais: </h5>
					<p>
						Siga a GlobalPay nas redes sociais e fique por dentro de todas as
						novidades.
					</p>
					<p>
						Lembre-se: Para sua segurança verifique sempre o selo oficial das
						nossas redes. Assim você tem a certeza de que somos nós falando com
						você.
					</p>
				</div>
				<div className={styles.containerChate}>
					<div className={styles.chate}>
						<div
							className={styles.imgNotificacao}
							onClick={() => {
								//	abreAlert();
							}}
						>
							<Notificacao size={48} color="var(--BACKGROUND_ICON_INFO)" />
						</div>

						<h5>
							{new Date().getFullYear()} - GlobalPay - Todos os direitos reservados
						</h5>
					</div>
				</div>
			</div>
		</div>



	);
}

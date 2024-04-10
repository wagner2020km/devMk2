import styles from './styles.module.scss';

import Image from 'next/image';

import getImg from '../../../assets';

import Notificacao from '../../../lib/bibliotecaBit/icons/Notificacao';

import { toast } from 'react-toastify';

export function RodapeAncoora() {
	const abreAlert = () => {
		toast.success(`Em breve estaremos online`, {
			position: 'top-center',
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: 'colored',
		});
	};
	return (
		<div>
			<div className={styles.canaisAtendimento}>
				<h5>CANAIS DE ATENDIMENTO E REDES SOCIAS</h5>
			</div>
			<div className={styles.containerRodape}>
				<div className={styles.logo}>
					<Image src={getImg('logo_oficial.png')} alt="logo" width={100} />
				</div>
				<div className={styles.dadosContatos}>
					<h5>Chat:</h5>
					<p>Atendimento whats App: (31) 99 7 33 0000.</p>
					<h5>Central de relacionamento:</h5>
					<p>
						Ligue 0800 591 0958 (disponível de 8h as 18h de segunda a sexta)
					</p>
					<h5>Ouvidoria:</h5>
					<p>E-mail: ouvidoria@anncora.com.br</p>
				</div>
				<div className={styles.dadosContatos}>
					<h5>Redes sociais: </h5>
					<p>
						Siga o anncora bank nas redes sociais e fique por dentro de todas as
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
								abreAlert();
							}}
						>
							<Notificacao size={48} color="var(--BACKGROUND_ICON_INFO)" />
						</div>

						<h5>
							{new Date().getFullYear()} - Anncora - Todos os direitos
							reservados
						</h5>
					</div>
				</div>
			</div>
		</div>
	);
}

import styles from './styles.module.scss';

import Image from 'next/image';
import GetDateNoW from 'utils/functions/GetDateNow';
import helloUser from 'utils/functions/HelloUser';

import getImg from 'assets';

type PropsHeader = {
	nameHeader: string;
};

export function DadosHeader({ nameHeader }: PropsHeader) {
	return (
		<div className={styles.containerDadosUser}>
			<div className={styles.bemVindo}>
				<div>
					<Image
						className={styles.divImgLogo}
						src={getImg('logo_oficial.png')}
						alt="logo"
					/>
				</div>
				<div>
					<span className={styles.comprimentos}>{helloUser()},</span>
					<h4 className={styles.nomeUsuario}>{nameHeader ? nameHeader : ''}</h4>
				</div>
			</div>
			<div className={styles.dataHora}>
				<span className={styles.comprimentos}>{GetDateNoW()}</span>
			</div>
		</div>
	);
}

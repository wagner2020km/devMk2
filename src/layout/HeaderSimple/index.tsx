import React from 'react';
import Image from 'next/image';

import getImg from '../../assets';

import styles from './styles.module.scss';

export function HeaderSimple() {
	return (
		<div className={styles.containerHeader}>
			<div className={styles.containerEsquerdo}>
				<div className={styles.containerLogo}>
					<Image
						className={styles.divImgLogo}
						src={getImg('logo.png')}
						alt="logo"
					/>
				</div>
			</div>
		</div>
	);
}

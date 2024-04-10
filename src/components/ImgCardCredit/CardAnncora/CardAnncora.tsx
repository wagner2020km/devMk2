import styles from './styles.module.scss';

import Image from 'next/image';

import ImagemMkt from '../../../assets/anncora/cartao_anncora.png';
import { toast } from 'react-toastify';

export function CardAnncora() {
	
	return (
		<div className={styles.cardImagem}>
			<Image className={styles.imagemMkt} src={ImagemMkt} alt="logo" />
		</div>
	);
}

// import Link from 'next/link';
import styles from './styles.module.scss';
//import { faHome } from "@fortawesome/free-solid-svg-icons";
//import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
//import {} from '../../utils/Pin'
//import { MdMonetizationOn } from "react-icons/md";
// import { Pin } from '../../utils/Pin';
// import IconCaledar from '../../../public/BitIcones/agendamento.svg';

import Image from 'next/image';
import { ButtonHTMLAttributes } from 'react';

interface PropsIcon extends ButtonHTMLAttributes<HTMLButtonElement> {
	nomeIcon: string;
	tituloCard: string;
	caminhoRef: string;
	enable?: boolean;
}

export function Minicards({
	tituloCard,
	nomeIcon,
	// caminhoRef,
	enable,
	...rest
}: PropsIcon) {
	return (
		<div className={styles.containerCard}>
			<button
				className={styles.buttomCard}
				// href={caminhoRef}
				{...rest}
			>
				{enable === true && (
					<div className={styles.cards}>
						<div className={styles.icones}>
							<Image
								className={styles.iconesBith}
								src={nomeIcon}
								alt="Logo - SVG"
								width="30"
								height="30"
							/>
						</div>
					</div>
				)}

				{enable === false && (
					<div className={styles.cardsDisabled}>
						<div className={styles.icones}>
							<Image
								className={styles.iconesBith}
								src={nomeIcon}
								alt="Logo - SVG"
								width="30"
								height="30"
							/>
						</div>
					</div>
				)}
			</button>

			<div className={styles.nomeIcone}>
				<span>{tituloCard}</span>
			</div>
		</div>
	);
}

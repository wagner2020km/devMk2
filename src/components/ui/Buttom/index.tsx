import { ReactNode, ButtonHTMLAttributes } from 'react';
import styles from './styles.module.scss';

import { FaSpinner } from 'react-icons/fa';

interface ButtomPtops extends ButtonHTMLAttributes<HTMLButtonElement> {
	loading?: boolean;
	children: ReactNode;
	color?: string;
}

export function Buttom({ loading, children, ...rest }: ButtomPtops) {
	return (
		<button className={styles.buttom} disabled={loading} {...rest}>
			{loading ? (
				<FaSpinner color="#FFF" size={16} />
			) : (
				<a className={styles.buttomText}>{children}</a>
			)}
		</button>
	);
}

export function ButtonOutline({ loading, children, ...rest }: ButtomPtops) {
	return (
		<button className={styles.buttonOutline} disabled={loading} {...rest}>
			{loading ? (
				<FaSpinner color="#FFF" size={16} />
			) : (
				<a className={styles.buttonTextOutline}>{children}</a>
			)}
		</button>
	);
}

export function ButtomWarning({ loading, children, ...rest }: ButtomPtops) {
	return (
		<button className={styles.buttomDanger} disabled={loading} {...rest}>
			{loading ? (
				<FaSpinner color="#FFF" size={16} />
			) : (
				<a className={styles.buttomText}>{children}</a>
			)}
		</button>
	);
}

export function ButtomSucces({ loading, children, color, ...rest }: ButtomPtops) {
	return (
		<button className={color == 'enabled' ? styles.buttomsucces : styles.buttomdisabled} disabled={loading} {...rest}>
			{loading ? (
				<FaSpinner color="#FFF" size={16} />
			) : (
				<a className={styles.buttomText}>{children}</a>
			)}
		</button>
	);
}
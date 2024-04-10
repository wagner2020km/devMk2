import styles from './styles.module.scss';

import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

interface TextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {}

export function Input({ ...rest }: InputProps) {
	return <input className={styles.inputComponente} {...rest} />;
}

export function TextArea({ ...rest }: TextAreaProps) {
	return <TextArea className={styles.inputComponente} {...rest}></TextArea>;
}

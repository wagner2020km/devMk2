import styles from './styles.module.scss';

import InputMask from 'react-input-mask';

import { InputHTMLAttributes, SelectHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

interface TextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export function InputFormBit({ ...rest }: InputProps) {
	return <input className={styles.inputComponente} {...rest} />;
}

export function InputFormBitClean({ ...rest }: InputProps) {
	return <input className={styles.inputComponenteClean} {...rest} />;
}

export function TextArea({ ...rest }: TextAreaProps) {
	return <TextArea className={styles.inputComponente} {...rest}></TextArea>;
}

export function SelectInputBit({ ...rest }: SelectProps) {
	return <select className={styles.inputComponenteSelect} {...rest} />;
}

export function MaskInput(props) {
	return (
		<InputMask
			className={styles.inputComponente}
			mask={props.mask}
			placeholder={props.placeholder}
			type="text"
			onChange={props.onChange}
			onBlur={props.onBlur}
			value={props.value}
		/>
	);
}

/* eslint-disable no-unused-vars */
import React, { useState, ChangeEvent } from 'react';

import { validateCpf, validateCnpj } from '../../../validacoes/validarMascaras';

import styles from './styles.module.scss';

interface CpfCnpjInputProps {
	// eslint-disable-next-line no-unused-vars
	onValueChange: (value: {
		name: string;
		valor: string;
		isCpf: boolean;
		isCnpj: boolean;
		isValid: boolean;
		page?: number;
	}) => void;
	page?: number;
	inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
	borderColor?: string;
}

const CpfCnpjInput: React.FC<CpfCnpjInputProps> = ({
	onValueChange,
	page,
	inputProps,
	borderColor = '#ccc',
}) => {
	const [value, setValue] = useState('');
	const [label, setLabel] = useState('CPF ou CNPJ');
	const [isCpf, setIsCpf] = useState(false);
	const [, setIsCnpj] = useState(false);
	const [error, setError] = useState('');

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value.replace(/\D/g, '');
		let formattedValue = '';
		let newLabel = 'CPF';
		let isValid = false;
		if (inputValue.length < 14) {
			setError('');
		}

		if (inputValue.length <= 11) {
			formattedValue = inputValue
				.replace(/(\d{3})(\d)/, '$1.$2')
				.replace(/(\d{3})(\d)/, '$1.$2')
				.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
			newLabel = 'CPF';
			setIsCpf(true);
			setIsCnpj(false);
			if (inputValue.length === 11) {
				isValid = validateCpf(formattedValue);
				setError(isValid ? '' : 'CPF inválido. Verifique o CPF digitado.');
			}
		} else if (inputValue.length <= 14) {
			formattedValue = inputValue
				.replace(/^(\d{2})(\d)/, '$1.$2')
				.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
				.replace(/\.(\d{3})(\d)/, '.$1/$2')
				.replace(/(\d{4})(\d)/, '$1-$2');
			newLabel = 'CNPJ';
			setIsCpf(false);
			setIsCnpj(true);
			if (inputValue.length === 14) {
				isValid = validateCnpj(formattedValue);
				setError(isValid ? '' : 'CNPJ inválido. Verifique o CNPJ digitado.');
				if (isValid) {
					setIsCpf(false);
					setIsCnpj(true);
				}
			} else {
				setIsCpf(true);
				setIsCnpj(false);
			}
		}

		if (inputValue.length > 14) {
			return;
		}

		setValue(formattedValue);
		setLabel(newLabel);

		onValueChange({
			name: 'cpfCnpj',
			valor: formattedValue,
			isCpf: newLabel === 'CPF' ? true : false,
			isCnpj: newLabel === 'CNPJ' ? true : false,
			isValid: isValid,
			page: page,
		});
	};

	const handleBlur = () => {
		const inputValue = value.replace(/\D/g, '');
		let formattedValue = '';
		let newLabel = isCpf ? 'CPF' : 'CNPJ';
		let isValid = false;

		if (inputValue.length <= 11) {
			formattedValue = inputValue
				.replace(/(\d{3})(\d)/, '$1.$2')
				.replace(/(\d{3})(\d)/, '$1.$2')
				.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
			newLabel = 'CPF';
			setIsCpf(true);
			setIsCnpj(false);
			if (inputValue.length === 11) {
				isValid = validateCpf(formattedValue);
				setError(isValid ? '' : 'CPF inválido. Verifique o CPF digitado.');
			}
		} else if (inputValue.length <= 14) {
			formattedValue = inputValue
				.replace(/^(\d{2})(\d)/, '$1.$2')
				.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
				.replace(/\.(\d{3})(\d)/, '.$1/$2')
				.replace(/(\d{4})(\d)/, '$1-$2');
			newLabel = 'CNPJ';
			setIsCpf(false);
			setIsCnpj(true);
			if (inputValue.length === 14) {
				isValid = validateCnpj(formattedValue);
				setError(isValid ? '' : 'CNPJ inválido. Verifique o CNPJ digitado.');
				if (isValid) {
					setIsCpf(false);
					setIsCnpj(true);
				}
			} else {
				setIsCpf(true);
				setIsCnpj(false);
			}
		}

		if (inputValue.length > 14) {
			return;
		}

		setValue(formattedValue);
		setLabel(newLabel);

		onValueChange({
			name: 'cpfCnpj',
			valor: formattedValue,
			isCpf: newLabel === 'CPF' ? true : false,
			isCnpj: newLabel === 'CNPJ' ? true : false,
			isValid: isValid,
			page: page,
		});
	};

	return (
		<div>
			<input
				aria-label={label}
				value={value}
				onChange={handleChange}
				onBlur={handleBlur}
				className={styles.input}
				style={{ borderColor: borderColor }}
				placeholder="Digite o CPF ou CNPJ"
				{...inputProps}
			/>
			{error && <p className={styles.labelError}>{error}</p>}
		</div>
	);
};

export default CpfCnpjInput;

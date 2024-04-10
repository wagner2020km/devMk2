/* eslint-disable react-hooks/exhaustive-deps */
import React, { InputHTMLAttributes, useState, useEffect } from 'react';
import InputMask from 'react-input-mask';

import styles from './styles.module.scss';

interface GenericInputProps {
	name: string;
	// eslint-disable-next-line no-unused-vars
	onValueChange: (value: {
		name: string;
		valor: string;
		isValid: boolean;
		page?: number;
	}) => void;
	mask?: string;
	errorMessage?: string;
	// eslint-disable-next-line no-unused-vars
	fcValidData?: (value: string) => boolean;
	page?: number;
	inputProps?: InputHTMLAttributes<HTMLInputElement>;
	errorInField?: boolean;
}

const GenericInput: React.FC<GenericInputProps> = ({
	name,
	mask,
	onValueChange,
	errorMessage,
	fcValidData,
	page,
	inputProps,
	errorInField,
}) => {
	const [value, setValue] = useState('');
	const [isValid, setIsValid] = useState(false);
	const [error, setError] = useState('');
	const [borderColor, setBorderColor] = useState('#ccc');

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value;

		if (fcValidData && fcValidData(inputValue)) {
			setError('');
			setIsValid(true);
		} else if (fcValidData && !fcValidData(inputValue)) {
			setIsValid(false);
			setError(errorMessage);
		} else if (value.length > 0) {
			setIsValid(true);
			setError('');
		}

		setValue(inputValue);

		onValueChange({
			name,
			valor: inputValue,
			isValid: isValid,
			page,
		});

		if (inputValue.length <= 3) {
			setIsValid(false);
			setError('');
		}
	};

	useEffect(() => {
		onValueChange({
			name,
			valor: value,
			isValid: isValid,
			page,
		});
	}, [isValid, error, value]);

	useEffect(() => {
		if (error) {
			setBorderColor('#f00');
		} else if (isValid) {
			setBorderColor('#ccc');
		} else {
			setBorderColor('#ccc');
		}
	}, [error, isValid]);

	useEffect(() => {
		if (errorInField) {
			setBorderColor('#f00');
			if (errorMessage) {
				setError(errorMessage);
			}
		}
	}, [errorInField]);

	return (
		<div>
			<InputMask
				mask={mask}
				value={inputProps?.value || value}
				onChange={handleChange}
				className={styles.input}
				style={{
					borderColor: borderColor,
				}}
				{...inputProps}
			/>
			{error && <p className={styles.labelError}>{error}</p>}
		</div>
	);
};

export default GenericInput;

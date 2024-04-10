import React from 'react';
import { Button } from '@mui/material';

import styles from './styles.module.scss';

type BotaoCompartilharProps = {
	onClick?: () => void;
};

const BotaoCompartilhar: React.FC<BotaoCompartilharProps> = ({ onClick }) => {
	return (
		<Button
			variant="contained"
			color="inherit"
			className={styles.button}
			onClick={onClick}
		>
			Compartilhar
		</Button>
	);
};

export default BotaoCompartilhar;

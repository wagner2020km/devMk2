import React from 'react';
import { Button } from '@mui/material';
import ArrowDown from '@mui/icons-material/ArrowCircleDown';
import ArrowUp from '@mui/icons-material/ArrowCircleUp';
import All from '@mui/icons-material/Expand';
import Clean from '@mui/icons-material/CleaningServices';
import YoutubeSearchedFor from '@mui/icons-material/YoutubeSearchedFor';
import AddHomeWork from '@mui/icons-material/AddHomeWork';
import Group from '@mui/icons-material/Group';

import styles from './styles.module.scss';

type BotaoOpcoesrProps = {
	onClick: () => void;
	textButtom: string;
	typeIcon: string;
	stateButtom: boolean;
	typeButtom?: string;
};

const BotaoOpcoesExtrato: React.FC<BotaoOpcoesrProps> = ({
	onClick,
	textButtom,
	typeIcon,
	stateButtom,
	// typeButtom,
}) => {
	const getIvon = (paramIcon) => {
		switch (paramIcon) {
			case 'ArrowCircleDown':
				return <ArrowDown color="error" fontSize="small" />;
			case 'ArrowCircleUp':
				return <ArrowUp color="success" />;
			case 'Expand':
				return <All color="primary" />;
			case 'CleaningServices':
				return <Clean color="primary" />;
			case 'YoutubeSearchedFor':
				return <YoutubeSearchedFor color="primary" />;
			case 'AddHomeWork':
				return <AddHomeWork color="primary" />;
			case 'Group':
				return <Group color="primary" />;
			default:
				break;
		}
		return <ArrowDown />;
	};
	return (
		<Button
			variant="contained"
			//color="primary"
			color={stateButtom == true ? 'info' : 'inherit'}
			className={styles.button}
			onClick={onClick}
			startIcon={getIvon(typeIcon)}
		>
			{textButtom}
		</Button>
	);
};

export default BotaoOpcoesExtrato;

import React from 'react';

import { useSelector } from 'react-redux';

import Typography from '@mui/material/Typography';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Stack from '@mui/material/Stack';

import Container from '../../layout/Container';

import CardDuasColunas from '../../components/ui/CardDuasColunas';
import BotaoCompartilhar from '../../components/ui/BotaoCompartilhar';

import getPropSegura from '../../utils/getPropSegura';

import styles from './styles.module.scss';

export default function GeraPix() {
	const user = useSelector((state: any) => state.userReducer.user);

	return (
		<Container>
			<CardDuasColunas
				column1Content={
					<>
						<AccountCircleIcon style={{ fontSize: '80px', color: '#555' }} />
						<Stack direction="column" justifyContent={'center'}>
							<Typography
								variant="h5"
								component="div"
								className={styles.fontNomeUser}
							>
								{getPropSegura(user, ['name']) ? user?.name?.toUpperCase() : ''}
							</Typography>
							<Typography variant="body2" component="div">
								@
								{getPropSegura(user, ['nickname']) ||
									user?.name?.split(' ')[0] ||
									getPropSegura(user, ['name'], '')}
							</Typography>
						</Stack>
					</>
				}
				column2Content={
					<>
						<Typography
							variant="body1"
							component="div"
							style={{ paddingBottom: 10 }}
						>
							Número da conta: {getPropSegura(user, ['numeroConta'], '')} <br />
							Agência: {getPropSegura(user, ['codinstituicao'], '0000')} <br />
							Banco: 00
						</Typography>
						<BotaoCompartilhar />
					</>
				}
			/>
		</Container>
	);
}

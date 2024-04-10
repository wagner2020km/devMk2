import Typography from '@mui/material/Typography';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { Rodape } from '../Rodape';
import { HeaderSimple } from '../HeaderSimple';

import styles from './styles.module.scss';

export default function ContainerCadastro({
	children,
	isResgister = true,
	childrenStyle = {},
}) {
	return (
		<>
			<div className={styles.containerWrapper}>
				<HeaderSimple />
				<div className={styles.containerCenter}>
					<div className={styles.divRowStyle}>
						{isResgister ? (
							<>
								<Typography
									variant="h4"
									component="h1"
									style={{ color: '#fff' }}
								>
									Cadastro
								</Typography>
								<PersonAddAltOutlinedIcon
									style={{ fontSize: 50, color: '#fff' }}
								/>
							</>
						) : (
							<>
								<Typography
									variant="h4"
									component="h1"
									style={{ color: '#fff' }}
								>
									Login
								</Typography>
							</>
						)}
					</div>
					<div className={styles.childrenStyle} style={childrenStyle}>
						{children}
					</div>
				</div>
				<Rodape />
			</div>
		</>
	);
}

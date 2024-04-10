import React from 'react';

import { Card, CardContent, Stack, useMediaQuery } from '@mui/material';

type CustomCardProps = {
	column1Content: React.ReactNode;
	column2Content: React.ReactNode;
};

import styles from './styles.module.scss';

const CustomCard: React.FC<CustomCardProps> = ({
	column1Content,
	column2Content,
}) => {
	const isMobile = useMediaQuery('(max-width: 600px)');

	return (
		<Card className={styles.cardUser}>
			<CardContent>
				<Stack
					direction={isMobile ? 'column' : 'row'}
					spacing={2}
					justifyContent={isMobile ? 'center' : 'space-around'}
				>
					<Stack direction="row" spacing={2} alignItems="center">
						{column1Content}
					</Stack>
					<Stack direction="column" justifyContent="center">
						{column2Content}
					</Stack>
				</Stack>
			</CardContent>
		</Card>
	);
};

export default CustomCard;

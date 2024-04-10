import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: 'var(--BACKGOUND_SPINNER_900)',
	},
}));

export function Spinner() {
	const classes = useStyles();

	return (
		<div>
			<Backdrop className={classes.backdrop} open>
				<CircularProgress color="inherit" />
			</Backdrop>
		</div>
	);
}

import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, Theme } from '@material-ui/core/styles';

interface LoadingProps {
	isLoading: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

const Loading: React.FC<LoadingProps> = (props) => {
	const { isLoading } = props;

	const classes = useStyles();

	return (
		<div>
			<Backdrop className={classes.backdrop} open={isLoading}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</div>
	);
};

export default Loading;

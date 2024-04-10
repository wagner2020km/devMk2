import React, { useState, useEffect } from 'react';

export const useCountDows = (hoursMinSecs, startPause) => {
	const { minutes = 0, seconds = 60 } = hoursMinSecs;
	const [[mins, secs], setTime] = useState([minutes, seconds]);
	const [startStop, setStartStop] = useState(startPause);
	console.log('start', startStop);
	const tick = () => {
		if (mins === 0 && secs === 0) reset();
		// eslint-disable-next-line no-dupe-else-if
		else if (mins === 0 && secs === 0) {
			setTime([59, 59]);
		} else if (secs === 0) {
			setTime([mins - 1, 59]);
		} else {
			setTime([mins, secs - 1]);
		}
	};

	const reset = () => setTime([parseInt(minutes), parseInt(seconds)]);

	useEffect(() => {
		console.log('cronometro');

		if (startStop == true) {
			const timerId = setInterval(() => tick(), 1000);
			return () => clearInterval(timerId);
		} else {
			setStartStop(false);
			return () => clearInterval(0);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<p>{`${mins.toString().padStart(2, '0')}:${secs
				.toString()
				.padStart(2, '0')}`}</p>
		</div>
	);
};

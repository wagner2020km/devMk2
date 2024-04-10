import React from 'react';

const CadeadoBloqueado = (props) => {
	return (
		<svg
			id="Camada_2"
			xmlns="http://www.w3.org/2000/svg"
			width={props.size ? props.size : '9.96'}
			height={props.size ? props.size : '13.08'}
			viewBox="0 0 9.96 13.08"
		>
			<g id="Camada_1-2">
				<path
					class="cls-1"
					d="m8.72,4.36h-.62v-1.25c0-1.72-1.39-3.11-3.11-3.11S1.87,1.39,1.87,3.11h0v1.25h-.63c-.69,0-1.24.56-1.25,1.25v6.23c0,.69.56,1.24,1.25,1.25h7.47c.69,0,1.24-.56,1.25-1.25v-6.23c0-.69-.56-1.24-1.25-1.25Zm-3.74,5.67c-.69,0-1.25-.56-1.25-1.25s.56-1.25,1.25-1.25,1.25.56,1.25,1.25c0,.69-.56,1.24-1.25,1.25Zm1.93-5.67h-3.86v-1.25h0c.02-1.07.91-1.91,1.97-1.89,1.03.02,1.86.85,1.89,1.89v1.25Z"
					fill={props.color ? props.color : '#FF0000'}
				/>
			</g>
		</svg>
	);
};

export default CadeadoBloqueado;

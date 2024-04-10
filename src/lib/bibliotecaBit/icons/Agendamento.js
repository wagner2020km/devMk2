import React from 'react';

const Agendamento = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={props.size ? props.size : '11.7'}
			height={props.size ? props.size : '13'}
			viewBox="0 0 11.7 13"
		>
			<path
				id="Caminho_582"
				data-name="Caminho 582"
				d="M9.25,5.3h5.2V4h1.3V5.3h.65a1.3,1.3,0,0,1,1.3,1.3v9.1A1.3,1.3,0,0,1,16.4,17H7.3A1.3,1.3,0,0,1,6,15.7V6.6A1.3,1.3,0,0,1,7.3,5.3h.65V4h1.3ZM7.3,7.9v7.8h9.1V7.9ZM8.6,9.85H9.9v1.3H8.6Zm2.6,0h1.3v1.3H11.2Zm2.6,0h1.3v1.3H13.8Zm0,2.6h1.3v1.3H13.8Zm-2.6,0h1.3v1.3H11.2Zm-2.6,0H9.9v1.3H8.6Z"
				transform="translate(-6 -4)"
				fill={props.color ? props.color : '#FFF'}
				fill-rule="evenodd"
			/>
		</svg>
	);
};

export default Agendamento;

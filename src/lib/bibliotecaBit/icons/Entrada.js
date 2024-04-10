import React from 'react';

const Saida = (props) => {
	return (
		
		<svg
		xmlns="http://www.w3.org/2000/svg"
		width={props.size ? props.size : '22'}
		height={props.size ? props.size : '22'}
		viewBox="0 0 22 22"
	>

		<g id="arrow-down-circle-fill" transform="translate(22 22) rotate(180)">
			<g id="Grupo_39" data-name="Grupo 39">
				<path
					id="Caminho_602"
					data-name="Caminho 602"
					d="M22,11A11,11,0,1,1,11,0,11,11,0,0,1,22,11ZM11.688,6.188a.688.688,0,0,0-1.375,0v7.965L7.362,11.2a.688.688,0,1,0-.973.973L10.513,16.3a.688.688,0,0,0,.974,0l4.125-4.125a.688.688,0,1,0-.974-.974l-2.951,2.952Z"
					fill={props.color ? props.color : 'var(--COLORFONTES_CASHIN)'}
				/>
			</g>
		</g>
	</svg>
	);
};

export default Saida;

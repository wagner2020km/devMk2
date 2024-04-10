import React from 'react';

const FecharMenu = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={props.size ? props.size : '10'}
			height={props.size ? props.size : '20'}
			viewBox="0 0 10 20"
		>
			<text
				id="x"
				transform="translate(0 16)"
				fill={props.color ? props.color : '#FFF'}
				font-size="16"
				font-family="Inter-Bold, Inter"
				font-weight="700"
			>
				<tspan x="0" y="0">
					x
				</tspan>
			</text>
		</svg>
	);
};

export default FecharMenu;

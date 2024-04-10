import React from 'react';
import { Buttom } from '../../components/ui/Buttom';

type PageButtonsProps = {
	showBack?: boolean;
	showNext?: boolean;
	onBack?: () => void;
	onNext?: () => void;
};

const PageButtons: React.FC<PageButtonsProps> = ({
	showBack = true,
	showNext = true,
	onBack,
	onNext,
}) => (
	<div style={{ display: 'flex', justifyContent: 'space-between' }}>
		{showBack && showNext && (
			<Buttom style={{ marginRight: '1rem' }} onClick={onBack}>
				Voltar
			</Buttom>
		)}
		{showNext && <Buttom onClick={onNext}>Continuar</Buttom>}
		{showBack && !showNext && <Buttom onClick={onBack}>Voltar</Buttom>}
		{!showBack && !showNext && <Buttom onClick={onBack}>Fechar</Buttom>}
	</div>
);

export default PageButtons;

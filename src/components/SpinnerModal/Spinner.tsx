import styles from './styles.module.scss';

import Modal from 'react-modal';

export function Spinner() {
	return (
		<div className={styles.containerSpinner}>
			<Modal
				style={{
					overlay: {
						backgroundColor: 'transparent',
					},
					content: {
						border: '0',
						background: 'transparent',
						borderRadius: '20px',
						padding: '20px',
						top: '50%',
						left: '50%',
						right: 'auto',
						bottom: 'auto',
						marginRigth: '-50%',
						transform: 'translate(-50%, -50%)',
					},
				}}
				isOpen={true}
				ariaHideApp={false}
				disablePortal
				disableEnforceFocus
				disableAutoFocus
				open
			>
				<div className={styles.loadSpinner}></div>
			</Modal>
		</div>
	);
}

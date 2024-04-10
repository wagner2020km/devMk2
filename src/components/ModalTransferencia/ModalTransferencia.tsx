import React, { useEffect, useState } from 'react';

import Modal from 'react-modal';
import Image from 'next/image';

import { Buttom, ButtomWarning } from '../../components/ui/Buttom';

import { validaDataBr } from '../../validacoes/DataBr';

import getImg from '../../assets';

import styles from './styles.module.scss';

export function ModalTransferencia({ openModal, props }) {
	const [modalIsOpen, setIsOpen] = useState(false);
	const dateNow = new Date().toDateString();

	async function handletransferencia() {}

	function closeModal() {
		setIsOpen(false);
	}

	useEffect(() => {
		if (modalIsOpen != false) {
			setIsOpen(openModal);
		}
		//setIsOpen(openModal)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [openModal]);

	return (
		<>
			<Modal
				className={styles.modalContainerSucesso}
				isOpen={modalIsOpen}
				disablePortal
				disableEnforceFocus
				disableAutoFocus
				open
				contentLabel="Modal"
			>
				<section className={styles.containerModalPixSucesso}>
					<header className={styles.headerModal}>
						<Image
							className={styles.imgBithLogo}
							src={getImg('logo.png')}
							alt="logo"
						/>
					</header>
					<div className={styles.dadosDetalhesPagamento}>
						<div className={styles.inconePaymentSucces}></div>
						<div className={styles.tituloSucesso}>
							<h4>Dados para transferencia</h4>
							<h1> R${props.valorTratado}</h1>
						</div>
						{/* DADOS DE QUEM PAGOU */}
						<div className={styles.tituloSucesso}>
							<h4>Quem vai receber</h4>
						</div>
						<div className={styles.detalhamentoComprovante}>
							<p>
								{props?.data?.nomeFavorecido != undefined
									? props?.data?.nomeFavorecido
									: ''}
							</p>
							<p>
								Agência:
								{props?.data?.agencia != undefined ? props?.data?.agencia : ''}
							</p>
							<p>
								Conta:
								{props?.data?.conta != undefined ? props?.data?.conta : ''}
							</p>
							<p>
								: {props?.data?.agendamento == 1 ? validaDataBr(dateNow) : ''}
							</p>
						</div>
						<div className={styles.containerbuttomEnviarPix}>
							<Buttom
								type="button"
								onClick={() => handletransferencia()}
								loading={false}
							>
								ENVIAR PIX
							</Buttom>
							<p>&nbsp;</p>
							<ButtomWarning
								type="button"
								onClick={() => closeModal()}
								loading={false}
							>
								CANCELAR
							</ButtomWarning>
						</div>
					</div>
				</section>
			</Modal>
		</>
	);
}

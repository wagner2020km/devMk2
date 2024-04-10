import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { useSelector } from 'react-redux';
import { Buttom } from '../../components/ui/Buttom';
import Container from '../../layout/Container';
import { connect } from 'react-redux';
import { Minicards } from '../../components/MiniCads/MiniCards';
import { Spinner } from '../../components/Spinner/Spinner';
import Link from 'next/link';
import Router from 'next/router';
import { ToastOptions, toast } from 'react-toastify';
import { AiOutlineKey } from 'react-icons/ai';
import { editarSenha } from '../../api/editarSenha';
import PageButtons from './PageButtons';
import ChangePassword from '../../components/ChangePassword/ChangePassword'
import {
	validarDataNascimento,
	verificaEmail,
	verificaForcaSenha,
} from '../../validacoes/validarMascaras';
import {
	regiterAccount,
	regiterAccountCompany,
	sendCodeVerification,
	verifyCode,
} from '../../api/cadastro';
import {
	resetUserRecouverData,
	setUserRecouverField,
} from '../../redux/actions/userRecouverActions';

import IconsBith from '../../lib/IconsBith/';
import Pix from '../../lib/bibliotecaBit/icons/Pix';
import Pagar from '../../lib/bibliotecaBit/icons/Pagar';

import getPropSegura from '../../utils/getPropSegura';
import { getSaldo } from '../../api/carteira';

import styles from './styles.module.scss';

const toastConfig: ToastOptions<{}> = {
	position: 'top-center',
	autoClose: 3000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: false,
	draggable: true,
	progress: undefined,
	theme: 'colored',
};

export default function Home(props: any) {

	const user = useSelector((state: any) => state.userReducer.user);
	const saldo = useSelector((state: any) => state.saldoReducer.saldo);
	const [modalIsOpen, setIsOpen] = useState(false);
	const [statusPassword, setStatusPassword] = useState(false);




	const {
		allFields,
		token,
		senha,
		confirmarSenha,
		finish,
		setFieldRedux,
		invalidFields,
		resetUserRecouverDataRedux,
	} = props;

	const [nPagina, setNpagina] = useState(1);
	const [isLoading, setIsLoading] = useState(false);

	const handleValueChangeCpfOrCnpj = async ({
		name,
		valor,
		isCpf,
		isCnpj,
		isValid,
		page,
	}) => {
		setFieldRedux(name, {
			name,
			valor,
			isCpf,
			isCnpj,
			isValid,
			page,
		});
	};

	const handleValueChange = ({ name, valor, isValid, page }) => {
		setFieldRedux(name, {
			name,
			valor,
			isValid,
			page,
		});
	};

	const handleSendCode = async (telefone: string) => {
		setStatusPassword(true);
		try {
			setIsOpen(true);
			const responseSendtoken = await sendCodeVerification('sms', telefone);

			if (responseSendtoken.status == 200) {
				toast.success(
					`Código 6 dígitos enviado por ${telefone.toLocaleUpperCase()}`,
					toastConfig
				);
			} else {
				toast.error(
					`Erro no envio do token`,
					toastConfig
				);
			}


		} catch (error) {
			console.log(error);
		} finally {
			setIsOpen(false);
		}
	};

	const handleChangePassword = async () => {
		if (senha.valor !== confirmarSenha.valor) {
			toast.error('As senhas não são iguais', toastConfig);
			return;
		}
		
		if (verificaForcaSenha(senha.valor) === false) {
			toast.error('Sua senha não atende aos requisitos', toastConfig);
			return;
		}
		try {
			setIsOpen(true);
			const responseChange = await editarSenha(senha.valor, user.email);
			if (responseChange.status == 200) {
				toast.success(
					`Senha alterada com sucesso!!`,
					toastConfig
				);
				resetUserRecouverDataRedux();
				setNpagina(1)
				setStatusPassword(false);
				// limpar redux aqui 
			} else {
				toast.error(
					`Erro ao editar senha`,
					toastConfig
				);
			}


		} catch (error) {
			console.log(error);
		} finally {
			setIsOpen(false);
		}
	};

	/*
	function hendleBlockCard() {
		setBloqueCard(!blockCard);
	}
	*/
	function handleRedirect(paramRedirect: string) {
		setIsOpen(true);
		Router.push(paramRedirect);
	}

	const verifyFieldsByPage = (page: number) => {
		const invalidFieldsByPage = invalidFields.filter(
			(field: string) => allFields[field]?.page === page
		);
		let isValid = true;
		if (page === 1) {
			if (!statusPassword) {
				isValid = false;
			}

		} else if (page === 2) {
			if (!token.isValid) {
				isValid = false;
			}
		}

		if (!isValid) {
			toast.error('Preencha os dados corretamente', toastConfig);
			return false;
		}

		return invalidFieldsByPage?.length === 0;
	};

	const handleNextPage = async () => {
		const stadoTemp = true;
		const isValidsFields = verifyFieldsByPage(nPagina);
		if (nPagina === 1) {

			if (stadoTemp) {
				setNpagina((prev) => prev + 1);
			}
		} else if (nPagina === 2) {
			if (isValidsFields) {
				await handleChangePassword();
			}
		}
	};
	/*
	const handlePreviousPage = () => {
		const currentPage = nPagina;
		if (
			currentPage === 2


		) {
			setNpagina(currentPage - 1);
		}
	};
	*/
	const getColorError = (field: string) => {
		if (invalidFields.includes(field)) {
			return '#FF0000';
		}
		if (allFields[field]?.isValid) {
			return '#32A639';
		}
	};

	const handleVerifyCode = async (
		type: string,
		value: string,
		valueType: string
	) => {
		setIsOpen(true);
		console.log('tipo', type)
		console.log('valor', value)
		console.log('tipo valor', valueType)
		try {
			setIsOpen(true);
			const response = await verifyCode(type, value, valueType);

			if (response?.status === 400) {
				toast.error('Código inválido', toastConfig);
			} else if (response?.status > 199 && response?.status < 300) {
				toast.success('Código verificado com sucesso', toastConfig);
				handleNextPage();
			} else {
				toast.error('Houve algum erro ☹️', toastConfig);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsOpen(false);
		}
	};
	

	return (
		<Container>
			<div className={styles.containerAcessoSaldo}>

				<div className={styles.cardSaldo}>
					{/*
					
				
					{!statusPassword && (
						<>
							<div className={styles.dadosNameUser}>
								<span>Olá,&nbsp;</span>
								<h4> {user ? user.name : ''}</h4>
							</div>
							<div>

								<button
									className={styles.buttomIconExtrato}
									onClick={() => {
										handleSendCode(user.telefone)
									}}
								>
									<AiOutlineKey size={28} />
									<span>&nbsp;&nbsp;Alterar senha</span>
								</button>

							</div>
						</>
					)}

					{statusPassword && (
						<>
							{nPagina === 1 && (
								<>

									<div>
										<h1 className={styles.labeTitle}>Token</h1>
									</div>

									<div>
										<InputMask
											placeholder="Código de Verificação*"
											mask="999999"
											value={token.valor}
											onChange={(event) => {
												const inputValue = event.target.value.replace(/\D/g, '');
												if (inputValue.length < 6) {
													console.log(inputValue)
													const auxInvalidFields = [
														...invalidFields,
														'token',
													];
													setFieldRedux('invalidFields', auxInvalidFields);
												} else {
													const auxInvalidFields = invalidFields.filter(
														(field: string) => field !== 'token'
													);
													setFieldRedux('invalidFields', auxInvalidFields);
												}
												handleValueChange({
													name: 'token',
													valor: inputValue,
													isValid: true,
													page: 1,
												});
											}}
											className={styles.input}
											style={{ borderColor: getColorError('token') }}
										/>
										{invalidFields.includes('token') && (
											<p className={styles.labelError}>Digite seu nome completo</p>
										)}
									</div>

									<Buttom
										onClick={() => {
											handleVerifyCode(
												token.valor.replace(/\D/g, ''),
												'sms',
												user.telefone,
											);
										}}
									>
										Verificar Código
									</Buttom>
									<Buttom
										onClick={() => {
											handleSendCode(user.telefone)
										}}
									>
										Reenviar Código
									</Buttom>
								</>
							)}


							{nPagina === 2 && (
								<>
									<div>
										<InputMask
											placeholder="Senha*"
											mask={null}
											value={senha.valor}
											onChange={(event) => {
												const inputValue = event.target.value;
												handleValueChange({
													name: 'senha',
													valor: inputValue,
													isValid: true,
													page: 5,
												});
											}}
											type="password"
											className={styles.input}
											style={{ borderColor: getColorError('senha') }}
										/>
										{invalidFields.includes('senha') && (
											<p className={styles.labelError}></p>
										)}
									</div>

									<div>
										<InputMask
											placeholder="Confirmar senha*"
											mask={null}
											value={confirmarSenha.valor}
											onChange={(event) => {
												const inputValue = event.target.value;
												handleValueChange({
													name: 'confirmarSenha',
													valor: inputValue,
													isValid: true,
													page: 5,
												});
											}}
											type="password"
											className={styles.input}
											style={{ borderColor: getColorError('confirmarSenha') }}
										/>
										{
											<p className={styles.labelAlert}>
												Sua senha deve conter no mínimo 10 caracteres,<br></br> sendo
												pelo menos uma letra maiúscula, <br></br>uma minúscula, um
												número e um caractere especial.
												<br></br>
											</p>
										}
									</div>

									<PageButtons showBack={false} onNext={handleNextPage} />
								</>
							)}
						</>
					)}
									*/}
									<ChangePassword/>
				</div>
				<div className={styles.cardAcessoRapido}>
					<div className={styles.divTextAcesso}>
						<h3>Acesso Rápido</h3>
					</div>
					<div className={styles.containerCardAcesso}>
						<Minicards
							nomeIcon={IconsBith.ICONBITH.transferir}
							//tituloCard="Pagar"
							tituloCard="Em breve"
							caminhoRef="/cadastrarConta"
							onClick={() => { }}
							enable={false}
						/>
						<Minicards
							nomeIcon={IconsBith.ICONBITH.pagar}
							//tituloCard="Extrato"
							tituloCard="Em breve"
							caminhoRef="/cadastrarConta"
							onClick={() => { }}
							enable={false}
						/>

						<Minicards
							nomeIcon={IconsBith.ICONBITH.extrato}
							//tituloCard="Ver extrato"
							tituloCard="Ver Extrato"
							caminhoRef="/saldo"
							onClick={() => {
								handleRedirect('/saldo');
							}}
							enable={true}
						/>

						<Minicards
							nomeIcon={IconsBith.ICONBITH.cartoes}
							tituloCard="Cartôes"
							caminhoRef="/cartoes"
							enable={false}
						/>

						<Minicards
							nomeIcon={IconsBith.ICONBITH.depositar}
							///tituloCard="Depositar"
							tituloCard="Em breve"
							caminhoRef="/cadastrarConta"
							onClick={() => { }}
							enable={false}
						/>

						<Minicards
							nomeIcon={IconsBith.ICONBITH.recarga}
							//tituloCard="Recarga"
							tituloCard="Em breve"
							caminhoRef="/cadastrarConta"
							onClick={() => { }}
							enable={false}
						/>

						<Minicards
							nomeIcon={IconsBith.ICONBITH.cobrar}
							//tituloCard="Cobrar"
							tituloCard="Em breve"
							caminhoRef="/cadastrarConta"
							onClick={() => { }}
							enable={false}
						/>

						<Minicards
							nomeIcon={IconsBith.ICONBITH.todos}
							// tituloCard="Todos"
							tituloCard="Em breve"
							caminhoRef="/cadastrarConta"
							onClick={() => { }}
							enable={false}
						/>
					</div>
					<div className={styles.menuCenter}>
						<div className={styles.containerOptLeft}>
							<div className={styles.titlePixIcon}>
								<Pix size={16} color="#000" />
								<h3>&nbsp;PIX</h3>
							</div>
							<div className={styles.dataOptionLeft}>
								<div></div>
								<Minicards
									nomeIcon={IconsBith.ICONBITH.qr_code}
									//tituloCard="Pagar QrCode"
									tituloCard="Em breve"
									caminhoRef="/cadastrarConta"
									enable={false}
								/>

								<Minicards
									nomeIcon={IconsBith.ICONBITH.transferir}
									tituloCard="Transferir"
									caminhoRef="/geraPix"
									onClick={() => {
										handleRedirect('/geraPix');
									}}
									enable={true}
								/>

								<Minicards
									nomeIcon={IconsBith.ICONBITH.receber}
									// tituloCard="Receber"
									tituloCard="Em breve"
									caminhoRef="/cadastrarConta"
									enable={false}
								/>

								<Minicards
									nomeIcon={IconsBith.ICONBITH.saque_troca}
									// tituloCard="Saque Troco"
									tituloCard="Em breve"
									caminhoRef="/cadastrarConta"
									enable={false}
								/>
							</div>

							<div className={styles.onptionPix}>
								<div className={styles.textOptionchaves}>
									<Link
										className={styles.linkOptionsPix}
										href="/chavesPix"
										onClick={() => {
											setIsOpen(true);
										}}
									>
										<p>Minhas Chaves</p>
									</Link>
								</div>
								<div className={styles.dividader}></div>

								<div className={styles.textOptionlimit}>
									<Link className={styles.linkOptionsPix} href="">
										<p>Meus Limites PIX</p>
									</Link>
								</div>
							</div>
						</div>
						<div className={styles.containerOptRigth}>
							<div className={styles.titlePixIcon}>
								<Pagar size={16} color="#000" />
								<h3>&nbsp;Pagamentos</h3>
							</div>
							<div className={styles.dataOptionRigth}>
								<div className={styles.textcodigoBarra}>
									<p>
										Pague aqui todos os seus boletos e tributos com o código de
										barras
									</p>
								</div>
								<div className={styles.containerInputPagar}>
									<input
										type="text"
										placeholder="Digite o código de barras"
										disabled
										className={styles.inputPagar}
									/>
									<div className={styles.iconeInput}>
										<Pagar size={16} color="#000" />
									</div>
								</div>
								<div className={styles.onptionPix}>
									<div className={styles.textOptionchaves}>
										<Link className={styles.linkOptionsPix} href="/pagamento">
											<p>Continuar</p>
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{modalIsOpen ? <Spinner /> : null}
		</Container>
	);
}

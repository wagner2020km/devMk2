import React, { useState, useEffect, useContext } from 'react';

import { useSelector } from 'react-redux';

import Container from '../../layout/Container';

import { Minicards } from '../../components/MiniCads/MiniCards';
import { Spinner } from '../../components/Spinner/Spinner';
import titleBank from '../../constants/titleBank';
import Image from 'next/image';
import Link from 'next/link';
import Router from 'next/router';
import { permission } from '../../utils/arrayPermission'
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { MdOutlineSettings } from 'react-icons/md';
import { getExtratos } from '../../api/extrato';
import { CardCreditHome } from 'layout/CardCreditHome';
import ImagemMkt from '../../assets/geral/cartoesMkt.png';

import IconsBith from '../../lib/IconsBith/';
import TrendingUp from '@mui/icons-material/TrendingUp';
import TrendingDown from '@mui/icons-material/TrendingDown';
import IconTRansfer from '../../components/IconesBith/IconTRansfer';
import IconContas from '../../components/IconesBith/IconContas';
import Pix from '../../lib/bibliotecaBit/icons/Pix';

import { validaDiaDoMes, pegaHoraMinuto } from '../../utils/GetDate';

import styles from './styles.module.scss';
import { AuthContext } from '../../contexts/AuthContext';
import Pagar from '../../lib/bibliotecaBit/icons/Pagar';
import Saida from '../../lib/bibliotecaBit/icons/Saida';
import Entrada from '../../lib/bibliotecaBit/icons/Entrada';
import CadeadoDesbloqueado from '../../lib/bibliotecaBit/icons/CadeadoDesbloqueado';
import CadeadoBloqueado from '../../lib/bibliotecaBit/icons/CadeadoBloqueado';
import { getParteString } from '../../utils/pegaParteString'
import { getSaldo } from '../../api/carteira';
import { aquisicaoMaquinasPos } from '../../api/aquisicaoEquipamento';

import { numeroParaReal } from '../../utils/maks';

import getImg from '../../assets';
import { number } from 'yup';

type ProposTypeaquisicao = {
	titulo?: string,
	descricao?: string,
	url_image?: string,
	seq_idpaquisicaomaquinas?: number,
	rota_web?: string,

}

export default function Home() {
	const { signOut } = useContext(AuthContext);
	const user = useSelector((state: any) => state.userReducer.user);
	const saldo = useSelector((state: any) => state.saldoReducer.saldo);
	const [abilitaCarMaquinas, setAbilitaCarMaquinas] = useState(false)
	const [habilitaSaldo, setHabilitaSaldo] = useState(true);
	const [blockCard, setBloqueCard] = useState(false);
	const [modalIsOpen, setIsOpen] = useState(false);
	const [recebeStadoSaldo, setRecebeStadoSaldo] = useState(0);
	const [listKeyExtrato, setListKeyExtrato] = useState([]);
	const [publicidadeMaquina, setPublicidadeMaquina] = useState<ProposTypeaquisicao>();

	async function getMaquinasPublicidade() {
		let dataPublicidade = {}
		try {
			const response = await aquisicaoMaquinasPos();
			console.log('dados publicidade maquinas', response);
			if (response.status == 200) {
				dataPublicidade = {
					titulo: response.data.titulo,
					descricao: response.data.descricao,
					url_image: response.data.url_image,
					seq_idpaquisicaomaquinas: response.data.seq_idpaquisicaomaquinas,
					rota_web: response.data.rota_web,
				}
				setPublicidadeMaquina(dataPublicidade);
				setAbilitaCarMaquinas(true);
			} else {
				setAbilitaCarMaquinas(false);
				setPublicidadeMaquina(dataPublicidade)
			}
		} catch (error) {
			console.log(error);
		}
	}
	async function getSaldoApi() {
		try {
			const response = await getSaldo();
			if (response?.data?.status === 200 && response?.data?.data?.total) {
				setRecebeStadoSaldo(response.data.data.total);
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function handleGetExtrato() {
		try {
			const response = await getExtratos(user.numeroConta, '', 10, 1, '', '');
			const keys = response?.data?.data ?? [];
			if (response?.data?.status == 200) {
				const keys = response?.data?.data ?? [];
				setListKeyExtrato(keys);
			}
			setListKeyExtrato(keys);
		} catch (error) {
			console.log(error);
		}
	}

	function chengeSaldo() {
		setHabilitaSaldo(!habilitaSaldo);
		getSaldoApi();
	}

	function hendleBlockCard() {
		setBloqueCard(!blockCard);
	}

	function handleRedirect(paramRedirect: string) {
		setIsOpen(true);
		Router.push(paramRedirect);
	}

	useEffect(() => {
		getSaldoApi();
		getMaquinasPublicidade()
	}, []);

	useEffect(() => {
		handleGetExtrato();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		console.log(permission(8))
		const validAcesso = permission(user?.perfilid);
		if (validAcesso == false || user?.situacao != 'atv') {
			//signOut()
		}

	}, []);

	return (
		<Container>
			<div className={styles.containerAcessoSaldo}>
				<div className={styles.cardSaldo}>
					<div className={styles.dadosNameUser}>
						<span>Olá,&nbsp;</span>
						<h4> {user ? user.name : ''}</h4>
					</div>

					<div className={styles.containerInfoConta}>
						<p>SALDO CONTA PRINCIPAL</p>
					</div>

					<div className={styles.containerValorSaldo}>
						<h2>
							{habilitaSaldo ? numeroParaReal(recebeStadoSaldo) : '*********'}
						</h2>{' '}
						<span>{habilitaSaldo ? '' : ''}</span>
						<button className={styles.buttomIcon} onClick={chengeSaldo}>
							{habilitaSaldo === true ? (
								<AiFillEyeInvisible size={28} />
							) : (
								<AiFillEye size={28} />
							)}
						</button>
					</div>

					<div>
						<Link href="/saldo">
							<button
								className={styles.buttomIconExtrato}
								onClick={() => {
									setIsOpen(true);
								}}
							>
								<AiFillEye size={28} />
								<span>&nbsp;&nbsp;Ver extrato</span>
							</button>
						</Link>
					</div>
				</div>

				<div className={styles.cardAcessoRapido}>
					<div className={styles.divTextAcesso}>
						<h3>Acesso Rápido</h3>
					</div>
					<div className={styles.containerCardAcesso}>
						<Minicards
							nomeIcon={IconsBith.ICONBITH.transferir}
							//tituloCard="Pagar"
							tituloCard="Trensfer. interna"
							caminhoRef="/transferencia"
							onClick={() => {
								handleRedirect('/transferencia');
							}}
							enable={true}
						/>
						<Minicards
							nomeIcon={IconsBith.ICONBITH.pagar}
							//tituloCard="Extrato"
							tituloCard="Pagar contas"
							caminhoRef="/pagamento"
							onClick={() => {
								handleRedirect('/pagamento');
							}}
							enable={true}
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
					<div className={styles.containerCardAcesso}>
					<Minicards
							nomeIcon={IconsBith.ICONBITH.depositar}
							///tituloCard="Depositar"
							tituloCard="Vendas"
							caminhoRef="/extratoVendas"
							onClick={() => { 
								handleRedirect('/extratoVendas');
							}}
							enable={true}
						/>
						<Minicards
							nomeIcon={IconsBith.ICONBITH.depositar}
							///tituloCard="Depositar"
							tituloCard="Simulador"
							caminhoRef="/simulador"
							onClick={() => { 
								handleRedirect('/simulador');
							}}
							enable={true}
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
									nomeIcon={IconsBith.ICONBITH.pix}
									tituloCard="Enviar pix"
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

			{/* INICIO SEGUNDO BLOCO */}

			<div className={styles.containerBodyTwo}>
				<div className={styles.cardOne}>
					<h3 className={styles.tituloCard}>Ultimas Transações</h3>

					<div className={styles.cardDadosTransacoes}>
						{listKeyExtrato.map((item, index) => {
							return (
								<div key={index} className={styles.listadeTransacoes}>
									<div className={styles.tipotransacao}>
										{item.metodo == 'PIX' && (
											<>
												<p className={styles.tituloTransacao}>
													Pix {pegaHoraMinuto(item.data)}
												</p>

												<div className={styles.iconeTransacao}>	<Pix size={32} color="#14a69d" /></div>
											</>

										)}
										{item.metodo == 'BILL_PAYMENTS' && (
											<>
												<p className={styles.tituloTransacao}>
													Pag contas {pegaHoraMinuto(item.data)}
												</p>
												<IconContas
													height={48}
													width={48}
													primaryColor={'#14a69d'}
													secondaryColor={'#14a69d'}
												/>
											</>

										)}
										{item.metodo == 'INTERNAL_TRANSFER' && (
											<>
												<p className={styles.tituloTransacao}>
													Trasnferência {pegaHoraMinuto(item.data)}
												</p>
												<IconTRansfer
													height={32}
													width={32}
													primaryColor={'#14a69d'}
													secondaryColor={'#14a69d'}
												/>
											</>

										)}
									</div>
									<div className={styles.contentIcon}>
										{item.tipo_transacao == 'CREDIT' ? <TrendingUp color='success' /> : <TrendingDown color='error' />}
									</div>
									<div className={styles.dadosTransacao}>
										<p className={styles.tituloTransacao}>
											{item.tipo_transacao}
										</p>
										<p className={styles.descricaoTransacao}>{getParteString(item.nome, 10)}</p>

										{item.tipo_transacao === 'CREDIT' && (
											<h4 className={styles.valorTransacaoOut}>
												- {numeroParaReal(item.valor)}
											</h4>
										)}

										{item.tipo_transacao === 'DEBIT' && (
											<h4 className={styles.valorTransacaoIn}>
												+ {numeroParaReal(item.valor)}
											</h4>
										)}

									</div>
								</div>
							);
						})}
					</div>
				</div>
				{/*
				<div className={styles.carTwo}>
					<h3 className={styles.tituloCard}>Meu Cartões</h3>

					<div className={styles.cardMeusCartoes}>
						<div className={styles.cartao}>
							<div className={styles.topoCartao}>
								<div>
									<Image src={getImg('logo.png')} alt="logo" width={60} />
								</div>
								<div>
									<MdOutlineSettings size={18} color="#FFF" />
								</div>
							</div>

							<div className={styles.conteudoCartao}>
								<p>{user?.name}</p>
							</div>

							<div className={styles.rodapeCartao}>
								<div className={styles.tituloRodape}>
									<p>Final 1359</p>
								</div>
								<div>
									<MdOutlineSettings size={18} color="#FFF" />
								</div>
							</div>
						</div>
						<div className={styles.dadosClienteCartao}>
							<div>
								<p className={styles.tituloCartao}>cartão</p>
								<p className={styles.tituloDadosCartao}>final 1359</p>
							</div>
							<div>
								<p className={styles.tituloCartao}>Nome gravado</p>
								<p className={styles.tituloDadosCartao}>{user?.name}</p>
							</div>
						</div>
					</div>
					<div className={styles.cardBloqueiaCartao}>
						<div className={styles.containerBloqueio}>
							{blockCard ? (
								<CadeadoBloqueado size={16} />
							) : (
								<CadeadoDesbloqueado size={16} />
							)}
							<button
								className={styles.buttomIconBloqueio}
								onClick={hendleBlockCard}
							>
								{blockCard ? <p>Bloqueado</p> : <p>Ativado</p>}
							</button>
						</div>
						<div className={styles.containerDetalhes}>
							<Link href="">
								<p>Detalhes</p>
							</Link>
						</div>
					</div>
				</div>
					*/}

				{abilitaCarMaquinas == true && (
					<div className={styles.carTree}>
						<h3 className={styles.tituloCard}>{publicidadeMaquina?.titulo}</h3>

						<div className={styles.maquininhas}>
							<div className={styles.cardTextos}>
								<p className={styles.textMaquininha}>Quer uma maquininha?</p>
								<p className={styles.descricaoMaquinhinha}>
								{publicidadeMaquina?.descricao}
								</p>
								<p className={styles.descricaoMaquinhinha}>
									<Link className={styles.linkMenu} href={`${publicidadeMaquina?.rota_web}`}>
										<span className={styles.labelTextMenuAtivo}>Contrate agora</span>
									</Link>

								</p>
							</div>

							<div className={styles.cardImagem}>
								<Image className={styles.imagemMkt} src={ImagemMkt} alt="logo" />
							</div>

							<CardCreditHome />

						</div>
					</div>

				)}





				{/*
				<div className={styles.carTree}>
					<h3 className={styles.tituloCard}>Para Você</h3>

					<div className={styles.cardParaVc}>
						<div className={styles.cardTextos}>
							<p className={styles.tituloParaVc}>
								Convide seus amigos <br />
								para a {titleBank}
							</p>
							<p className={styles.descricaoParaVc}>
								Compartilhe o banco da sua vida e divida a experiência{' '}
								{titleBank} com quem você gosta
							</p>
						</div>
						
						<div className={styles.cardImagem}>
							<Image className={styles.imagemMkt} src={ImagemMkt} alt="logo" />
						</div>
						
						<CardCreditHome />

</div>
</div>
				*/}

			</div>

			{modalIsOpen ? <Spinner /> : null}

			{/*  FIM SEGUNDO BLOCO */}
		</Container>
	);
}

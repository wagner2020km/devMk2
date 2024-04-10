/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';


//import { useSelector } from 'react-redux';
import { Buttom, ButtomWarning } from 'components/ui/Buttom';
import Container from '../../layout/Container';
import { inverteData } from '../../validacoes/DataBr';
//import { moneyMask } from '../../utils/cpfMask'
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { Spinner } from '../../components/Spinner/Spinner';
import getImgSemImagem from '../../assets/semImagem.jpeg';
import { numeroParaReal, numeroParaRealSemSifrao } from 'utils/maks';
import { decryptID } from '../../utils/encryptId';
import styles from './styles.module.scss';
import { detalhesPlanoMaquina, feesForPlan, getMachine, addRequestMachine } from '../../api/aquisicaoEquipamento';
import { FaBarcode } from 'react-icons/fa';
import { pegaDataAtual } from '../../validacoes/DataBr'

// MIU
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import AlertTitle from '@mui/material/AlertTitle';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Router from 'next/router';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';


import Image from 'next/image';
import { useSelector } from 'react-redux';
import { connect, useDispatch } from 'react-redux';


type PropsTypeDetalhes = {
	codinstituicao?: number,
	deleted?: number,
	descricao?: string,
	descricao_contratacao?: string,
	descricao_credito?: string,
	descricao_debito?: string,
	descricao_parcelado?: string,
	reccreatedon?: string,
	recmodifiedon?: string,
	seq_idpaquisicao_planos?: number,
	taxa_credito?: number,
	taxa_debito?: number,
	taxa_parcelado?: number,
	taxa_pix_app?: string,
	taxa_pix_maquininha_apos_1?: string,
	taxa_pix_maquininha_mes_1?: string,
	titulo?: string,
	url_image?: string,
	valor_contratacao?: number,
	modelo_contratacao?: string

}

export default function detalhesEquipamento({ idParam }) {

	const router = useRouter();
	const { id } = router.query;
	console.log('Id do plano', id);
	const baseUrl = window.location.origin;
	const user = useSelector((state: any) => state.userReducer.user);
	const dispatch = useDispatch();
	const [detalhesPlanoEquip, setDetalhesPlanoEquip] = useState<PropsTypeDetalhes>()
	const [abilitaContratarPlano, setAbilitaContratarPlano] = useState(false);
	const [changetaxa, setChangeTaxa] = useState('Visa');
	const [isLoading, setIsLoading] = useState(true);
	const [retornoConsultaInicial, setRetornoConsultaInicial] = useState(false);
	const [valorInputMaquininha, setValorInputMaquininha] = useState(0);
	const [valorInputMaquininhaSmart, setValorInputMaquininhaSmart] = useState(0);
	const [listTaxas, setListTaxas] = useState([]);
	const [listMachine, setListMachine] = useState([]);
	const [total, setTotal] = useState(0);
	const [totalAvista, setTotalAVista] = useState(0);
	const [checked, setChecked] = useState(false);
	const [enabledButtom, setEnabledButtom] = useState(true);
	const [open, setOpen] = useState(false);
	const [habiltaButtomTermo, setBabiltaButtomTermo] = useState(true)
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleAddValue = async (paramEquipamento: number) => {
		switch (paramEquipamento) {
			case 1:
				setValorInputMaquininha(valorInputMaquininha + 1);
				break;

			case 2:
				setValorInputMaquininhaSmart(valorInputMaquininhaSmart + 1);
				break;
			default:
				break;
		}
	}

	const handleRemoveValue = async (paramEquipamento: number) => {
		switch (paramEquipamento) {
			case 1:
				setValorInputMaquininha(valorInputMaquininha - 1);
				break;

			case 2:
				setValorInputMaquininhaSmart(valorInputMaquininhaSmart - 1);
				break;

			default:
				break;
		}
	}
	const handleDetalhes = async (idParam) => {

		try {
			const response = await detalhesPlanoMaquina(String(decryptID(idParam)));
			console.log('dados Planos', response);
			if (response.status == 200) {

				setDetalhesPlanoEquip(response.data);
				setIsLoading(false);
			} else {
				setRetornoConsultaInicial(true);
			}
			setIsLoading(false);
		} catch (error) {
			setRetornoConsultaInicial(true);
			console.log(error);
			setIsLoading(false);
		}

	}

	const handleFees = async (dataName, idBandeiraParam) => {
		setChangeTaxa(dataName);

		try {
			const response = await feesForPlan(decryptID(String(id)), String(idBandeiraParam));
			//console.log('retorna Taxas', response.data[0]);
			if (response.status == 200) {

				setListTaxas(response.data[0])
				setIsLoading(false);
			}
			setIsLoading(false);
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}

	}

	const handleMachine = async () => {
		setAbilitaContratarPlano(true);
		try {
			const response = await getMachine();
			//console.log('retorna Maquinas', response.data);
			if (response.status == 200) {

				setListMachine(response.data)
				setIsLoading(false);
			}
			setIsLoading(false);
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
	}

	const handleModal = () => {
		setOpen(!open)
	}

	const handleChange = (event) => {
		setChecked(event.target.checked);
		if (event.target.checked == true) {
			setEnabledButtom(false);
		} else {
			setEnabledButtom(true);
		}

		//console.log("O estado do checkbox mudou para:", event.target.checked);
	};

	const confirmTerm = async () => {
		setIsLoading(true);
		setOpen(false);

		const dataMachine = {
			"numero_conta_cliente": user.numeroConta,
			"id_plano": decryptID(String(id)),
			"usuario_id": user.id,
			"status_id": 6,
			"deleted": 0,
			"valor_plano": detalhesPlanoEquip?.valor_contratacao,
			"valor_com_maquina": detalhesPlanoEquip?.valor_contratacao,
			"equipamento": [
				{
					"idEquipamento": listMachine[0]?.seq_idmodelosequipamento,
					"quantidade": valorInputMaquininha
				},
				{
					"idEquipamento": listMachine[1]?.seq_idmodelosequipamento,
					"quantidade": valorInputMaquininhaSmart
				}

			]

		}
		try {
			const response = await addRequestMachine(dataMachine);
			//console.log('dados Planos', response);
			if (response.status == 200) {

				setDetalhesPlanoEquip(response.data);
				setIsLoading(false);
				Router.push({
					pathname: '/maquininhas'
				  });
			} else {
				setRetornoConsultaInicial(true);
				setIsLoading(false);
			}
		

			
		} catch (error) {
			setRetornoConsultaInicial(true);
			console.log(error);
			setIsLoading(false);
			setAbilitaContratarPlano(false);
			
		}
	}

	useEffect(() => {
		setValorInputMaquininha(0);
		setValorInputMaquininhaSmart(0);

	}, [])

	useEffect(() => {
		if (id) {
			handleDetalhes(id);
			handleFees(changetaxa, 1);
		}
	}, [id]);

	useEffect(() => {
		setTotalAVista((valorInputMaquininha * detalhesPlanoEquip?.valor_contratacao) + (valorInputMaquininhaSmart * detalhesPlanoEquip?.valor_contratacao))
		setTotal((valorInputMaquininha * detalhesPlanoEquip?.valor_contratacao) + (valorInputMaquininhaSmart * detalhesPlanoEquip?.valor_contratacao))
		console.log('valor aquis', valorInputMaquininha)
		if (valorInputMaquininha > 0 || valorInputMaquininhaSmart > 0) {
			setBabiltaButtomTermo(false);
		} else {
			setBabiltaButtomTermo(true)
		}
	}, [valorInputMaquininha, valorInputMaquininhaSmart])

	return (
		<Container>
			{retornoConsultaInicial ? (
				<Stack sx={{ width: '100%' }} spacing={2}>
					<Alert severity="error">
						<AlertTitle>ERRO</AlertTitle>
						Nehuma informação encontrada para o parametro, <strong>volte mais tarde!!</strong>
					</Alert>
				</Stack>
			) : (
				<section className={styles.containerTransferencia}>
					<div className={styles.cardLeft}>
						<div className={styles.titleContainer}>
							<FaBarcode size={24} color="#000" />
							<h3>Detalhes {detalhesPlanoEquip?.titulo}</h3>
						</div>
						<div className={styles.cardTransferencia}>
							{abilitaContratarPlano == false ? (
								<>
									<section className={styles.cardDetalhes}>
										<div className={styles.itensDetalhes}>
											<span className={styles.textGrayFull}>Modelo de contratação</span>
											<span className={styles.textBlackFull}>{detalhesPlanoEquip?.modelo_contratacao}</span>
										</div>
										<div className={styles.divider}></div>
										<div className={styles.itensDetalhes}>
											<span className={styles.textGrayFull}>Mensalidade à partir de</span>
											<div>
											
												<span className={styles.textSucess}>{numeroParaReal((detalhesPlanoEquip?.valor_contratacao))}</span>
											</div>
										</div>
										<div className={styles.divider}></div>
									</section>
									<div className={styles.textTitle}><h3>TAXAS NAS VENDAS POR PIX</h3></div>
									<section className={styles.cardDetalhes}>
										<div className={styles.itensDetalhes}>
											<span className={styles.textGrayFull}>Pix na maquininha no 1º mês</span>
											<span className={styles.textBlackFull}>{detalhesPlanoEquip?.taxa_pix_maquininha_mes_1}</span>
										</div>
										<div className={styles.divider}></div>
										<div className={styles.itensDetalhes}>
											<span className={styles.textGrayFull}>Pix na maquininha após 1º mês</span>
											<span className={styles.textBlackFull}>{detalhesPlanoEquip?.taxa_pix_maquininha_apos_1}</span>

										</div>
										<div className={styles.divider}></div>
										<div className={styles.itensDetalhes}>
											<span className={styles.textGrayFull}>Pix pelo app</span>
											<span className={styles.textBlackFull}>{detalhesPlanoEquip?.taxa_pix_app}</span>
										</div>
										<div className={styles.divider}></div>
									</section>
									<div className={styles.cardButtomAcoes}>
									<Button
											type="submit"
											variant="contained"
											color="warning"
											onClick={() => {
												Router.push({
													pathname: '/maquininhas'
												  });
												  setIsLoading(true)
											}}
										>
											Cancelar
										</Button>
										<Button
											type="submit"
											variant="contained"
											color="success"
											onClick={() => handleMachine()}
										>
											Selecionar Equipamentos
										</Button>
									</div>
								</>
							) : (
								<>
									<section className={styles.cardDetalhes}>
										<div className={styles.itensDetalhes}>
											<span className={styles.textGrayFull}>Quantas maquinas se negócio precisa?</span>
										</div>

										<div className={styles.contenerSelecionaMaquinas}>
											<div className={styles.detalhesMaquinas}>
												<h4>Maquininha Padrão</h4>
												<h5 className={styles.textomMaquinaUm}><span>{listMachine[0]?.valor ? numeroParaReal(detalhesPlanoEquip?.valor_contratacao) : numeroParaReal(detalhesPlanoEquip?.valor_contratacao)} á vista</span></h5>
												<h4 className={styles.textomMaquinaUm}>Valor unitário 12x de {listMachine[0]?.valor ? numeroParaReal((detalhesPlanoEquip?.valor_contratacao) / 12) : numeroParaReal(detalhesPlanoEquip?.valor_contratacao / 12)}</h4>
												<div className={styles.containerInput}>
													<Paper
														component="form"
														sx={{ p: '2px 2px ', display: 'flex', alignItems: 'center', width: 250 }}
													>
														<IconButton
															onClick={() => {
																if (valorInputMaquininha > 0) {
																
																	handleRemoveValue(1)
																}
															}}
															sx={{ p: '10px', backgroundColor: '#eee4e4' }} aria-label="menu">
															<RemoveIcon />
														</IconButton>
														<InputBase
															sx={{ p: '2px 4px ', ml: 9, flex: 1 }}
															placeholder="Quantidade"
															inputProps={{ 'aria-label': 'Quantidade' }}
															onChange={(e) => {

																setValorInputMaquininha(parseInt(e.target.value))



															}}
															value={valorInputMaquininha}
															type='numeric'
														/>
														<IconButton
															onClick={() => {
																handleAddValue(1)
																//setValorInputMaquininha(valorInputMaquininha + 1)
															}}
															type="button" sx={{ p: '10px', backgroundColor: '#eee4e4' }} aria-label="search">
															<AddIcon />
														</IconButton>

													</Paper>
												</div>
											</div>
											<div className={styles.imageMaquininha}>
												<Image
													className={styles.divImgLogo}
													src={listMachine[0]?.imagem ? listMachine[0]?.imagem : getImgSemImagem}
													alt="equipamento"
													width={80}
													height={165}
												/>
											</div>
										</div>
										<div className={styles.divider}></div>
										<div className={styles.contenerSelecionaMaquinas}>
											<div className={styles.detalhesMaquinas}>
												<h4>Maquininha Smart</h4>
												<h5 className={styles.textomMaquinaUm}><span>{listMachine[1]?.valor ? numeroParaReal(detalhesPlanoEquip?.valor_contratacao) : numeroParaReal(detalhesPlanoEquip?.valor_contratacao)} á vista</span></h5>
												<h4 className={styles.textomMaquinaUm}>Valor unitário 12x de {listMachine[1]?.valor ? numeroParaReal(detalhesPlanoEquip?.valor_contratacao / 12) : numeroParaReal(detalhesPlanoEquip?.valor_contratacao / 12)}</h4>
												<div className={styles.containerInput}>
													<Paper
														component="form"
														sx={{ p: '2px 2px ', display: 'flex', alignItems: 'center', width: 250 }}
													>
														<IconButton
															onClick={() => {
																if (valorInputMaquininhaSmart > 0) {

																	handleRemoveValue(2);
																}
															}}
															sx={{ p: '10px', backgroundColor: '#eee4e4' }} aria-label="menu">
															<RemoveIcon />
														</IconButton>
														<InputBase
															sx={{ p: '2px 4px ', ml: 9, flex: 1 }}
															placeholder="Search Google Maps"
															inputProps={{ 'aria-label': 'search google maps' }}
															onChange={(e) => setValorInputMaquininhaSmart(parseInt(e.target.value))}
															value={valorInputMaquininhaSmart}
														/>
														<IconButton
															onClick={() => {

																handleAddValue(2);
															}}
															type="button" sx={{ p: '10px', backgroundColor: '#eee4e4' }} aria-label="search">
															<AddIcon />
														</IconButton>
													</Paper>
												</div>
												<div className={styles.containerValores}>
													<h4>Total á vista <span className={styles.spanValor}>{valorInputMaquininha > 0 ? numeroParaReal(totalAvista) : 0}</span></h4>
													<h4>Parcelamento 12 x <span className={styles.spanValor}>{numeroParaReal(total)}</span></h4>
												</div>
											</div>
											<div className={styles.imageMaquininha}>
												<Image
													className={styles.divImgLogo}
													src={listMachine[1]?.imagem ? listMachine[1]?.imagem : getImgSemImagem}
													alt="equipamento"
													width={80}
													height={165}
												/>
											</div>
										</div>
										<div className={styles.cardButtomAcoes}>
											<Button
												type="submit"
												variant="contained"
												color="warning"
												disabled={false}
												onClick={() => setAbilitaContratarPlano(false)}
											>
												Voltar
											</Button>
											<Button
												type="submit"
												variant="contained"
												color="success"
												disabled={habiltaButtomTermo}
												onClick={handleModal}
											>
												Confirmar
											</Button>
										</div>
									</section>

								</>
							)}
						</div>
					</div>
					<div className={styles.cardRigth}>
						<div className={styles.titleContainer}>
							<FaBarcode size={24} color="#000" />
							<h3>Taxas por bandeiras</h3>
						</div>
						<div className={styles.cardTransferencia}>
							<section className={styles.cardDetalhes}>
								<div className={styles.itensDetalhesTaxas}>

									<button
										className={changetaxa == 'Visa' ? styles.buttomBandeirasAtiva : styles.buttomBandeiras}
										onClick={() => { handleFees('Visa', 1) }}
									>
										<span className={styles.textTipoTaxa}>Visa</span>
									</button>
									<button
										className={changetaxa == 'Master' ? styles.buttomBandeirasAtiva : styles.buttomBandeiras}
										onClick={() => { handleFees('Master', 2) }}
									>
										<span className={styles.textTipoTaxa}>Master</span>
									</button>
									<button
										className={changetaxa == 'Elo' ? styles.buttomBandeirasAtiva : styles.buttomBandeiras}
										onClick={() => { handleFees('Elo', 3) }}
									>
										<span className={styles.textTipoTaxa}>Elo</span>
									</button>
									<button
										className={changetaxa == 'Hiper' ? styles.buttomBandeirasAtiva : styles.buttomBandeiras}
										onClick={() => { handleFees('Hiper', 4) }}
									>
										<span className={styles.textTipoTaxa}>Hiper</span>
									</button>
									<button
										className={changetaxa == 'Amex' ? styles.buttomBandeirasAtiva : styles.buttomBandeiras}
										onClick={() => { handleFees('Amex', 5) }}
									>
										<span className={styles.textTipoTaxa}>Amex</span>
									</button>
								</div>
								<div className={styles.divider}></div>
								{listTaxas.map((row: any) => (
									<div key={row.seq_idtaxas_tabelas_planos} className={styles.itensTaxas}>
										<div className={styles.containerDataTaxas}>
											<span className={styles.textBlackFull}>{row.Descricao}</span>
										</div>
										<div className={styles.containerDataTaxas}>
											<span className={styles.textBlackFull}>{row.Bandeira}</span>
										</div>
										<div className={styles.containerDataTaxas}>
											<span className={styles.textGrayFull}>{numeroParaRealSemSifrao(row.valor)}%</span>
										</div>
									</div>
								))}
								<div className={styles.divider}></div>
							</section>
						</div>
					</div>
				</section>
			)}
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<Box
					sx={{
						width: '90%', // Defina a largura do modal como 90% da tela
						maxHeight: '90vh', // Defina a altura máxima do modal como 90% da altura da tela
						overflowY: 'auto', // Adicione uma barra de rolagem vertical, se necessário
						bgcolor: 'background.paper',
						boxShadow: 24,
						p: 4,
					}}
				>
					<div className={styles.containerSolicitacao}>
						<div className={styles.titleModal}>
							<h2>Detalhes da solicitação de equipamentos</h2>
						</div>
						<div className={styles.textSolicitante}>
							<h3>Solicitante: {user.name}</h3>
						</div>
						<div className={styles.containerDadossolicitacao}>
							<div className={styles.cardSolicitacao}>
								<div className={styles.titleSolicitacao}>
									<h4>Equipamentos</h4>
								</div>
								<div className={styles.CardQuantidadeEquip}>
									<span>
										{listMachine[0]?.modelo ? listMachine[0]?.modelo : ''}
									</span>

									<span>
										{valorInputMaquininha} Unidades
									</span>
								</div>
								<div className={styles.CardQuantidadeEquip}>
									<span>
										{listMachine[1]?.modelo ? listMachine[1]?.modelo : ''}
									</span>

									<span>
										{valorInputMaquininhaSmart} Unidades
									</span>
								</div>
							</div>
							<div className={styles.cardSolicitacao}>
								<div className={styles.titleSolicitacao}>
									<h4>Detalhes</h4>
								</div>
								<div className={styles.CardQuantidadeEquip}>
									<span>
										Data
									</span>
									<span>
										{pegaDataAtual()}
									</span>
								</div>
								<div className={styles.CardQuantidadeEquip}>
									<span>
										Total á vista
									</span>
									<span>
										{numeroParaReal(totalAvista)}
									</span>
								</div>
								<div className={styles.CardQuantidadeEquip}>
									<span>
										Parcelamento
									</span>
									<span>
										12 x {numeroParaReal(total)}
									</span>
								</div>
								<div className={styles.CardQuantidadeEquip}>
									<span>
										Forma de pagamento
									</span>
									<span>
										Parcelado
									</span>
								</div>
							</div>
						</div>
						<div className={styles.titleModal}>
							<h2>Termo de concessão</h2>
						</div>
						<div style={{ overflowY: 'auto', maxHeight: '200px', marginTop: '32px' }}>
							<p className={styles.textTermo}>
								Ao contrário do que se acredita, Lorem Ipsum não é simplesmente um texto randômico. Com mais de 2000 anos, suas raízes podem ser encontradas em uma obra de literatura latina clássica datada de 45 AC. Richard McClintock, um professor de latim do Hampden-Sydney College na Virginia, pesquisou uma das mais obscuras palavras em latim, consectetur, oriunda de uma passagem de Lorem Ipsum, e, procurando por entre citações da palavra na literatura clássica, descobriu a sua indubitável origem. Lorem Ipsum vem das seções 1.10.32 e 1.10.33 do "de Finibus Bonorum et Malorum" (Os Extremos do Bem e do Mal), de Cícero, escrito em 45 AC. Este livro é um tratado de teoria da ética muito popular na época da Renascença. A primeira linha de Lorem Ipsum, "Lorem Ipsum dolor sit amet..." vem de uma linha na seção 1.10.32.
								Ao contrário do que se acredita, Lorem Ipsum não é simplesmente um texto randômico. Com mais de 2000 anos, suas raízes podem ser encontradas em uma obra de literatura latina clássica datada de 45 AC. Richard McClintock, um professor de latim do Hampden-Sydney College na Virginia, pesquisou uma das mais obscuras palavras em latim, consectetur, oriunda de uma passagem de Lorem Ipsum, e, procurando por entre citações da palavra na literatura clássica, descobriu a sua indubitável origem. Lorem Ipsum vem das seções 1.10.32 e 1.10.33 do "de Finibus Bonorum et Malorum" (Os Extremos do Bem e do Mal), de Cícero, escrito em 45 AC. Este livro é um tratado de teoria da ética muito popular na época da Renascença. A primeira linha de Lorem Ipsum, "Lorem Ipsum dolor sit amet..." vem de uma linha na seção 1.10.32.
								Ao contrário do que se acredita, Lorem Ipsum não é simplesmente um texto randômico. Com mais de 2000 anos, suas raízes podem ser encontradas em uma obra de literatura latina clássica datada de 45 AC. Richard McClintock, um professor de latim do Hampden-Sydney College na Virginia, pesquisou uma das mais obscuras palavras em latim, consectetur, oriunda de uma passagem de Lorem Ipsum, e, procurando por entre citações da palavra na literatura clássica, descobriu a sua indubitável origem. Lorem Ipsum vem das seções 1.10.32 e 1.10.33 do "de Finibus Bonorum et Malorum" (Os Extremos do Bem e do Mal), de Cícero, escrito em 45 AC. Este livro é um tratado de teoria da ética muito popular na época da Renascença. A primeira linha de Lorem Ipsum, "Lorem Ipsum dolor sit amet..." vem de uma linha na seção 1.10.32.
								Ao contrário do que se acredita, Lorem Ipsum não é simplesmente um texto randômico. Com mais de 2000 anos, suas raízes podem ser encontradas em uma obra de literatura latina clássica datada de 45 AC. Richard McClintock, um professor de latim do Hampden-Sydney College na Virginia, pesquisou uma das mais obscuras palavras em latim, consectetur, oriunda de uma passagem de Lorem Ipsum, e, procurando por entre citações da palavra na literatura clássica, descobriu a sua indubitável origem. Lorem Ipsum vem das seções 1.10.32 e 1.10.33 do "de Finibus Bonorum et Malorum" (Os Extremos do Bem e do Mal), de Cícero, escrito em 45 AC. Este livro é um tratado de teoria da ética muito popular na época da Renascença. A primeira linha de Lorem Ipsum, "Lorem Ipsum dolor sit amet..." vem de uma linha na seção 1.10.32.
								Ao contrário do que se acredita, Lorem Ipsum não é simplesmente um texto randômico. Com mais de 2000 anos, suas raízes podem ser encontradas em uma obra de literatura latina clássica datada de 45 AC. Richard McClintock, um professor de latim do Hampden-Sydney College na Virginia, pesquisou uma das mais obscuras palavras em latim, consectetur, oriunda de uma passagem de Lorem Ipsum, e, procurando por entre citações da palavra na literatura clássica, descobriu a sua indubitável origem. Lorem Ipsum vem das seções 1.10.32 e 1.10.33 do "de Finibus Bonorum et Malorum" (Os Extremos do Bem e do Mal), de Cícero, escrito em 45 AC. Este livro é um tratado de teoria da ética muito popular na época da Renascença. A primeira linha de Lorem Ipsum, "Lorem Ipsum dolor sit amet..." vem de uma linha na seção 1.10.32.
								Ao contrário do que se acredita, Lorem Ipsum não é simplesmente um texto randômico. Com mais de 2000 anos, suas raízes podem ser encontradas em uma obra de literatura latina clássica datada de 45 AC. Richard McClintock, um professor de latim do Hampden-Sydney College na Virginia, pesquisou uma das mais obscuras palavras em latim, consectetur, oriunda de uma passagem de Lorem Ipsum, e, procurando por entre citações da palavra na literatura clássica, descobriu a sua indubitável origem. Lorem Ipsum vem das seções 1.10.32 e 1.10.33 do "de Finibus Bonorum et Malorum" (Os Extremos do Bem e do Mal), de Cícero, escrito em 45 AC. Este livro é um tratado de teoria da ética muito popular na época da Renascença. A primeira linha de Lorem Ipsum, "Lorem Ipsum dolor sit amet..." vem de uma linha na seção 1.10.32.
								Ao contrário do que se acredita, Lorem Ipsum não é simplesmente um texto randômico. Com mais de 2000 anos, suas raízes podem ser encontradas em uma obra de literatura latina clássica datada de 45 AC. Richard McClintock, um professor de latim do Hampden-Sydney College na Virginia, pesquisou uma das mais obscuras palavras em latim, consectetur, oriunda de uma passagem de Lorem Ipsum, e, procurando por entre citações da palavra na literatura clássica, descobriu a sua indubitável origem. Lorem Ipsum vem das seções 1.10.32 e 1.10.33 do "de Finibus Bonorum et Malorum" (Os Extremos do Bem e do Mal), de Cícero, escrito em 45 AC. Este livro é um tratado de teoria da ética muito popular na época da Renascença. A primeira linha de Lorem Ipsum, "Lorem Ipsum dolor sit amet..." vem de uma linha na seção 1.10.32.

								O trecho padrão original de Lorem Ipsum, usado desde o século XVI, está reproduzido abaixo para os interessados. Seções 1.10.32 e 1.10.33 de "de Finibus Bonorum et Malorum" de Cicero também foram reproduzidas abaixo em sua forma exata original, acompanhada das versões para o inglês da tradução feita por H
							</p>
							<div>
								<FormGroup>
									<FormControlLabel
										control={<Checkbox checked={checked} onChange={handleChange} />}
										label="Eu aceito os termos acima."
									/>
								</FormGroup>
								<div className={styles.buttomAceptTerm}>
									<div className={styles.contentButtom}>
										<Button
											type="submit"
											variant="contained"
											color="warning"
											onClick={() => { setOpen(false) }}
										>
											Cancelar
										</Button>
									</div>
									<div className={styles.contentButtom}>
										<Button
											type="submit"
											variant="contained"
											color="success"
											disabled={enabledButtom}
											onClick={confirmTerm}
										>
											Confirmar
										</Button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Box>
			</Modal>
			{isLoading ? <Spinner /> : null}
		</Container>
	);
}



import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import AlertTitle from '@mui/material/AlertTitle';
import { Spinner } from '../../components/Spinner/Spinner';
import Image from 'next/image';
import Link from 'next/link';
import { numeroParaReal, numeroParaRealSemSifrao } from 'utils/maks';
import { Buttom, ButtomSucces } from 'components/ui/Buttom';
import { encryptID } from '../../utils/encryptId';
import styles from './styles.module.scss';
import Router from 'next/router';
import getImg from '../../assets/globalPay/posmaquininha.jpg';
import { useEffect, useState } from 'react';

export function CardMaquininha(props) {


	const [optionModelo, setOptionModelo] = useState(0);
	const [modalIsOpen, setIsOpen] = useState(false);
	const minhaArray = props.dadosProps;

	//console.log('Dados aqui', minhaArray)


	return (

		<div>
			<FormControl>
				<RadioGroup
					row
					aria-labelledby="demo-row-radio-buttons-group-label"
					name="row-radio-buttons-group"
					onChange={(e) => {
						setOptionModelo(parseInt(e.target.value))
					}}
				//value={optionModelo}
				>
					{minhaArray.length > 0 ? (
						<>
							{minhaArray.map((element: any, index: any) => (
								<div key={index}>
									<div className={styles.containerCard} key={element.seq_idpaquisicao_planos}>
										<div className={styles.contentData}>
											<FormControlLabel
												value={element.seq_idpaquisicao_planos}
												control={<Radio style={{ color: 'green' }} />}
												label={element.titulo}
												sx={{
													color: 'green',
													fontWeight: 'bold',
												}}
											/>
											<div className={styles.smallDescricao}>
												<p>{element.descricao}</p>
											</div>
											<div className={styles.contentTaxas}>
												<div className={styles.cardTaxas}>
													<span className={styles.spanTaxas}>{element.taxa_debito}%</span>
													<span>{element.descricao_debito}</span>
												</div>
												<div className={styles.cardTaxas}>
													<span className={styles.spanTaxas}>{element.taxa_credito}%</span>
													<span>{element.descricao_credito}</span>
												</div>
												<div className={styles.cardTaxas}>
													<span className={styles.spanTaxas}>{element.taxa_parcelado}%</span>
													<span>{element.descricao_parcelado}</span>
												</div>
											</div>
											<div className={styles.cardDescricaoValores}>
												<span className={styles.spanValores}>Valor de contratação</span>
												<Image
													className={styles.divImgLogo}
													src={getImg}
													alt="logo"
													width={40}
													height={70}
												/>
											</div>
											<div>
												<p><span className={styles.spanTexValor}>Mensalidade</span><span> {(element.valor_contratacao).toFixed(2)}</span></p>
												<p>
													<span className={styles.spanAsteristicoDanger}>*</span>
													<span className={styles.spanTexValor}>isenção apartir de {numeroParaReal(element?.isencao_equipamento)} em vendas mensal por equipamento</span>
												</p>
											</div>
											<div className={styles.containerButtom}>
												<ButtomSucces
													color={optionModelo == element.seq_idpaquisicao_planos ? 'enabled' : 'disabled'}
													type="button"
													onClick={() => {
														setIsOpen(true);
														Router.push({
															pathname: '/detalhesEquipamento',
															query: { id: encryptID(element.seq_idpaquisicao_planos) }
														});
													}
													}
													loading={false}
													disabled={optionModelo == element.seq_idpaquisicao_planos ? false : true}
												>
													Detalhes{optionModelo == element.seq_idpaquisicao_planos ? optionModelo : ''}
												</ButtomSucces>
											</div>
										</div>
									</div>
								</div>
							))}
						</>
					)
						:
						(
							<Stack sx={{ width: '100%' }} spacing={2} textAlign={'center'}>
								<Alert severity="warning">
									<AlertTitle>Ops</AlertTitle>
									Nenhum plano encnotrado no mmomento, <strong>volte mais tarde!!</strong>
								</Alert>
							</Stack>
						)}
				</RadioGroup>
			</FormControl>
			{modalIsOpen ? <Spinner /> : null}
		</div >

	);
}

import React, { useState, useEffect } from 'react';

import Container from '../../layout/Container';

import { Spinner } from '../../components/Spinner/Spinner';
import { ButtomWarning } from '../../components/ui/Buttom';
import { FormCadastrarChavePix } from '../../components/FormCadastrarChavePix/FormCadastrarChavePix';
import Alert from '@mui/material/Alert';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { getListaChavesPix, removerChavePix } from '../../api/pix';

import { formatarCPFeCNPJ } from '../../utils/maks';
import { AxiosError } from 'axios';
import styles from './styles.module.scss';

export default function ChavesPix() {
	const [modalIsOpen, setIsOpen] = useState(false);
	const [listKey, setListKey] = useState([]);
	const [habiltaCadastroChave, setHabilitaCadastroChave] = useState(false);

	const handleChavePix = async () => {
		setIsOpen(true);
		try {
			const response = await getListaChavesPix();
			const keys = response?.data?.data?.body?.listKeys ?? [];

			setListKey(keys);

			setIsOpen(false);
		} catch (error) {
			console.log(error);
			//console.log('erro axios')
			if (error instanceof AxiosError) {
				console.log('erro do axios tratado aqui');
			} else {
				console.log('não foi');
			}
		}
	};

	const handleDeletaChavePix = async (paramChavePix: string) => {
		setIsOpen(true);
		try {
			const response = await removerChavePix(paramChavePix);
			if (response.status === 200) {
				const newList = listKey.filter((item) => item.key !== paramChavePix);
				setListKey(newList);
				setHabilitaCadastroChave(true);
			}
		} catch (error) {
			console.log('Erro delete', error);
		} finally {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		handleChavePix();
	}, []);

	return (
		<Container>
			<div className={styles.containerChavesPix}>
				<div className={styles.listarChavesPix}>
					<h4>Minhas chaves PIX</h4>
					<article>
						<table className={styles.tabelaChavesPix}>
							<thead>
								<tr className={styles.cabecalhoTabelaChavePix}>
									<th>Chave</th>
									<th>Tipo</th>
									<th>Excluir</th>
								</tr>
							</thead>
							{Object.keys(listKey).map((tem) => {
								const exam = listKey[tem];
								return (
									<tbody key={tem.toString()}>
										<tr className={styles.linhaTabelaChavePix}>
											<td className={styles.linhaChavePix}>
												{formatarCPFeCNPJ(exam.key)}
											</td>
											<td>{exam.keyType}</td>
											<td>
												<ButtomWarning
													type="button"
													onClick={() => handleDeletaChavePix(exam.key)}
													loading={false}
												>
													EXLUIR
												</ButtomWarning>
											</td>
										</tr>
									</tbody>
								);
							})}
						</table>
					</article>
				</div>
				<div className={styles.addChavePix}>

					<div>
						<h4>Cadastrar Nova Chave PIX</h4>

						<div>
							<FormCadastrarChavePix
								onFinish={() => {
									handleChavePix();
								}}
							/>
						</div>
					</div>
				</div>
			</div>
			{modalIsOpen ? <Spinner /> : ''}
		</Container>
	);
}

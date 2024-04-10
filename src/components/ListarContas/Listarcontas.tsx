/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';

import { useSelector } from 'react-redux';

import styles from './styles.module.scss';
import { setupAPIClient } from '../../services/api';
import BotaoOpcoesExtrato from '../../components/ui/BotaoOpcoesExtrato';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { InputFormBit } from '../ui/InputFormBit';
import { getExtratos } from '../../api/extrato';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ZoomIn from '@mui/icons-material/ZoomIn';
import Pagination from '../../components/Pagination/Pagination';
import { Spinner } from '../../components/Spinner/Spinner';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

type dadosInputGFormProps = {
	optionsearch: number;
	getOptionNome: string;
	getOptionCpfCnpj: string;
};

export function ListarContas() {
	const [selectOption, setSelectoption] = useState(0);
	const [getOptionSearch, setGetOptionSearch] = useState('');
	const [arraydataFom, setArrayDataForm] = useState<
		dadosInputGFormProps | []
	>();
	const [modalIsOpen, setIsOpen] = useState(false);
	const [perPage, setPerPage] = useState(2);
	const [totalDataFull, setTotalDataFull] = useState(0);
	const [quantytiPage, setQuantytiPage] = useState(0);
	const [actualPage, setActualPage] = useState(1);
	const [nextPage, setNextPage] = useState(0);
	const [backNextPage, setBackNextPage] = useState(0);
	const [showDataItensPage, setShowDataItensPage] = useState(0);
	const [typeSearch, setTypeSearch] = useState('');
	const [listKeyExtrato, setListKeyExtrato] = useState([]);

	const user = useSelector((state: any) => state.userReducer.user);
	const apiClient = setupAPIClient();

	const limitPage = 5;
	const schema = yup.object().shape({
		optionsearch: yup.number().integer().required('Tipo chave é obrigatório'),

		getOptionNome: yup
			.string()
			.when('optionsearch', (optionsearch: any[], schema) => {
				if (optionsearch[0] == 1) {
					setSelectoption(optionsearch[0]);
					return schema.required('Nome do cliente e obrigatório');
				}
			}),

		getOptionCpfCnpj: yup
			.string()
			.when('optionsearch', (optionsearch: any[], schema) => {
				if (optionsearch[0] == 2) {
					setSelectoption(optionsearch[2]);
					return schema.required('Documento do cliente e obrigatório');
				}
			}),
	});

	const {
		control,
		setValue,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<dadosInputGFormProps>({
		mode: 'onChange',
		resolver: yupResolver(schema),
	});

	const optionsKeyPix = [
		{ value: 1, label: 'Nome cliente' },
		{ value: 2, label: 'Cpf ou Vnpj' },
	];

	async function handleSearchContas() {}

	const handleSearchConta = async (data) => {
		setIsOpen(true);
		console.log('Dados do form', data);
		setArrayDataForm(data);
		//setIsOpen(true);
		try {
			const response = await getExtratos(
				user.numeroConta,
				typeSearch,
				limitPage,
				actualPage,
				'',
				''
			);
			console.log('response', response);
			const keys = response?.data?.data ?? [];
			const getPerPage = response?.data.perpage ?? 0;
			const getTotalPage = response?.data.totalPages ?? 0;
			const getTotalData = response?.data.total ?? 0;
			const actualPageNow = response?.data.currentPage ?? 0;
			const getnextPage = response?.data.nextPageNumber ?? 0;
			const getbackNextPage = response?.data.prevPageNumber ?? 0;
			const getShowCountDataPagePage = response?.data.count ?? 0;

			setPerPage(getPerPage);
			setTotalDataFull(getTotalData);
			setQuantytiPage(getTotalPage);
			setNextPage(getnextPage);
			setBackNextPage(getbackNextPage);
			setShowDataItensPage(getShowCountDataPagePage);
			setListKeyExtrato(keys);
			setIsOpen(false);
		} catch (error) {
			console.log(error);
			setIsOpen(false);
		}
	};

	useEffect(() => {
		handleSearchConta(arraydataFom);
	}, [actualPage]);

	return (
		<div className={styles.contantListarContas}>
			{modalIsOpen ? <Spinner /> : ''}
			<form
				onSubmit={handleSubmit(handleSearchConta)}
				className={styles.formContafisica}
			>
				<section className={styles.sectionForm}>
					<div className={styles.inputGroupForm}>
						<label>Tipo de pesquisa</label>
						<Controller
							control={control}
							name="optionsearch"
							render={({ field: { onChange, onBlur, value } }) => (
								<Select
									options={optionsKeyPix}
									className={styles.selectInput}
									value={optionsKeyPix.find((c) => c.value === value)}
									onChange={(val) => {
										onChange(val.value);
										setGetOptionSearch(val.value.toString());
									}}
								/>
							)}
						/>
						{errors.optionsearch && (
							<p className={styles.erroInputForm}>
								{errors.optionsearch?.message}
							</p>
						)}
					</div>
					{getOptionSearch == '1' && (
						<div className={styles.inputGroupForm}>
							<label>Digite o nome do cliente</label>
							<Controller
								control={control}
								name="getOptionNome"
								render={({ field: { onChange, onBlur, value } }) => (
									<InputFormBit
										placeholder="Nome"
										type="text"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
									/>
								)}
							/>
							{errors.getOptionNome && (
								<p className={styles.erroInputForm}>
									{errors.getOptionNome?.message}
								</p>
							)}
						</div>
					)}
					{getOptionSearch == '2' && (
						<div className={styles.inputGroupForm}>
							<label>Digite o cpf do cliente</label>
							<Controller
								control={control}
								name="getOptionCpfCnpj"
								render={({ field: { onChange, onBlur, value } }) => (
									<InputFormBit
										placeholder="cpf"
										type="text"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
									/>
								)}
							/>
							{errors.getOptionCpfCnpj && (
								<p className={styles.erroInputForm}>
									{errors.getOptionCpfCnpj?.message}
								</p>
							)}
						</div>
					)}
					<div className={styles.inputGroupForm}>
						<BotaoOpcoesExtrato
							onClick={handleSubmit(handleSearchConta)}
							typeIcon={'YoutubeSearchedFor'}
							textButtom="Pesquisar"
							stateButtom={false}
						/>
					</div>
				</section>
			</form>

			<div className={styles.itensTable}>
				<body>
					<table className={styles.tabelaListarcontas}>
						<thead>
							<tr>
								<th>Nome</th>
								<th>Sigla</th>
								<th>Editar</th>
								<th>Encerrar</th>
							</tr>
						</thead>
						<tbody className={styles.bodyTable}>
							{listKeyExtrato.map((item, index) => {
								return (
									<tr key={index} className={styles.itensTable}>
										<td className={styles.tdNome}>{item.nome}</td>
										<td className={styles.tdGeral}>{item.sigla}</td>
										<td className={styles.tdGeral}>
											<IconButton aria-label="delete" color="success">
												<ZoomIn />
											</IconButton>
										</td>
										<td className={styles.tdGeral}>
											<IconButton aria-label="delete" color="error">
												<DeleteIcon />
											</IconButton>
										</td>
									</tr>
								);
							})}
							<footer className={styles.paginationContainer}>
								<div className={styles.containerDetailsPagination}>
									<div>
										<h4>
											{showDataItensPage} de {totalDataFull}, pagina{' '}
											{actualPage}
										</h4>
									</div>
								</div>
								<div className={styles.containerLinkPagination}>
									<Pagination
										limit={limitPage}
										total={totalDataFull}
										offset={actualPage}
										nextPage={nextPage}
										backNextPage={backNextPage}
										totalOfPage={quantytiPage}
										setOffset={setActualPage}
									/>
								</div>
							</footer>
						</tbody>
					</table>
				</body>
			</div>
		</div>
	);
}

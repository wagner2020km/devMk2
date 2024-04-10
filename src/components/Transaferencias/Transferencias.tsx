/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';

import styles from './styles.module.scss';

import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';

import { InputFormBit } from '../../components/ui/InputFormBit';
import { SelectInputBit } from '../../components/ui/InputFormBit';
import { MaskInput } from '../../components/ui/InputFormBit';

interface TransferenciasPropos {
	tipo?: string;
	valorTr: string;
}

type dadosInputGFormProps = {
	nomeBanco: string;
	agencia: string;
	conta: string;
	nomeFavorecido: string;
	docFavorecido: string;
	addFavodecido: boolean;
	tipoConta: string;
	tipoTransacao: string;
	finalidade: string;
	descricao: string;
	agendamento: string;
	valorTransferencia: string;
};

const schema = yup.object().shape({
	nomeBanco: yup.string().required('* Valor $ obrigatório'),
	valorTransferencia: yup.string().required('* Banco e obrigatório'),
	agencia: yup.string().required('* Agência é obrigatório'),
	conta: yup.string().required('* Conta é obrigatório'),
	nomeFavorecido: yup.string().max(50).required('* Nome é obrigatório'),
	docFavorecido: yup.string().required('* CPF/CNPJ é obrigatório'),
	addFavodecido: yup.boolean(),
	tipoConta: yup.string().required('* Tipo é obrigatório'),
	tipoTransacao: yup.string().required('* Transação é obrigatório'),
	finalidade: yup.string(),
	descricao: yup.string(),
	agendamento: yup.string().required('* Campo obrigatório'),
});

export function Transferencias({
	tipo,
	valorTr,
	...rest
}: TransferenciasPropos) {
	//const [paramBanco, setParamBanco] = useState('');
	//const [getValorTransacao, setGetValorTRansacao] = useState('');

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<dadosInputGFormProps>({
		resolver: yupResolver(schema),
	});

	const optionsBancos = [
		{ value: 1, label: 'Banco do Brasil' },
		{ value: 2, label: 'Banco Inter' },
		{ value: 3, label: 'Nunbank' },
		{ value: 4, label: 'Caixa Económica federal' },
	];

	const optionsTipoConta = [
		{ value: 1, label: 'Conta poupança' },
		{ value: 2, label: 'Conta corrente' },
	];

	const optionsTipoTransacao = [
		{ value: 1, label: 'Ted' },
		{ value: 2, label: 'Doc' },
		{ value: 2, label: 'Pix' },
	];
	//  console.log('errors', errors)
	//  function onSubmitHandler: SubmitHandler<dadosInputGFormProps> = (data){
	//  console.log('errors', data)
	//  }

	const handleTransfer: SubmitHandler<dadosInputGFormProps> = async (data) => {
		console.log('dados', data);
	};

	return (
		<div>
			<form onSubmit={handleSubmit(handleTransfer)}>
				<Controller
					control={control}
					name="valorTransferencia"
					render={({ field: { onChange, onBlur, value } }) => (
						<input
							type="text"
							onChange={onChange}
							onBlur={onBlur}
							value={valorTr}
							hidden={false}
							id="boldCheckbox"
						/>
					)}
				/>
				{errors.valorTransferencia && (
					<p className={styles.erroInputForm}>
						{errors.valorTransferencia?.message}
					</p>
				)}
				<section className={styles.containerTransferencia}>
					<div className={styles.tituloGroup}>
						<h5>Dados bancários</h5>
					</div>
					<div className={styles.iputGroup}>
						<div className={styles.containerInut}>
							<label>Nome do banco</label>

							<Controller
								control={control}
								name="nomeBanco"
								render={({ field: { onChange, onBlur, value } }) => (
									<SelectInputBit
										placeholder="Digite seu email"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
									>
										{optionsBancos.map((opt) => (
											<option value={opt.value}>{opt.label}</option>
										))}
									</SelectInputBit>
								)}
							/>

							{errors.nomeBanco && (
								<p className={styles.erroInputForm}>
									{errors.nomeBanco?.message}
								</p>
							)}
						</div>
						<div className={styles.containerInut}>
							<label>Agência</label>
							<Controller
								control={control}
								name="agencia"
								render={({ field: { onChange, onBlur, value } }) => (
									<InputFormBit
										placeholder="Agência"
										type="text"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
									/>
								)}
							/>
							{errors.agencia && (
								<p className={styles.erroInputForm}>
									{errors.agencia?.message}
								</p>
							)}
						</div>
						<div className={styles.containerInut}>
							<label>Conta</label>
							<Controller
								control={control}
								name="conta"
								render={({ field: { onChange, onBlur, value } }) => (
									<InputFormBit
										placeholder="Conta"
										type="text"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
									/>
								)}
							/>
							{errors.conta && (
								<p className={styles.erroInputForm}>{errors.conta?.message}</p>
							)}
						</div>
					</div>

					<div className={styles.tituloGroup}>
						<h5>Para quem ?</h5>
					</div>
					<div className={styles.iputGroup}>
						<div className={styles.containerInut}>
							<label>Nome do favorecido</label>
							<Controller
								control={control}
								name="nomeFavorecido"
								render={({ field: { onChange, onBlur, value } }) => (
									<InputFormBit
										placeholder="Nome favorecido"
										type="text"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
									/>
								)}
							/>
							{errors.nomeFavorecido && (
								<p className={styles.erroInputForm}>
									{errors.nomeFavorecido?.message}
								</p>
							)}
						</div>
						<div className={styles.containerInut}>
							<label>CPF/CNPJ</label>
							<Controller
								control={control}
								name="docFavorecido"
								render={({ field: { onChange, onBlur, value } }) => (
									<MaskInput
										mask="999.999.999-99"
										placeholder="CPF/CNPJ"
										type="text"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
									/>
								)}
							/>
							{errors.docFavorecido && (
								<p className={styles.erroInputForm}>
									{errors.docFavorecido?.message}
								</p>
							)}
						</div>
					</div>

					<div className={styles.iputGroupCheck}>
						<div>
							<input
								className={styles.inputG}
								{...register('addFavodecido')}
								placeholder="addFavodecido"
								type="checkbox"
								name="addFavodecido"
							/>
						</div>

						<label>Adicionar aos favoritos</label>
					</div>

					<div className={styles.tituloGroup}>
						<h5>Detalhes da transferência ?</h5>
					</div>
					<div className={styles.iputGroup}>
						<div className={styles.containerInut}>
							<label>Tipo de conta</label>
							<Controller
								control={control}
								name="tipoConta"
								render={({ field: { onChange, onBlur, value } }) => (
									<SelectInputBit
										placeholder="Tipo de conta"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
									>
										{optionsTipoConta.map((opt) => (
											<option value={opt.value}>{opt.label}</option>
										))}
									</SelectInputBit>
								)}
							/>
							{errors.tipoConta && (
								<p className={styles.erroInputForm}>
									{errors.tipoConta?.message}
								</p>
							)}
						</div>
						<div className={styles.containerInut}>
							<label>Tipo de transação</label>
							<Controller
								control={control}
								name="tipoTransacao"
								render={({ field: { onChange, onBlur, value } }) => (
									<SelectInputBit
										placeholder="Tipo transação"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
									>
										{optionsTipoTransacao.map((opt) => (
											<option value={opt.value}>{opt.label}</option>
										))}
									</SelectInputBit>
								)}
							/>
							{errors.tipoTransacao && (
								<p className={styles.erroInputForm}>
									{errors.tipoTransacao?.message}
								</p>
							)}
						</div>
					</div>

					<div className={styles.iputGroup}>
						<div className={styles.containerInut}>
							<label>Finalidade</label>
							<Controller
								control={control}
								name="finalidade"
								render={({ field: { onChange, onBlur, value } }) => (
									<MaskInput
										mask=""
										placeholder="Finalidade"
										type="text"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
									/>
								)}
							/>
						</div>
						<div className={styles.containerInut}>
							<label>Descrição</label>
							<Controller
								control={control}
								name="descricao"
								render={({ field: { onChange, onBlur, value } }) => (
									<MaskInput
										mask=""
										placeholder="Descrição"
										type="text"
										onChange={onChange}
										onBlur={onBlur}
										value={value}
									/>
								)}
							/>
						</div>
					</div>

					<div className={styles.tituloGroup}>
						<h5>Transferir quando? ?</h5>
					</div>
					<div className={styles.iputGroupCheck}>
						<div>
							<input
								type="radio"
								name="agendamento"
								value="1"
								{...register('agendamento')}
								placeholder="agendamento"
								// required
							/>
							<label>Hoje ou no próximo dia útil</label>
						</div>

						<div>
							<input
								type="radio"
								name="agendamento"
								value="2"
								{...register('agendamento')}
								placeholder="agendamento"
								// required
							/>
						</div>

						<label>Agendar</label>
					</div>
					{errors.agendamento && (
						<p className={styles.erroInputForm}>
							{errors.agendamento?.message}
						</p>
					)}
				</section>

				<button type="submit">Sign in</button>
			</form>
		</div>
	);
}

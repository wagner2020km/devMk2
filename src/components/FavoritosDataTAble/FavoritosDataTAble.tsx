/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useCallback } from 'react';

import styles from './styles.module.scss';
import DataTable from 'react-data-table-component';

import { Buttom, ButtomWarning } from '../../components/ui/Buttom';

const ExpandedComponent = ({ data }) => (
	<pre>{JSON.stringify(data, null, 2)}</pre>
);
export function FavoritosDataTAble() {
	const [list, setList] = useState({});

	const columns = [
		{
			name: 'Nome',
			selector: (row) => row.title,
			sortable: true,
		},
		{
			name: 'Descrição',
			selector: (row) => row.description,
		},
		{
			name: 'Banco',
			selector: (row) => row.bank,
		},
	];

	const dataList = [
		{
			id: 1,
			title: 'Wagner Silva',
			description: 'conta pessoal',
			bank: 'Inter S.A',
		},
		{
			id: 2,
			title: 'José Dias',
			description: 'contas a pagar',
			bank: 'C6 Bank S.A',
		},
		{
			id: 4,
			title: 'Maria Lucia',
			description: 'compras',
			bank: 'Nu Bank S.A',
		},
		{
			id: 5,
			title: 'Maria Lucia',
			description: 'compras',
			bank: 'Nu Bank S.A',
		},
		{
			id: 6,
			title: 'Maria Lucia',
			description: 'compras',
			bank: 'Nu Bank S.A',
		},
		{
			id: 7,
			title: 'Maria Lucia',
			description: 'compras',
			bank: 'Nu Bank S.A',
		},
		{
			id: 8,
			title: 'Maria Lucia',
			description: 'compras',
			bank: 'Nu Bank S.A',
		},
		{
			id: 9,
			title: 'Maria Lucia',
			description: 'compras',
			bank: 'Nu Bank S.A',
		},
		{
			id: 10,
			title: 'Maria Lucia',
			description: 'compras',
			bank: 'Nu Bank S.A',
		},
		{
			id: 11,
			title: 'Maria Lucia',
			description: 'compras',
			bank: 'Nu Bank S.A',
		},
		{
			id: 12,
			title: 'Maria Lucia',
			description: 'compras',
			bank: 'Nu Bank S.A',
		},
	];

	const [selectedRows, setSelectedRows] = useState([]);
	const [toggleCleared, setToggleCleared] = useState(false);
	const [data, setData] = useState(dataList);

	const handleRowSelected = useCallback((state) => {
		setSelectedRows(state.selectedRows);
	}, []);

	const contextActions = React.useMemo(() => {
		const handleDelete = () => {
			let deletData = data;
			selectedRows.forEach((itemSelected) => {
				console.log('id do registro', itemSelected.id);
				console.log('id do registro', itemSelected.id);
				deletData = data.filter((item) => item.id !== itemSelected.id);
			});
			console.log('novo registro', deletData);
			if (
				window.confirm(
					`Are you sure you want to delete:\r ${selectedRows.map((r) => r.id)}?`
				)
			) {
				const reciveDeletData = selectedRows.map((r) => r.id);

				// let deletData = data.filter( (item) => item.id !== reciveDeletData[0])
				setData(deletData);
				alert(deletData);
				setToggleCleared(!toggleCleared);
				//setData(differenceBy(data, selectedRows, 'title'));
			}
		};

		return (
			<>
				<ButtomWarning
					onClick={handleDelete}
					style={{ backgroundColor: 'red' }}
				>
					Adicionar
				</ButtomWarning>
			</>
		);
	}, [data, selectedRows, toggleCleared]);

	function handleChangeList(event) {
		const newData = data.filter((row) => {
			return row.title
				.toLocaleLowerCase()
				.includes(event.target.value.toLocaleLowerCase());
		});

		console.log(event.target.value);
		if (event.target.value === '') {
			setData(dataList);
		} else {
			setData(newData);
		}
	}

	return (
		<div className={styles.container}>
			<div className={styles.inputSearch}>
				<input type="text" onChange={handleChangeList} />
			</div>
			<div>
				<DataTable
					title="teste"
					columns={columns}
					data={data}
					selectableRows
					contextActions={contextActions}
					onSelectedRowsChange={handleRowSelected}
					clearSelectedRows={toggleCleared}
					pagination
				/>
			</div>
		</div>
	);
}

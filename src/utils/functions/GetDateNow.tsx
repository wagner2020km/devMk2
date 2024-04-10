const GetDateNoW = () => {
	let dataTexto = '';
	const dataTra = new Date();
	dataTra.setDate(dataTra.getDate());
	const dayOfWeek = dataTra.toLocaleDateString('pt-BR', { weekday: 'long' });
	const dayOfMonth = dataTra.getDate();
	const montfMonth = dataTra.getMonth() + 1;
	const year = dataTra.getFullYear();
	let diaComZero = '';
	let mesComZero = '';

	if (Number(dayOfMonth) <= 9) {
		diaComZero = `0${dayOfMonth}`;
	} else {
		diaComZero = `${dayOfMonth}`;
	}
	if (Number(montfMonth) <= 9) {
		mesComZero = `0${montfMonth}`;
	} else {
		mesComZero = `${montfMonth}`;
	}
	dataTexto = `${dayOfWeek} ${diaComZero}/${mesComZero}/${year}`;

	return dataTexto;
};

export default GetDateNoW;

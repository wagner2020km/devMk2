const GetTime = () => {
	let timeText = '';
	const hoje = new Date();
	const hora = hoje.getHours();
	const minuto = hoje.getMinutes();
	const segundo = hoje.getSeconds();
	//console.log("Ano:",ano+", Mês:",mes+", Dia:",dia+", Hora:",hora+", Minuto:",minuto+", Segundo:",segundo);
	timeText = `${hora}:${minuto}:${segundo}`;
	return timeText;
};

export default GetTime;

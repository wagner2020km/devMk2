import { format, parseISO, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';


export const validaDataBr = (dataParam: string) => {
	const dataTra = new Date(dataParam);
	dataTra.setDate(dataTra.getDate());

	const dayOfWeek = dataTra.toLocaleDateString('pt-BR', { weekday: 'long' });
	const dayOfMonth = dataTra.getDate();
	const monthMonth = dataTra.toLocaleDateString('pt-BR', { month: 'long' });
	const year = dataTra.getFullYear();

	const dataAtual = new Date();
	//let dataAtual = format(dataAtual, 'yyyy-MM-dd');
	let tituloStrDate = `${
		dayOfWeek[0].toLocaleUpperCase() + dayOfWeek.substring(1)
	}, ${dayOfMonth + 1} de ${monthMonth} de ${year}`;
	dataAtual.setHours(0, 0, 0, 0);
	dataTra.setHours(0, 0, 0, 0);
	if (dataAtual.getDate() == dataTra.getDate()) {
		tituloStrDate = 'Hoje';
	}

	return tituloStrDate;
};

export const validaDataBrExtrato = (dataParam: string) => {

	const dataTra = parseISO(dataParam);
	const dataAtual = new Date();
	
	if (isToday(dataTra)) {
        return 'Hoje';
    //} else if (isYesterday(dataTra)) {
       // return 'Ontem';
    } else {
        const formattedDate = format(dataTra, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
        return formattedDate;
    }

};

export const pegaDataAtual = () => {
	const date = new Date();
	console.log('Data atual', format(date, 'dd/MM/yyyy'));

	return format(date, 'dd/MM/yyyy');
};

export const pegaApenasData = (data) => {
	
	return format(parseISO(data), 'yyyy-MM-dd');
};

export const inverteData = (data) => {
	console.log('data recebe', data);
	//return format(data, 'yyyy-MM-dd');
	const dataRecebida = data;
	const dataconvertida = dataRecebida.split('/').reverse().join('-');
	return dataconvertida;
	//console.log('data acabei de formatar', dataconvertida);
};


import { format, parseISO, addHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { utcToZonedTime } from 'date-fns-tz';

export const validaDiaDoMes = (dataParam: string) => {
  const dataTra = parseISO(dataParam);
  const dataTraLocal = utcToZonedTime(dataTra, 'America/Sao_Paulo' as any);

  const dayOfWeek = format(dataTraLocal, 'EEEE', { locale: ptBR });
  const dayOfMonth = format(dataTraLocal, 'd', { locale: ptBR });
  const monthMonth = format(dataTraLocal, 'MMMM', { locale: ptBR });
  const year = format(dataTraLocal, 'yyyy', { locale: ptBR });
  //const hourMinuteSecond = format(dataTraLocal, 'HH:mm:ss', { locale: ptBR });
  const dataTraLocalAdicionada = addHours(dataTraLocal, 3);

  const hourMinuteSecondAdicionada = format(dataTraLocalAdicionada, 'HH:mm:ss', { locale: ptBR });
  const dataAtual = new Date();
  let tituloStrDate = `${dayOfWeek}, ${dayOfMonth} de ${monthMonth} de ${year}`;

  dataAtual.setHours(0, 0, 0, 0);
  dataTraLocal.setHours(0, 0, 0, 0);

  if (dataParam === format(dataAtual, 'yyyy-MM-dd')) {
    tituloStrDate = `Hoje às ${hourMinuteSecondAdicionada}`;
  }

  console.log('horas br', dataTraLocal);

  return tituloStrDate;
};

export const pegaHoraMinuto = (data: any) => {

  const dataTra = parseISO(data);
  const dataTraLocal = utcToZonedTime(dataTra, 'America/Sao_Paulo' as any);
  const dataTraLocalAdicionada = addHours(dataTraLocal, 3);
  const hourMinuteSecondAdicionada = format(dataTraLocalAdicionada, 'HH:mm:ss', { locale: ptBR });

  return 'ás ' + hourMinuteSecondAdicionada;
}

export const dataUsaParaBr = (dataAmericana: any) => {

  const dataHora = parseISO(dataAmericana);
  const dataHoraBrasileira = utcToZonedTime(dataHora, 'America/Sao_Paulo');
  const dataHoraFormatada = format(dataHoraBrasileira, "dd/MM/yyyy HH:mm:ss", { locale: ptBR });

  return dataHoraFormatada;
}

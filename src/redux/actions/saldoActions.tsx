export const SET_DATA = 'SET_SALDO_DATA';
export const RESET_DATA = 'RESET_SALDO_DATA';

export const setSaldoData = (saldo: number) => ({
	type: SET_DATA,
	saldo: saldo,
});

export const resetSaldoData = () => ({
	type: RESET_DATA,
});

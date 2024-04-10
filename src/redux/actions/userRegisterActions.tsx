export const SET_DATA = 'USER_SET_USER_REGISTER_DATA';
export const SET_FIELD = 'USER_SET_USER_REGISTER_FIELD';
export const RESET_DATA = 'USER_RESET_USER_REGISTER_DATA';

export const setUserRegisterData = (user: object) => ({
	type: SET_DATA,
	user: user,
});

export const setUserRegisterField = (field: string, value: string) => ({
	type: SET_FIELD,
	field: field,
	value: value,
});

export const resetUserRegisterData = () => ({
	type: RESET_DATA,
});

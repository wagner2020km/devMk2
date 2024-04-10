export const SET_DATA = 'USER_SET_USER_RECOUVER_DATA';
export const SET_FIELD = 'USER_SET_USER_RECOUVER_FIELD';
export const RESET_DATA = 'USER_RESET_USER_RECOUVER_DATA';

export const setUserRecouverData = (user: object) => ({
	type: SET_DATA,
	user: user,
});

export const setUserRecouverField = (field: string, value: string) => ({
	type: SET_FIELD,
	field: field,
	value: value,
});

export const resetUserRecouverData = () => ({
	type: RESET_DATA,
});

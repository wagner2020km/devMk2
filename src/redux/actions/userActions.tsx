export const SET_DATA = 'USER_SET_USER_DATA';
export const RESET_DATA = 'USER_RESET_USER_DATA';

export const setUserData = (user: object) => ({
	type: SET_DATA,
	user: user,
});

export const reset = () => ({
	type: RESET_DATA,
});

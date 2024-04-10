export class AuthTokenError extends Error {
	constructor() {
		super('Erro necessário autenticar token.');
	}
}

import {
	GetServerSideProps,
	GetServerSidePropsContext,
	GetServerSidePropsResult,
} from 'next';
import { parseCookies } from 'nookies';

// função para paginas que só pode ser acessadas para visitantes

export function canSSRGest<P>(fn: GetServerSideProps<P>) {
	return async (
		ctx: GetServerSidePropsContext
	): Promise<GetServerSidePropsResult<P>> => {
		// Se o usuario tentar acessar uma pagina mas já tiver logado redireciona para a home

		const cookies = parseCookies(ctx);

		if (cookies['@nextauth.token']) {
			return {
				redirect: {
					destination: '/home',
					permanent: false,
				},
			};
		}
		return await fn(ctx);
	};
}

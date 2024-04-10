import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Router from 'next/router';
import { parseCookies, destroyCookie } from 'nookies';
import { GetServerSideProps } from 'next';
import { useMediaQuery } from 'usehooks-ts';

import { Menu } from '../Menu';
import { Header } from '../Header';
import { DadosHeader } from '../DadosHeader';
import { Rodape } from '../Rodape';
import { canSSRAuth } from '../../utils/canSSRAuth';
import styles from './styles.module.scss';

interface ContainerProps {
	children?: React.ReactNode;
	mostrarBarraSatatus?: boolean;
}

import { reset as resetDataUser } from '../../redux/actions/userActions';
import { resetSaldoData } from '../../redux/actions/saldoActions';
import { resetUserRegisterData } from '../../redux/actions/userRegisterActions';

const Container: React.FC<ContainerProps> = ({
	children,
	mostrarBarraSatatus = true,
}) => {
	const isMobile = useMediaQuery('(max-width: 600px)');
	const [showMenu, setShowMenu] = useState(isMobile ? false : true);
	const dispatch = useDispatch();

	const user = useSelector((state: any) => state.userReducer.user);
	const cookies = parseCookies();
	const token = cookies['@nextauth.token'];

	if (!token) {
		dispatch(resetDataUser());
		dispatch(resetSaldoData());
		dispatch(resetUserRegisterData());
		destroyCookie(undefined, '@nextauth.token');
		destroyCookie(undefined, '@nextauth.refreshToken');
		destroyCookie(undefined, '@nextauth.expiresIn');
		Router.push('/');
	}

	return (
		<>
			{token ? (
				<>
					<Header setShowMenu={setShowMenu} showMenu={showMenu} />
					<div className={styles.containerMain}>
						<div className={styles.containerRow}>
							<Menu showMenu={showMenu} />
							<div className={styles.containerBody}>
								<div style={{ height: 62 }} />
								{mostrarBarraSatatus && user && (
									<DadosHeader nameHeader={user?.name ?? ''} />
								)}
								{children}
								<div className={styles.containerFooter}>
									<Rodape />
								</div>
							</div>
						</div>
					</div>
				</>
			) : (
				<></>
			)}
		</>
	);
};

export default Container;

export const getServerSideProps: GetServerSideProps = canSSRAuth(async () => {
	return {
		props: {},
	};
});

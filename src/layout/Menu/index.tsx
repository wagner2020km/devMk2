import React, { useContext } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { AiOutlineArrowLeft } from 'react-icons/ai';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';

import IconsBith from '../../lib/IconsBith';

import { AuthContext } from '../../contexts/AuthContext';
import { useMediaQuery } from 'usehooks-ts';

import styles from './styles.module.scss';
import getImg from 'assets';

export function Menu({ showMenu }: { showMenu: boolean }): React.JSX.Element {
	const { signOut, user } = useContext(AuthContext);
	const router = useRouter();
	const isMobile = useMediaQuery('(max-width: 600px)');
	const currentUrl = router.asPath;

	function handleSingOut() {
		signOut();
	}

	return (
		<>
			<div
				className={
					isMobile
						? `${
								showMenu
									? styles.containerMenuMobile
									: styles.containerMenuMobileOut
						  }`
						: styles.containerMenu
				}
			>
				{isMobile && (
					<Image
						className={styles.divImgLogo}
						src={getImg('logo.png')}
						alt="logo"
					/>
				)}

				<Link className={styles.linkMenu} href="/home">
					<Image
						className={styles.iconesBith}
						src={
							currentUrl === '/home'
								? IconsBith.ICONBITH.inicio
								: IconsBith.ICONBITH.inicio_branco
						}
						alt="Logo - SVG"
						width="20"
						height="20"
					/>
					{currentUrl === '/home' ? (
						<span className={styles.labelTextMenuAtivo}>Inicío</span>
					) : (
						<span className={styles.labelTextMenuInativo}>Inicío</span>
					)}
				</Link>

				 <Link className={styles.linkMenu} href="/logistas">
				<Image
					className={styles.iconesBith}
					src={
						currentUrl === '/logistas'
							? IconsBith.ICONBITH.cartoes_menu_azul
							: IconsBith.ICONBITH.cartoes_menu
					}
					alt="Logo - SVG"
					width="20"
					height="20"
				/>
				{currentUrl === '/logistas' ? (
					<span className={styles.labelTextMenuAtivo}>Logistas</span>
				) : (
					<span className={styles.labelTextMenuInativo}>Logistas</span>
				)}
			</Link> 

				<Link className={styles.linkMenu} href="/saldo">
					{currentUrl === '/saldo' ? (
						<AccountBalanceWalletOutlinedIcon style={{ color: '#1b75ce' }} />
					) : (
						<AccountBalanceWalletOutlinedIcon style={{ color: '#a0a2a5' }} />
					)}
					{currentUrl === '/saldo' ? (
						<span className={styles.labelTextMenuAtivo}>Saldos</span>
					) : (
						<span className={styles.labelTextMenuInativo}>Saldos</span>
					)}
				</Link>

				<Link className={styles.linkMenu} href="/transferencia">
					<Image
						className={styles.iconesBith}
						src={
							currentUrl === '/transferencia'
								? IconsBith.ICONBITH.investimento_azul
								: IconsBith.ICONBITH.investimento
						}
						alt="Logo - SVG"
						width="20"
						height="20"
					/>
					{currentUrl === '/transferencia' ? (
						<span className={styles.labelTextMenuAtivo}>Transferência</span>
					) : (
						<span className={styles.labelTextMenuInativo}>Transferência</span>
					)}
				</Link>

				<Link className={styles.linkMenu} href="/perfil">
					<Image
						className={styles.iconesBith}
						src={
							currentUrl === '/perfil'
								? IconsBith.ICONBITH.usuario
								: IconsBith.ICONBITH.usuario
						}
						alt="Logo - SVG"
						width="20"
						height="20"
					/>
					{currentUrl === '/perfil' ? (
						<span className={styles.labelTextMenuAtivo}>Perfil</span>
					) : (
						<span className={styles.labelTextMenuInativo}>Perfil</span>
					)}
				</Link>

				{/* <Link className={styles.linkMenu} href="/home">
				<Image
					className={styles.iconesBith}
					src={
						currentUrl === '/beneficios'
							? IconsBith.ICONBITH.beneficios_azul
							: IconsBith.ICONBITH.beneficios
					}
					alt="Logo - SVG"
					width="20"
					height="20"
				/>
				{currentUrl === '/beneficios' ? (
					<span className={styles.labelTextMenuAtivo}>Benefícios</span>
				) : (
					<span className={styles.labelTextMenuInativo}>Benefícios</span>
				)}
			</Link>


			<Link className={styles.linkMenu} href="/contas">
				<Image
					className={styles.iconesBith}
					src={
						currentUrl === '/contas'
							? IconsBith.ICONBITH.beneficios_azul
							: IconsBith.ICONBITH.beneficios
					}
					alt="Logo - SVG"
					width="20"
					height="20"
				/>
				{currentUrl === '/contas' ? (
					<span className={styles.labelTextMenuAtivo}>Contas</span>
				) : (
					<span className={styles.labelTextMenuInativo}>Contas</span>
				)}
			</Link> */}

				<button className={styles.linkButtomMenu} onClick={handleSingOut}>
					<AiOutlineArrowLeft size={16} />
					<span className={styles.labelTextMenu}>Sair</span>
				</button>
			</div>
		</>
	);
}

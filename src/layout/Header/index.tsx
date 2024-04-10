import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

import { useSelector, useDispatch } from 'react-redux';

import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { useMediaQuery } from 'usehooks-ts';

import { getSaldo } from 'api/carteira';

import { setSaldoData } from 'redux/actions/saldoActions';

import { numeroParaReal } from 'utils/maks';

import getImg from 'assets';

import ImgAvatar from 'assets/geral/pngwing.com.png';

import styles from './styles.module.scss';

export function Header({
	setShowMenu,
	showMenu,
}: {
	setShowMenu: any;
	showMenu: boolean;
}) {
	const [habilitaSaldo, setHabilitaSaldo] = useState(true);
	const dispatch = useDispatch();

	const user = useSelector((state: any) => state.userReducer.user);
	const saldo = useSelector((state: any) => state.saldoReducer.saldo);
	const [saldoConta, SetSaldoConta] = useState(0)

	const isMobile = useMediaQuery('(max-width: 600px)');

	function chengeSaldo() {
		setHabilitaSaldo((prev) => (!prev ? true : false));
	}

	const getSaldoApi = useCallback(async () => {
		try {
			const response = await getSaldo();
			if (response.data.status === 401 && response?.data?.data?.total) {
				dispatch(setSaldoData(response?.data?.data?.total ?? 0));
				SetSaldoConta(response?.data?.data?.total ?? 0);
			}
			if (response.data.status === 200 && response?.data?.data?.total) {
				dispatch(setSaldoData(response?.data?.data?.total ?? 0));
				SetSaldoConta(response?.data?.data?.total ?? 0);
			}
		} catch (error) {
			console.log(error);
		}
	}, [dispatch]);

	useEffect(() => {
		getSaldoApi();
	}, [getSaldoApi]);

	return (
		<div className={styles.containerHeader}>
			<div className={styles.containerEsquerdo}>
				<div className={styles.containerLogo}>
					{!isMobile ? (
						<>
							<Image
								className={styles.divImgLogo}
								src={getImg('logo.png')}
								alt="logo"
							/>
						</>
					) : (
						<button
							className={styles.buttomIcon}
							style={{ marginLeft: 10 }}
							onClick={() => isMobile && setShowMenu((prev: boolean) => !prev)}
						>
							{showMenu ? <MenuOpenIcon /> : <MenuIcon />}
						</button>
					)}
				</div>
				{!isMobile && (
					<div className={styles.containerInput}>
						{/*
						<input
							className={styles.inputHeader}
							placeholder="O que você está proucurando"
						/>
						*/}
					</div>
				)}
			</div>

			<div className={styles.containerDireito}>
				<div className={styles.containerSaldo}>
					<label className={styles.labelSaldo}>Saldo</label>
					<span>{habilitaSaldo ? numeroParaReal(saldoConta) : '*********'}</span>
				</div>
				<div className={styles.iconeSaldo}>
					<button className={styles.buttomIcon} onClick={chengeSaldo}>
						{habilitaSaldo ? (
							<AiFillEyeInvisible size={23} />
						) : (
							<AiFillEye size={23} />
						)}
					</button>
				</div>

				<div className={styles.containerAvataImg}>
					<Image className={styles.divImgAvatar} src={ImgAvatar} alt="logo" />
				</div>

				<div className={styles.containerMenuAcoes}>
					<label className={styles.nameCliente}>{user?.name ?? ''}</label>
				</div>
				{/*
					<div className={styles.containerchat}>
						<Link className={styles.containerIcon} href="/">
							<MdChat size={23} />
						</Link>
					</div>

					<div className={styles.containerchat}>
						<Link className={styles.containerIcon} href="/configuracoes">
							<MdOutlineSettings size={23} />
						</Link>
					</div>
				*/}
			</div>
		</div>
	);
}

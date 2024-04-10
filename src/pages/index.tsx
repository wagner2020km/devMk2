import { useContext, FormEvent, useState } from 'react';

import Link from 'next/link';
import Router from 'next/router';
import { toast } from 'react-toastify';

import ContainerCadastro from '../layout/ContainerCadastro';

import styles from './main.module.scss';

import { Input } from '../components/ui/Input';
import { Buttom, ButtonOutline } from '../components/ui/Buttom';

import { AuthContext } from '../contexts/AuthContext';

import { verificaEmail } from '../validacoes/validarMascaras';

export default function Home() {
	const { signIn } = useContext(AuthContext);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	async function handleLogin(event: FormEvent) {
		event.preventDefault();

		if (!verificaEmail(email) || password === '') {
			toast.error('Usuário e senha requerido', {
				position: 'top-center',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: false,
				draggable: true,
				progress: undefined,
				theme: 'colored',
				pauseOnFocusLoss: false,
			});
		} else {
			setLoading(true);
			const data = {
				email: email,
				password: password,
			};
			try {
				await signIn(data);
			} catch (err) {
				console.log(err);
			} finally {
				setLoading(false);
			}
		}
	}

	return (
		<ContainerCadastro isResgister={false}>
			<div className={styles.containerCenter}>
				<div className={styles.login}>
					<form onSubmit={handleLogin}>
						<Input
							placeholder="Digite seu email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>

						<Input
							placeholder="Digite sua senha"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>

						<Buttom type="submit" loading={loading} disabled={loading}>
							ACESSAR
						</Buttom>
					</form>
				</div>
				{/*
				<Link className={styles.textCadastrese} href="/cadastrarConta">
					Não possui uma conta?
				</Link>
				*/}
				<Link className={styles.textCadastrese} href="/recoverPassword">
					Esqueceu sua senha?
				</Link>
				<br />
				<ButtonOutline onClick={() => Router.push('/cadastrarConta')}>
					RECUPERAR SENHA
				</ButtonOutline>
			</div>
		</ContainerCadastro>
	);
}

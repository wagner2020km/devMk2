/* eslint-disable no-undef */
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../redux/store/';
import { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

import { AuthProvider } from '../contexts/AuthContext';

import config from '../constants/project';

import '../../styles/globals.scss';

import '../../styles/globalsAnncora.scss';
import '../../styles/globalsBitHive.scss';
import '../../styles/globalsGlobalPay.scss';

import 'react-toastify/dist/ReactToastify.css';

import CustomHead from 'layout/CustomHead';

const ThemeSelector = ({ children }) => {
	let themeClass = '';
	let nameIcon = '';
	let title = '';
	if (config?.nameProject === 'bithive') {
		themeClass = 'bithive-theme';
		nameIcon = 'bithive.png';
		title = 'BitHive';
	} else if (config?.nameProject === 'anncora') {
		themeClass = 'anncora-theme';
		nameIcon = 'anncora.png';
		title = 'Anncora';
	} else if (config?.nameProject === 'globalPay') {
		themeClass = 'globalPay-theme';
		nameIcon = 'globalPay.png';
		title = 'GlobalPay';
	}
	return (
		<div className={themeClass}>
			<CustomHead iconPath={nameIcon} title={title} />
			{children}
		</div>
	);
};

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ThemeSelector>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<AuthProvider>
						<Component {...pageProps} />
						<ToastContainer autoClose={3000} />
					</AuthProvider>
				</PersistGate>
			</Provider>
		</ThemeSelector>
	);
}

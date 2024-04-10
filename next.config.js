/** @type {import('next').NextConfig} */
let config;
try {
	config = require('./config.js');
} catch (error) {
	config = {};
}
const nextConfig = {
	output: 'standalone',
	reactStrictMode: true,
	images: {
		domains: ['www.globalpaysolucoes.com.br', 'localhost'],
	  },
	env: {
		// eslint-disable-next-line no-undef
		PROJECT: config?.PROJECT || 'bithive',
		PRODUCTION: config?.PRODUCTION || false,
	},
};

module.exports = nextConfig;

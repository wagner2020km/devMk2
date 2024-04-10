/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { NextAuthOptions } from 'next-auth';

import CredentialsProvider from 'next-auth/providers/credentials';

import { setupAPIClient } from '../../services/api';

const apiClient = setupAPIClient();
export default NextAuth({
	providers: [
		CredentialsProvider({
			// The name to display on the sign in form (e.g. 'Sign in with...')
			name: 'bith-bank-web',
			// The credentials is used to generate a suitable form on the sign in page.
			// You can specify whatever fields you are expecting to be submitted.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
				email: {
					label: 'email',
					type: 'email',
					placeholder: 'jsmith@example.com',
				},
				password: {
					label: 'Password',
					type: 'password',
				},
			},
			async authorize(credentials, req) {
				const payload = {
					email: credentials.email,
					password: credentials.password,
				};

				console.log('AUTORIZAÇÃO ');

				console.log('dados acesso ', payload);
				try {
					const response = await apiClient.post('/login', payload);
					//const user = await response.data.usuario_conta;
					const user = await response.data.usuario_conta;
				//	console.log('USUARIO LOGANDO AQUI', user);
					const { token, expire_in } = response.data;
					return user;
				} catch (error) {
					console.log(error);
					return null;
				}

				/*
          const res = await fetch('https://cloudcoders.azurewebsites.net/api/tokens', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const {token, expire_in} = await response.data;
          const user = await response.data;
          if (!response.data.nome) {
            throw new Error(user.message);
          }
          // If no error and we have user data, return it
          if (response.data.nome && user) {
            return user;
          }

          // Return null if user data could not be retrieved
          return null;
          */
			},
		}),
		// ...add more providers here
	],
	/*
    secret: process.env.JWT_SECRET,
    pages: {
      signIn: '/login',
    },
    callbacks: {
      async jwt({ token, user, account }) {
        if (account && user) {
          return {
            ...token,
            accessToken: 'user.token',
            refreshToken: 'user.refreshToken',
          };
        }

        return token;
      },



      async session({ session, token }) {

        session.user.name = 'wagner';
        session.user.email = 'token.refreshToken';
      //  session.user.accessTokenExpires = token.accessTokenExpires;

        return session;
      },
    },
    theme: {
      colorScheme: 'auto', // "auto" | "dark" | "light"
      brandColor: '', // Hex color code #33FF5D
      logo: '/logo.png', // Absolute URL to image
    },
    // Enable debug messages in the console if you are having problems
    debug: process.env.NODE_ENV === 'development',
    */
});

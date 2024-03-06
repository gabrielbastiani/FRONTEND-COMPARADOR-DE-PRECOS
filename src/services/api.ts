import { AuthTokenError } from './errors/AuthTokenError';

import { signOut } from '@/contexts/AuthContext';  
import axios, { AxiosError } from 'axios'
import { parseCookies } from 'nookies'


export function setupAPIClient(ctx = undefined) {
    const cookies = parseCookies(ctx);

    const api = axios.create({
        baseURL: 'http://localhost:3333',
        headers: {
            Authorization: `Bearer ${cookies['@comparador.token']}`
        }
    })

    api.interceptors.response.use(response => {
        return response;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    }, (error: AxiosError) => {/* @ts-ignore */
        if (error.response.status === 401) {
            // qualquer erro 401 (nao autorizado) devemos deslogar o usuario
            // eslint-disable-next-line valid-typeof
            if (typeof window !== undefined) {
                // Chamar a funçao para deslogar o usuario
                signOut();
            } else {
                return Promise.reject(new AuthTokenError())
            }
        }

        return Promise.reject(error);

    })

    return api;

}
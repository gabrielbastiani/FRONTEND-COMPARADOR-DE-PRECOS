import Router from 'next/router';
import { toast } from 'react-toastify';

import { AuthTokenError } from './errors/AuthTokenError';

import axios, { AxiosError } from 'axios';
import { destroyCookie, parseCookies } from 'nookies';


export function setupAPIClient() {

    function signOut() {
        try {
            destroyCookie(undefined, '@comparador.token')
            Router.push('/login')
        } catch {
            toast.error('Erro ao deslogar!')
            console.log('erro ao deslogar')
        }
    }

    const cookies = parseCookies();

    const api = axios.create({
        baseURL: 'http://localhost:3333',
        headers: {
            Authorization: `Bearer ${cookies['@comparador.token']}`
        }
    })

    api.interceptors.response.use(response => {
        return response;
    }, (error: AxiosError) => {
        if (error.response) {
            if (error.response.status === 401) {
            
                if (typeof window !== 'undefined') {
                    signOut();
                } else {
                    return Promise.reject(new AuthTokenError())
                }
            }
        }

        return Promise.reject(error);

    })

    return api;

}
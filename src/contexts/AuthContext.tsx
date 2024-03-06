"use client"

/* eslint-disable @typescript-eslint/ban-ts-comment */
import Router from 'next/router';
import { createContext, ReactNode, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { api } from '../services/apiClient';

import { destroyCookie, setCookie, parseCookies } from 'nookies';


type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
}

type UserProps = {
  id: string;
  photo: string;
  name: string;
  email: string;
}

type SignInProps = {
  email: string;
  password: string;
}

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut() {
  try {
    destroyCookie(undefined, '@comparador.token')
    Router.push('/login')
  } catch {
    toast.error('Erro ao deslogar!')
    console.log('erro ao deslogar')
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>()
  const isAuthenticated = !!user;

  useEffect(() => {

    // tentar pegar algo no cookie
    const { '@comparador.token': token } = parseCookies();

    if (token) {
      api.get('/me').then(response => {
        const { id, photo, name, email } = response.data;

        setUser({
          id,
          photo,
          name,
          email
        })

      })

    }

  }, [])

  async function signIn({ email, password }: SignInProps) {
    try {
      const response = await api.post('/session', {
        email,
        password
      })
      // console.log(response.data);

      const { id, photo, name, token } = response.data;

      setCookie(undefined, '@comparador.token', token, {
        maxAge: 60 * 60 * 24 * 30, // Expirar em 1 mes
        path: "/" // Quais caminhos terao acesso ao cookie
      })

      setUser({
        id,
        photo,
        name,
        email,
      })

      //Passar para proximas requisiçoes o nosso token
      api.defaults.headers['Authorization'] = `Bearer ${token}`

      toast.success('Logado com sucesso!')

      //Redirecionar o user para /dashboard
      Router.push('/dashboard')


    } catch (err) {
      toast.error("Erro ao acessar, confirmou seu cadastro em seu email?")
      console.log("Erro ao acessar, confirmou seu cadastro em seu email? ", err)
    }
  }

  return (/* @ts-ignore */
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
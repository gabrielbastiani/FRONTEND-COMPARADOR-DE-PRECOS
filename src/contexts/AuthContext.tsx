'use client'

import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { api } from '../services/apiClient';

import { destroyCookie, setCookie, parseCookies } from 'nookies';


type AuthContextData = {
  user?: UserProps;
  isAuthenticated: boolean;
  loadingRequests: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
}

type UserProps = {
  id: string;
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

export function AuthProvider({ children }: AuthProviderProps) {

  const router = useRouter();

  const [user, setUser] = useState<UserProps>();
  const [loadingRequests, setLoadingRequests] = useState<boolean>(true);
  const isAuthenticated = !!user;

  useEffect(() => {

    const { '@comparador.token': token } = parseCookies();

    if (token) {
      api.get('/me').then(response => {
        const { id, name, email } = response.data;

        setUser({
          id,
          name,
          email
        })

      });

    }

    setLoadingRequests(false);

  }, []);

  async function signIn({ email, password }: SignInProps) {
    try {
      const response = await api.post('/session', {
        email,
        password
      });

      const { id, name, token } = response.data;

      setCookie(undefined, '@comparador.token', token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/"
      });

      setUser({
        id,
        name,
        email,
      });

      api.defaults.headers['Authorization'] = `Bearer ${token}`

      toast.success('Logado com sucesso!');

      setLoadingRequests(false);

      router.push('/');

    } catch (err) {
      toast.error("Erro ao acessar, confirmou seu cadastro em seu email?");
      console.log("Erro ao acessar, confirmou seu cadastro em seu email? ", err);
    }
  }

  function signOut() {
    try {
      destroyCookie(undefined, '@comparador.token');
      setLoadingRequests(false);
      router.push('/login');
    } catch {
      toast.error('Erro ao deslogar!');
      console.log('erro ao deslogar');
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, loadingRequests }}>
      {children}
    </AuthContext.Provider>
  )
}
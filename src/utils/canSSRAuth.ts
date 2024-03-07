import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { AuthTokenError } from '../services/errors/AuthTokenError';

import { parseCookies, destroyCookie } from 'nookies';


//funcao para paginas que só users logados podem ter acesso.
/* @ts-ignore */
export function canSSRAuth<P>(fn: GetServerSideProps<P>){/* @ts-ignore */
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);    

    const token = cookies['@comparador.token'];

    if(!token){
      return{
        redirect:{
          destination: '/login',
          permanent: false,
        }
      }
    }

    try{
      return await fn(ctx);
    }catch(err){
      if(err instanceof AuthTokenError){
        destroyCookie(ctx, '@comparador.token');

        return{
          redirect:{
            destination: '/login',
            permanent: false
          }
        }

      }
    }


  }

}
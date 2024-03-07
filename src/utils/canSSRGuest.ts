import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { parseCookies } from 'nookies';

//funcao para paginas que só pode ser acessadas por visitantes
/* @ts-ignore */
export function canSSRGuest<P>(fn: GetServerSideProps<P>) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

    const cookies = parseCookies(ctx);

    // Se o cara tentar acessar a pagina porem tendo já um login salvo redirecionamos
    if(cookies['@comparador.token']){
      return {
        redirect:{
          destination: '/',
          permanent: false,
        }
      }
    }

    return await fn(ctx);
  }

}
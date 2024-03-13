"use client"

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState, useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from 'react-toastify';

import { Button } from '@/components/Button/page';
import { Input } from '@/components/Input/page';

import logoLoginImg from '../../../public/logo.png';
import { setupAPIClient } from '../../services/api';
import styles from './styles.module.css';


export default function RecoveryPassword() {

    const router = useRouter();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [userValid, setUserValid] = useState(false);
    const captcha = useRef(null);


    async function handleRecover(event: FormEvent) {
        event.preventDefault();

        try {
            if (captcha.current !== null) {/* @ts-ignore */
                if (captcha.current.getValue()) {
                    console.log('Usuario válido!')
                    setUserValid(true)
                } else {
                    console.log('Por favor, acerte o recaptcha!')
                    toast.error('Por favor, acerte o recaptcha!')

                    return;
                }
            }


            if (email === '') {
                toast.warning('Digite seu e-mail!')
                return;
            }

            setLoading(true);

            const apiClient = setupAPIClient();
            await apiClient.post('/recovery_email', {
                email: email
            });

            toast.success('Verifique sua caixa de e-mail');
            toast.warning('NÃO DEIXE DE VERIFICAR O SPAN OU LIXEIRA!!!');

        } catch (err) {
            console.log(err);
            toast.error('Erro ao enviar e-mail!');
        }

        setLoading(false);

        router.push('/login');

    }

    const onChange = () => {
        if (captcha.current !== null) {/* @ts-ignore */
            if (captcha.current?.getValue()) {
                console.log('Usuario não é um robo!');
            }
        }
    }



    return (
        <>
            <Head>
                <title>Recuperar minha senha - Comparador de preços SUMIG</title>
            </Head>
            <div className={styles.containerCenter}>
                <Image src={logoLoginImg} alt="Logo SUMIG" />

                <div className={styles.login}>
                    <form className={styles.form} onSubmit={handleRecover}>
                        <Input
                            placeholder='Digite seu email cadastrado'
                            type='text'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <div className={styles.recaptcha}>
                            <ReCAPTCHA
                                ref={captcha}
                                sitekey="6LfEo7wiAAAAALlmW4jdxPw4HQ-UH5NNCDatw8ug"
                                onChange={onChange}
                            />
                        </div>

                        {!userValid &&
                            <Button
                                type="submit"
                                loading={loading}
                            >
                                Enviar solicitação
                            </Button>
                        }
                    </form>

                    <Link href="/signup">
                        Não possui uma conta? Cadastre-se
                    </Link>

                </div>
            </div>
        </>
    )
}
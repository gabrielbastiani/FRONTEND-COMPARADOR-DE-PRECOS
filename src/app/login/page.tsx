"use client"

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, FormEvent, useState, useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from 'react-toastify';

import { Button } from '@/components/Button/page';
import { Input } from '@/components/Input/page';

import logoLoginImg from '../../../public/logo.png';
import styles from '../login/styles.module.css';

import { AuthContext } from '@/contexts/AuthContext';


export default function Login() {

    const { signIn } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const captcha = useRef(null);


    async function handleLogin(event: FormEvent) {
        event.preventDefault();

        if (captcha.current !== null) {/* @ts-ignore */
            if (captcha.current.getValue()) {
                console.log('Usuario válido!');
            } else {
                console.log('Por favor, acerte o recaptcha!');
                toast.error('Por favor, acerte o recaptcha!');

                return;
            }
        }
        
        if (email === '' || password === '') {
            toast.warning('Preencha os campos! (Email e Senha)');
            return;
        }

        setLoading(true);

        const data = {
            email,
            password
        }

        await signIn(data)

        setLoading(false)

    }

    const onChange = () => {
        if (captcha.current !== null) {/* @ts-ignore */
            if (captcha.current.getValue()) {
                console.log('Usuario não é um robo!')
            }
        }
    }



    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <div className={styles.containerCenter}>
                <Image src={logoLoginImg} width={200} height={150} alt="Logo SUMIG" />

                <div className={styles.login}>
                    <form className={styles.form} onSubmit={handleLogin}>
                        <Input
                            placeholder='Digite seu email'
                            type='text'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Input
                            placeholder='Digite sua senha'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <div className={styles.recaptcha}>
                            <ReCAPTCHA
                                ref={captcha}
                                sitekey="6LfEo7wiAAAAALlmW4jdxPw4HQ-UH5NNCDatw8ug"
                                onChange={onChange}
                            />
                        </div>

                        <Button
                            type="submit"
                            loading={loading}
                        >
                            Acessar
                        </Button>

                    </form>

                    <Link href="/signup">
                        Não possui uma conta? Cadastre-se
                    </Link>

                    <Link href="/recoveryPassword">
                        Esqueceu sua senha?
                    </Link>

                </div>
            </div>
        </>
    )
}
"use client"

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react'
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from 'react-toastify'

import { Button } from '@/components/Button/page';
import { Input } from '@/components/Input/page';
import LoadingRequests from '@/components/LoadingRequests/page';

import logoImg from '../../../public/logo.png';
import styles from '../signup/styles.module.css';

import { setupAPIClient } from '@/services/api';


export default function SignUp() {

    const apiClient = setupAPIClient();
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const captcha = useRef(null);


    function isEmail(email: string) {
        return /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email)
    }

    async function handleRegister() {
        setLoading(true);
        try {
            if (captcha.current !== null) {/* @ts-ignore */
                if (captcha.current.getValue()) {
                    console.log('Usuario válido!')
                } else {
                    console.log('Por favor, acerte o recaptcha!');
                    toast.error('Por favor, acerte o recaptcha!');

                    setLoading(false);

                    return;
                }
            }

            if (name === '' || email === '' || password === '') {
                toast.warning('Preencha todos os campos!')
                console.log("Preencha todos os campos!");
                setLoading(false);
                return;
            }

            if (!isEmail(email)) {

                toast.error('Por favor digite um email valido!');

                setLoading(false);

                return;
            }

            await apiClient.post('/create_user', {
                name: name,
                email: email,
                password: password
            });

            setName("");
            setEmail("");
            setPassword("");

            toast.success('Conta criada com sucesso!!!');

            setLoading(false);

            router.push('/');

        } catch (error) {
            toast.error('Erro ao cadastrar!');
            /* @ts-ignore */
            console.log(error.response.data);
            setLoading(false);
        }

    }

    const onChange = () => {
        if (captcha.current !== null) {/* @ts-ignore */
            if (captcha.current.getValue()) {
                console.log('Usuario não é um robo!');
            }
        }
    }



    return (
        <>
            {loading ?
                <LoadingRequests />
                :
                <>
                    <div className={styles.containerCenter}>
                        <Image src={logoImg} width={200} height={150} alt="Logo SUMIG" />

                        <div className={styles.login}>
                            <h1>Crie sua conta</h1>

                            <div className={styles.form}>

                                <Input
                                    placeholder="Digite seu nome"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />

                                <Input
                                    placeholder="Digite seu email"
                                    type="email"
                                    name='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <Input
                                    placeholder="Sua senha"
                                    type="password"
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
                                    onClick={handleRegister}
                                >
                                    Cadastrar
                                </Button>

                            </div>

                            <Link href="/login">
                                Já possui uma conta? Faça login!
                            </Link>
                        </div>
                    </div>
                </>
            }
        </>
    )
}
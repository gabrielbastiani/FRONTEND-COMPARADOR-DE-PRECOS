"use client"

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState, useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from 'react-toastify';

import { Button } from '@/components/Button/page';
import { Input } from '@/components/Input/page';
import LoadingRequests from '@/components/LoadingRequests/page';

import logoLoginImg from '../../../public/logo.png';
import { setupAPIClient } from '../../services/api';
import styles from './styles.module.css';


export default function RecoveryPassword() {

    const router = useRouter();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [userValid, setUserValid] = useState(false);
    const captcha = useRef(null);

    function isEmail(email: string) {
        return /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email)
    }


    async function handleRecover(event: FormEvent) {

        setLoading(true);

        event.preventDefault();

        try {
            if (captcha.current !== null) {/* @ts-ignore */
                if (captcha.current.getValue()) {
                    console.log('Usuario válido!');
                    setUserValid(true);
                } else {
                    setLoading(false);
                    console.log('Por favor, acerte o recaptcha!');
                    toast.error('Por favor, acerte o recaptcha!');

                    return;
                }
            }


            if (email === '') {
                toast.warning('Digite seu e-mail!');
                setLoading(false);
                return;
            }

            if (!isEmail(email)) {

                toast.error('Por favor digite um email valido!');

                setLoading(false);

                return;
            }

            const apiClient = setupAPIClient();
            await apiClient.post('/recovery_email', {
                email: email
            });

            toast.success('Verifique sua caixa de e-mail');
            toast.warning('NÃO DEIXE DE VERIFICAR O SPAN OU LIXEIRA!!!');

            setLoading(false);

            router.push('/login');

        } catch (err) {
            console.log(err);
            toast.error('Erro ao enviar e-mail!');
            setLoading(false);
        }

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
            {loading ?
                <LoadingRequests />
                :
                <>
                    <div className={styles.containerCenter}>
                        <Image src={logoLoginImg} width={200} height={150} alt="Logo SUMIG" />

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
            }
        </>
    )
}
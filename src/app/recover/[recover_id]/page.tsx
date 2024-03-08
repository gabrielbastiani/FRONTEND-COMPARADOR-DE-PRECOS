"use client"

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/Button/page';
import { Input } from '@/components/Input/page';


import logoLoginImg from '../../../../public/logo.png';
import styles from '../../recover/[recover_id]/styles.module.css';

import { setupAPIClient } from '@/services/api';



export default function Recover({ params }: { params: { recovery_id: string } }) {

    const router = useRouter();
    const apiClient = setupAPIClient();

    const [newPassword, setNewPassword] = useState('')
    const [password, setPassword] = useState('');

    console.log(params.recovery_id)

    async function handleRecover(event: FormEvent) {
        event.preventDefault();

        try {

            if (newPassword != password) {

                toast.error('Senhas diferentes')

                return;
            }

            await apiClient.put(`/recover?recovery_id=${params.recovery_id}`, { password })

            toast.success('Senha atualizada com sucesso.')


        } catch (err) {
            console.log(err);
            toast.error('Erro ao atualizar a sua senha')
        }

        router.push('/login')

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
                            placeholder='Digite nova senha'
                            type='password'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                        <Input
                            placeholder='Repetir a nova senha'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button
                            type="submit"
                        >
                            Alterar senha
                        </Button>

                    </form>

                    <Link href="/signup">
                        Não possui uma conta? Cadastre-se
                    </Link>

                </div>
            </div>
        </>
    )
}
"use client"

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/Button/page';
import { Input } from '@/components/Input/page';
import LoadingRequests from '@/components/LoadingRequests/page';

import logoLoginImg from '../../../../public/logo.png';
import styles from '../../recover/[recovery_id]/styles.module.css';

import { setupAPIClient } from '@/services/api';


export default function Recover({ params }: { params: { recovery_id: string } }) {

    const router = useRouter();
    const apiClient = setupAPIClient();

    const [newPassword, setNewPassword] = useState('')
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleRecover(event: FormEvent) {

        setLoading(true);
        event.preventDefault();

        try {

            if (newPassword != password) {
                toast.error('Senhas diferentes');
                setLoading(false);
                return;
            }

            if (newPassword === "" && password === "") {
                toast.error('Não deixe os campos em branco');
                setLoading(false);
                return;
            }

            await apiClient.put(`/recover_password?passwordRecoveryUser_id=${params?.recovery_id}`, { password: password });

            toast.success('Senha atualizada com sucesso.');

            setLoading(false);

            router.push('/login');

        } catch (err) {
            console.log(err);
            toast.error('Erro ao atualizar a sua senha');
            setLoading(false);
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
            }
        </>
    )
}
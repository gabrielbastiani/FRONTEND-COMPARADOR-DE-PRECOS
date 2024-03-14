"use client"

import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { Button } from '@/components/Button/page';
import { Header } from '@/components/Header/page';
import { Input } from '@/components/Input/page';
import LoadingRequests from '@/components/LoadingRequests/page';

import styles from './styles.module.css';

import { AuthContext } from '@/contexts/AuthContext';
import { setupAPIClient } from '@/services/api';


export default function User() {

    const { user } = useContext(AuthContext);
    const router = useRouter();
    const apiClient = setupAPIClient();

    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [loading, setLoading] = useState<boolean>(false);

    async function updateUserName() {
        try {
            setLoading(true);
            apiClient.put(`/update_name_user?user_id=${user?.id}`, {
                name: userName
            });
            toast.success("Nome do usuário atualizado com sucesso");

            setLoading(false);

        } catch (error) {
            /* @ts-ignore */
            console.log(error.response.data);
            toast.error("Erro ao atualizar o nome do usuário");
        }
    }

    async function updateUserEmail() {
        try {
            apiClient.put(`/update_email_user?user_id=${user?.id}`, {
                email: userEmail
            });
            toast.success("Email do usuário atualizado com sucesso");
        } catch (error) {
            /* @ts-ignore */
            console.log(error.response.data);
            toast.error("Erro ao atualizar o email do usuário");
        }
    }


    return (
        <>
            <Head>
                <title>{`Usuário - ${user?.name}`}</title>
            </Head>

            {loading ? (
                <LoadingRequests />
            ) :
                <>

                    <Header />

                    <main className={styles.mainContainer}>
                        <article className={styles.content}>
                            <div className={styles.contentText}>
                                <FaArrowLeft
                                    onClick={() => router.back()}
                                    size={32}
                                    color='white'
                                />
                                <div className={styles.text}>
                                    <h2>Editar usuário</h2>
                                </div>
                            </div>
                            <div className={styles.contentValues}>
                                <Input
                                    style={{ width: '300px', marginRight: '20px' }}
                                    placeholder={user?.name}
                                    type='text'
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                                <Button
                                    style={{
                                        backgroundColor: 'green',
                                        width: '80px',
                                        height: '35px',
                                        color: 'white'
                                    }}
                                    onClick={updateUserName}
                                >
                                    Salvar
                                </Button>
                            </div>
                            <div className={styles.contentValues}>
                                <Input
                                    style={{ width: '300px', marginRight: '20px' }}
                                    placeholder={user?.email}
                                    type='text'
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                />
                                <Button style={{
                                    backgroundColor: 'green',
                                    width: '80px',
                                    height: '35px',
                                    color: 'white'
                                }}
                                    onClick={updateUserEmail}
                                >
                                    Salvar
                                </Button>
                            </div>
                            <div className={styles.contentValues}>
                                <Button
                                    style={{ padding: '10px', fontWeight: 'bold' }}
                                >
                                    Deletar conta
                                </Button>
                            </div>
                        </article>
                    </main>
                </>
            }
        </>
    )
}
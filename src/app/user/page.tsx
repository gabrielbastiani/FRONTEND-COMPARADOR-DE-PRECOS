"use client"

import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import Modal from 'react-modal';
import { toast } from 'react-toastify';

import { Button } from '@/components/Button/page';
import { Header } from '@/components/Header/page';
import { Input } from '@/components/Input/page';
import LoadingRequests from '@/components/LoadingRequests/page';
import { ModalDeleteUser } from '@/components/popups/ModalDeleteUser/page';

import styles from './styles.module.css';

import { AuthContext } from '@/contexts/AuthContext';
import { setupAPIClient } from '@/services/api';


export default function User() {

    const { user } = useContext(AuthContext);
    const router = useRouter();

    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [loading, setLoading] = useState<boolean>(false);

    const [modalVisible, setModalVisible] = useState(false);

    function isEmail(userEmail: string) {
        return /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(userEmail)
    }

    useEffect(() => {
        const apiClient = setupAPIClient();
        async function loadUser() {
            try {
                const { data } = await apiClient.get(`/find_unique_user?user_id=${user?.id}`);
                setUserName(data?.name || "");
                setUserEmail(data?.email || "");
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
            }
        }
        loadUser();
    }, [user?.id]);

    async function loadUser() {
        const apiClient = setupAPIClient();
        try {
            const { data } = await apiClient.get(`/find_unique_user?user_id=${user?.id}`);
            setUserName(data?.name || "");
            setUserEmail(data?.email || "");
        } catch (error) {/* @ts-ignore */
            console.log(error.response.data);
        }
    }

    async function updateUserName() {

        setLoading(true);

        const apiClient = setupAPIClient();

        try {

            if (userName === '') {
                toast.error('Preencha o seu nome');
                console.log("Preencha o seu nome");
                setLoading(false);
                return;
            }

            await apiClient.put(`/update_name_user?user_id=${user?.id}`, {
                name: userName
            });

            toast.success("Nome do usuário atualizado com sucesso");

            setLoading(false);
            loadUser();

        } catch (error) {
            /* @ts-ignore */
            console.log(error.response.data);
            toast.error("Erro ao atualizar o nome do usuário");
            setLoading(false);
            loadUser();
        }

    }

    async function updateUserEmail() {

        setLoading(true);

        const apiClient = setupAPIClient();

        try {

            if (userEmail === '') {
                toast.warning('Preencha o seu email');
                console.log("Preencha o seu email");
                setLoading(false);
                return;
            }

            if (!isEmail(userEmail)) {

                toast.error('Por favor digite um email valido!');

                setLoading(false);

                return;
            }

            await apiClient.put(`/update_email_user?user_id=${user?.id}`, {
                email: userEmail
            });

            toast.success("Email do usuário atualizado com sucesso");

            setLoading(false);
            loadUser();

        } catch (error) {
            /* @ts-ignore */
            console.log(error.response.data);
            toast.error("Erro ao atualizar o email do usuário");
            setLoading(false);
            loadUser();
        }
    }

    function handleCloseModalDelete() {
        setModalVisible(false);
    }

    async function handleOpenModalDelete() {
        setModalVisible(true);
    }

    Modal.setAppElement('body');


    return (
        <>
            {loading ?
                <LoadingRequests />
                :
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

                                <div className={styles.text}></div>
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
                                    onClick={handleOpenModalDelete}
                                >
                                    Deletar conta
                                </Button>
                            </div>
                        </article>
                    </main>
                </>
            }
            {modalVisible && (
                <ModalDeleteUser
                    isOpen={modalVisible}
                    onRequestClose={handleCloseModalDelete}
                />
            )}
        </>
    )
}
"use client"

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import Modal from 'react-modal';
import { toast } from 'react-toastify';

import { Button } from '@/components/Button/page';
import ButtonToggle from '@/components/ButtonToggle/page';
import { Header } from '@/components/Header/page';
import { Input } from '@/components/Input/page';
import LoadingRequests from '@/components/LoadingRequests/page';

import styles from './styles.module.css';

import { setupAPIClient } from '@/services/api';


export default function Edit_category({ params }: { params: { category_id: string } }) {

    const router = useRouter();

    const [nameCategory, setNameCategory] = useState("");
    const [orderCategory, setOrderCategory] = useState("");
    const [status, setStatus] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    


    useEffect(() => {
        const apiClient = setupAPIClient();
        async function loadCategory() {
            try {
                const { data } = await apiClient.get(`/find_unique_category?category_id=${params?.category_id}`);
                setNameCategory(data?.name || "");
                setOrderCategory(data?.order);
                setStatus(data?.status || "");
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
            }
        }
        loadCategory();
    }, [params?.category_id]);

    async function loadCategory() {
        const apiClient = setupAPIClient();
        try {
            const { data } = await apiClient.get(`/find_unique_user?category_id=${params?.category_id}`);
            setNameCategory(data?.name || "");
            setOrderCategory(data?.order);
            setStatus(data?.status || "");
        } catch (error) {/* @ts-ignore */
            console.log(error.response.data);
        }
    }

    async function updateName() {
        setLoading(true);
        const apiClient = setupAPIClient();
        try {
            if (nameCategory === '') {
                toast.error('Não deixe o nome da categoria em branco')
                console.log("'Não deixe o nome da categoria em branco");
                setLoading(false);
                return;
            }

            await apiClient.put(`/update_name_category?category_id=${params?.category_id}`, { name: nameCategory });

            setNameCategory("");

            toast.success('Nome da categoria atualizada com sucesso!!!');

            setLoading(false);

            loadCategory();

        } catch (error) {
            toast.error('Erro ao atualizar o nome da categoria');
            /* @ts-ignore */
            console.log(error.response.data);
            setLoading(false);
        }

    }

    async function updateOrder() {
        setLoading(true);
        const apiClient = setupAPIClient();
        try {

            await apiClient.put(`/update_order_category?category_id=${params?.category_id}`, { order: orderCategory });

            toast.success('Ordem da categoria atualizada com sucesso!!!');

            setLoading(false);

            loadCategory();

        } catch (error) {
            toast.error('Erro ao atualizar a ordem da categoria');
            /* @ts-ignore */
            console.log(error.response.data);
            setLoading(false);
        }

    }

    async function updateStatus() {
        setLoading(true);
        const apiClient = setupAPIClient();
        try {
            await apiClient.put(`/update_status_category?category_id=${params?.category_id}`);

        } catch (error) {
            toast.error('Ops erro ao atualizar a status da categoria.');
        }

        if (status === "Indisponivel") {
            toast.success(`A categoria se encontra Disponivel.`);
            setLoading(false);
            return;
        }

        if (status === "Disponivel") {
            toast.error(`A categoria se encontra Indisponivel.`);
            setLoading(false);
            return;
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
                                    <h2>Editar categoria</h2>
                                </div>

                                <div className={styles.text}></div>
                            </div>
                            <div className={styles.contentValues}>
                                <Input
                                    style={{ width: '300px', marginRight: '20px' }}
                                    placeholder={nameCategory}
                                    type='text'
                                    value={nameCategory}
                                    onChange={(e) => setNameCategory(e.target.value)}
                                />
                                <Button
                                    style={{
                                        backgroundColor: 'green',
                                        width: '80px',
                                        height: '35px',
                                        color: 'white'
                                    }}
                                    onClick={updateName}
                                >
                                    Salvar
                                </Button>
                            </div>
                            <div className={styles.contentValues}>
                                <Input
                                    style={{ width: '300px', marginRight: '20px' }}
                                    placeholder={orderCategory}
                                    type='number'
                                    value={orderCategory}
                                    onChange={(e) => setOrderCategory(e.target.value)}
                                />
                                <Button style={{
                                    backgroundColor: 'green',
                                    width: '80px',
                                    height: '35px',
                                    color: 'white'
                                }}
                                    onClick={updateOrder}
                                >
                                    Salvar
                                </Button>
                            </div>

                            <div className={styles.contentValues}>
                                <ButtonToggle />
                            </div>
                            
                            <div className={styles.contentValues}>
                                <Button
                                    style={{ padding: '10px', fontWeight: 'bold' }}
                                    onClick={handleOpenModalDelete}
                                >
                                    Deletar categoria
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
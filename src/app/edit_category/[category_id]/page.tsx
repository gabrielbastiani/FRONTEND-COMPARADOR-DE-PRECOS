"use client"

import Image from "next/image";
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { FiUpload } from 'react-icons/fi';
import Modal from 'react-modal';
import { toast } from 'react-toastify';

import { Button } from '@/components/Button/page';
import ButtonToggle from '@/components/ButtonToggle/page';
import { Header } from '@/components/Header/page';
import { Input } from '@/components/Input/page';
import LoadingRequests from '@/components/LoadingRequests/page';
import { ModalDeleteCategory } from "@/components/popups/ModalDeleteCategory/page";

import styles from './styles.module.css';

import { setupAPIClient } from '@/services/api';


export default function Edit_category({ params }: { params: { category_id: string } }) {

    const router = useRouter();

    const [nameCategory, setNameCategory] = useState("");
    const [orderCategory, setOrderCategory] = useState("");
    const [status, setStatus] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [imageCategory, setImageCategory] = useState("");
    const [categoryPhotoUrl, setCategoryPhotoUrl] = useState<string | null>(null);
    const [categoryPhoto, setCategoryPhoto] = useState<File | null>(null);


    useEffect(() => {
        const apiClient = setupAPIClient();
        async function loadCategory() {
            try {
                const { data } = await apiClient.get(`/find_unique_category?category_id=${params?.category_id}`);
                setNameCategory(data?.name || "");
                setOrderCategory(data?.order);
                setStatus(data?.status || "");
                setImageCategory(data?.image || "");
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

        loadCategory();
        router.refresh();

        if (status === "Indisponivel") {
            toast.success(`A categoria se encontra Disponivel.`);
            setLoading(false);
            router.refresh();
            return;
        }

        if (status === "Disponivel") {
            toast.error(`A categoria se encontra Indisponivel.`);
            setLoading(false);
            router.refresh();
            return;
        }
    }

    function handleFile(e: ChangeEvent<HTMLInputElement>) {

        if (!e.target.files) {
            return;
        }

        const image: File = e.target.files[0];

        if (!image) {
            return;
        }

        if (image.type === 'image/jpeg' || image.type === 'image/png') {

            setCategoryPhoto(image);
            setCategoryPhotoUrl(URL.createObjectURL(e.target.files[0]))

        }

    }

    async function handleRegister(event: FormEvent) {

        setLoading(true);

        event.preventDefault();

        try {
            const data = new FormData();

            if (categoryPhoto === null) {
                toast.error("Insira uma foto");
                return;
            }

            data.append('file', categoryPhoto);/* @ts-ignore */

            const apiClient = setupAPIClient();
            await apiClient.put(`/update_image_category?category_id=${params?.category_id}`, data);

            toast.success('Imagem da categoria atualizada com sucesso!')

            setCategoryPhoto(null);
            setCategoryPhotoUrl('');

            setLoading(false);
            loadCategory();

        } catch (error) {/* @ts-ignore */
            console.log(error.response.data);
            toast.error("Ops erro ao atualizar a imagem da categoria");
            setLoading(false);
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
                            <div className={styles.contentValuesPlus}>
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
                                        color: 'white',
                                        marginRight: '20px'
                                    }}
                                    onClick={updateName}
                                >
                                    Salvar
                                </Button>

                                <Button
                                    style={{
                                        backgroundColor: 'green',
                                        width: '160px',
                                        height: '35px',
                                        color: 'white'
                                    }}
                                    onClick={() => router.push(`/add_subcategory/${params?.category_id}`)}
                                >
                                    Adicionar subcategoria
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
                                <ButtonToggle
                                    statusUpdate={updateStatus}
                                    status={status}
                                />
                            </div>

                            <div className={styles.contentValues}>
                                {imageCategory ?
                                    <form className={styles.form} onSubmit={handleRegister}>
                                        <label className={styles.labelBanner}>
                                            <span>
                                                <FiUpload size={30} color="#FFF" />
                                            </span>

                                            <input type="file" accept="image/png, image/jpeg" onChange={handleFile} />

                                            {categoryPhotoUrl ? (
                                                <>
                                                    <Image src={categoryPhotoUrl} width={80} height={80} alt={nameCategory} />
                                                </>
                                            ) :
                                                <>
                                                    <Image
                                                        className={styles.preview}
                                                        src={"http://localhost:3333/files/" + imageCategory}
                                                        alt="Foto da categoria"
                                                        width={80}
                                                        height={80}
                                                    />
                                                </>
                                            }
                                        </label>

                                        <Button
                                            type="submit"
                                            style={{ padding: '10px', fontWeight: 'bold', width: '300px', backgroundColor: 'green' }}
                                        >
                                            Atualizar imagem
                                        </Button>
                                    </form>
                                    :
                                    null
                                }

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
                <ModalDeleteCategory
                    isOpen={modalVisible}
                    onRequestClose={handleCloseModalDelete}
                    categoryId={params?.category_id}
                />
            )}
        </>
    )
}
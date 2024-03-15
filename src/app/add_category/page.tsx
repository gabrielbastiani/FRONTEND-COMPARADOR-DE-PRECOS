"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";

import { Button } from '@/components/Button/page';
import { Header } from "@/components/Header/page";
import { Input } from '@/components/Input/page';
import LoadingRequests from "@/components/LoadingRequests/page";

import styles from './styles.module.css';

import { setupAPIClient } from "@/services/api";


export default function Add_category() {

    const router = useRouter();

    const [nameCategory, setNameCategory] = useState("");
    const [order, setOrder] = useState<number | undefined>(undefined);

    const [loading, setLoading] = useState<boolean>(false);

    const [categoryPhotoUrl, setCategoryPhotoUrl] = useState<string | null>(null);
    const [categoryPhoto, setCategoryPhoto] = useState<File | null>(null);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value); // ou parseFloat para números decimais
        setOrder(value);
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

            if (nameCategory === '' || categoryPhoto === null) {
                toast.error("Preencha todos os campos!");
                return;
            }

            data.append('name', nameCategory);

            if (typeof order === 'number') {
                data.append('order', order.toString());
            } else {
                toast.error("Valor de order não é um número válido.");
                console.error('Valor de order não é um número válido.');
                setLoading(false);
                return
            }

            data.append('file', categoryPhoto);

            const apiClient = setupAPIClient();
            await apiClient.post('/create_category', data);

            toast.success('Categoria cadastrada com sucesso!')

            setNameCategory('');
            setCategoryPhoto(null);
            setCategoryPhotoUrl('');

            setLoading(false);

            router.push('/');

        } catch (error) {/* @ts-ignore */
            console.log(error.response.data);
            toast.error("Ops erro ao cadastrar!");
            setLoading(false);
        }

    }


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
                                    <h2>Nova categoria</h2>
                                </div>

                                <div className={styles.text}></div>
                            </div>
                            <div className={styles.contentValues}>
                                <Input
                                    style={{ width: '300px', marginRight: '20px' }}
                                    placeholder="Nome da categoria"
                                    type='text'
                                    value={nameCategory}
                                    onChange={(e) => setNameCategory(e.target.value)}
                                />
                            </div>
                            <div className={styles.contentValues}>
                                <Input
                                    style={{ width: '300px', marginRight: '20px' }}
                                    placeholder="Ordem"
                                    type='number'
                                    value={order}
                                    onChange={handleChange}
                                />
                            </div>
                            <form className={styles.form} onSubmit={handleRegister}>
                                <label className={styles.labelBanner}>
                                    <span>
                                        <FiUpload size={30} color="#FFF" />
                                    </span>

                                    <input type="file" accept="image/png, image/jpeg" onChange={handleFile} />

                                    {categoryPhotoUrl && (

                                        <Image
                                            className={styles.preview}
                                            src={categoryPhotoUrl}
                                            alt="Foto da categoria"
                                            width={250}
                                            height={250}
                                        />
                                    )}

                                </label>
                            </form>
                            <div className={styles.contentValues}>
                                <Button
                                    style={{ padding: '10px', fontWeight: 'bold', width: '300px' }}
                                /* onClick={''} */
                                >
                                    Cadastrar
                                </Button>
                            </div>
                        </article>
                    </main>
                </>
            }
        </>
    )
}
"use client"

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { Button } from '@/components/Button/page';
import { Header } from '@/components/Header/page';
import { Input } from '@/components/Input/page';
import LoadingRequests from '@/components/LoadingRequests/page';

import styles from './styles.module.css';

import { setupAPIClient } from '@/services/api';


export default function Add_subcategory({ params }: { params: { category_id: string, title: string } }) {

    const router = useRouter();

    const [nameCategory, setNameCategory] = useState("");

    const [subNameCategory, setSubNameCategory] = useState("");
    const [order, setOrder] = useState<number>(Number);
    const [loading, setLoading] = useState<boolean>(false);
    const [typeCategory, setTypeCategory] = useState<string>("");

    const title = decodeURIComponent(String(params?.category_id[1]));
    const titles = !nameCategory ? title : nameCategory;

    function handleChangeTypeCategory(e: any) {
        setTypeCategory(e.target.value);
    }

    useEffect(() => {
        setLoading(true);
        const apiClient = setupAPIClient();
        async function loadCategory() {
            try {
                const { data } = await apiClient.get(`/find_unique_category?category_id=${params?.category_id[0]}`);
                setNameCategory(data?.name || "");
                setLoading(false);
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
                setLoading(false);
            }
        }
        loadCategory();
    }, [params?.category_id]);

    async function handleRegisterSubCategory() {
        setLoading(true);
        const apiClient = setupAPIClient();
        try {
            if (subNameCategory === '') {
                toast.error('Não deixe o nome da subcategoria em branco')
                console.log("'Não deixe o nome da subcategoria em branco");
                setLoading(false);
                return;
            }

            await apiClient.post(`/create_subcategory`, {
                name: subNameCategory,
                nivel: 1,
                order: order,
                parentId: params?.category_id[0],
                type_category: typeCategory
            });

            setSubNameCategory("");

            toast.success('Subategoria cadastrada com sucesso!!!');

            setLoading(false);

            router.push('/');

        } catch (error) {
            toast.error('Erro ao cadastrar a subcategoria');
            /* @ts-ignore */
            console.log(error.response.data);
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
                                    <h2>{"Categoria - " + titles}</h2>
                                </div>

                                <div className={styles.text}></div>
                            </div>
                            <div className={styles.contentValues}>
                                <Input
                                    style={{ width: '300px' }}
                                    placeholder="Digite aqui..."
                                    type='text'
                                    value={subNameCategory}
                                    onChange={(e) => setSubNameCategory(e.target.value)}
                                />

                                <select
                                    className={styles.selectImput}
                                    onChange={handleChangeTypeCategory}
                                >
                                    <option value="">Selecione aqui o tipo da categoria...</option>
                                    <option value="principal">Principal</option>
                                    <option value="amperes">Amperes</option>
                                    <option value="process">Processo de soldagem</option>
                                    <option value="accessory">Acessorios para soldagem</option>
                                </select>

                                <Input
                                    style={{ width: '300px' }}
                                    placeholder='Ordem'
                                    type='number'
                                    value={order}/* @ts-ignore */
                                    onChange={(e) => setOrder(e.target.value)}
                                />

                                <Button
                                    style={{ width: '300px' }}
                                    onClick={handleRegisterSubCategory}
                                >
                                    Salvar
                                </Button>
                            </div>
                        </article>
                    </main>
                </>
            }
        </>
    )
}
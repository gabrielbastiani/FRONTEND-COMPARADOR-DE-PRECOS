"use client"

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

import { Header } from '@/components/Header/page';
import { Input } from '@/components/Input/page';
import LoadingRequests from '@/components/LoadingRequests/page';

import styles from './styles.module.css';

import { setupAPIClient } from '@/services/api';


export default function Add_subcategory({ params }: { params: { category_id: string } }) {

    const router = useRouter();

    const [nameCategory, setNameCategory] = useState("");
    const [loading, setLoading] = useState<boolean>(false);


    useEffect(() => {
        const apiClient = setupAPIClient();
        async function loadCategory() {
            try {
                const { data } = await apiClient.get(`/find_unique_category?category_id=${params?.category_id}`);
                setNameCategory(data?.name || "");
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
            }
        }
        loadCategory();
    }, [params?.category_id]);
    

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
                                    <h2>{"Categoria -" + `${nameCategory}`}</h2>
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
        </>
    )
}
"use client"

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BiSolidCategory } from 'react-icons/bi';
import { CiEdit } from 'react-icons/ci';
import { FaArrowLeft, FaPlusCircle } from 'react-icons/fa';

import { Header } from '@/components/Header/page';
import LoadingRequests from '@/components/LoadingRequests/page';

import styles from './styles.module.css';

import { setupAPIClient } from '@/services/api';


type CategorysProps = {
    id: string;
    name: string;
    slug: string;
    status: string;
    parentId: string;
    nivel: number;
}

export default function Category({ params }: { params: { category_id: string } }) {

    const title = decodeURIComponent(String(params?.category_id[1]));

    const router = useRouter();

    const [sub_categorys, setSub_categorys] = useState<CategorysProps[]>();
    const [nameCategory, subNameCategory] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        const apiClient = setupAPIClient();
        async function loadSubCategory() {
            try {
                const { data } = await apiClient.get(`/sub_categorys_category?parentId=${params?.category_id[2]}`);
                setSub_categorys(data?.all_subcategorys || []);
                subNameCategory(data?.categorys?.name);
                setLoading(false);
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
                setLoading(false);
            }
        }
        loadSubCategory();
    }, [params.category_id]);

    return (
        <>
            {loading ?
                <LoadingRequests />
                :
                <>
                    <Header />
                    <main className={styles.mainContainer}>
                        <div className={styles.contentText}>
                            <FaArrowLeft
                                onClick={() => router.back()}
                                size={32}
                                color='white'
                            />
                            <h1>{"Subcategoria - " + title}</h1>
                            <div></div>
                        </div>
                        <div className={styles.grid_container}>
                            {sub_categorys?.length === 0 ?
                                <strong className={styles.text}>Adicione a subcategoria referente a categoria {nameCategory}</strong>
                                :
                                <>
                                    {sub_categorys?.map((item) => {
                                        return (
                                            <div key={item.id}>
                                                {item?.status === "Indisponivel" ?
                                                    <button className={styles.grid_item_indisponivel} onClick={() => router.push(`/edit_category/${item?.id}`)}>
                                                        <strong>
                                                            {item.name}  <CiEdit color='black' size={25} />
                                                        </strong>
                                                    </button>
                                                    :
                                                    <div className={styles.grid_item}>
                                                        <button onClick={() => router.push(`/category_products/${item?.id}`)}>
                                                            <strong>
                                                                {item.name}
                                                            </strong>
                                                        </button>
                                                        <span>
                                                            <FaPlusCircle color='black' size={25} onClick={() => router.push(`/edit_category/${item?.id}`)} />
                                                            &nbsp;&nbsp;
                                                            <BiSolidCategory onClick={() => router.push(`/category/${item?.slug}/${item?.name}/${item?.id}`)} size={28} />
                                                        </span>
                                                    </div>
                                                }
                                            </div>
                                        )
                                    })}
                                </>
                            }
                        </div>
                    </main>
                </>
            }
        </>
    )
}
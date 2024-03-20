'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { FiX } from 'react-icons/fi';
import Modal from 'react-modal';

import LoadingRequests from '@/components/LoadingRequests/page';

import { setupAPIClient } from '../../../services/api';
import styles from './styles.module.css';


interface ModalCategoryRequest {
    isOpen: boolean;
    categoryId: string;
    onRequestClose: () => void;
}

type CategorysProps = {
    id: string;
    name: string;
    slug: string;
    image: string;
    status: string;
    parentId: string;
    nivel: number;
}

export function ModalCategory({ isOpen, onRequestClose, categoryId }: ModalCategoryRequest) {

    console.log(categoryId)

    const router = useRouter();

    const [sub_categorys, setSub_categorys] = useState<CategorysProps[]>();
    const [nameCategory, subNameCategory] = useState<string>("");
    const [nivelCategory, subNivelCategory] = useState<number>();
    const [loading, setLoading] = useState<boolean>(false);

    const customStyles = {
        content: {
            top: '50%',
            bottom: 'auto',
            left: '50%',
            right: 'auto',
            padding: '30px',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'black',
            zIndex: 9999999
        }
    };

    useEffect(() => {
        setLoading(true);
        const apiClient = setupAPIClient();
        async function loadSubCategory() {
            try {
                const { data } = await apiClient.get(`/sub_categorys_category?parentId=${categoryId}`);
                setSub_categorys(data?.all_subcategorys || []);
                subNameCategory(data?.categorys?.name);
                subNivelCategory(data?.categorys?.nivel);
                setLoading(false);
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
                setLoading(false);
            }
        }
        loadSubCategory();
    }, [categoryId]);


    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
        >
            <button
                type='button'
                onClick={onRequestClose}
                className='react-modal-close'
                style={{ background: 'transparent', border: 0, cursor: 'pointer' }}
            >
                <FiX size={45} color="#f34748" />
            </button>

            {loading ?
                <LoadingRequests />
                :
                <>
                    <div className={styles.mainContainer}>
                        <h1>{nivelCategory === 0 ? + nameCategory : nameCategory}</h1>
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
                                                        <button onClick={() => router.push(`/products/`)}>
                                                            <strong>
                                                                {item.name}
                                                            </strong>
                                                        </button>
                                                        <span>
                                                            <CiEdit color='black' size={25} onClick={() => router.push(`/edit_category/${item?.id}`)} />
                                                        </span>
                                                    </div>
                                                }
                                            </div>
                                        )
                                    })}
                                </>
                            }
                        </div>
                    </div>
                </>
            }
        </Modal>
    )
}
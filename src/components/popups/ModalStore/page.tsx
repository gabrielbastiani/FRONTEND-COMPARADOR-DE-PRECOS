'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import Modal from 'react-modal';
import { toast } from 'react-toastify';

import LoadingRequests from '@/components/LoadingRequests/page';

import { setupAPIClient } from '../../../services/api';
import styles from './styles.module.css';


interface ModalStoreRequest {
    isOpen: boolean;
    valor1: string;
    valor2: string;
    onRequestClose: () => void;
}

export function ModalStore({ isOpen, onRequestClose, valor1, valor2 }: ModalStoreRequest) {

    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);
    const [listProducts, setListProducts] = useState<any[]>();

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
        const apiClient = setupAPIClient();
        async function loadStoreProducts() {
            try {
                const response = await apiClient.get(`/store_products?store=${valor2}`);
                setListProducts(response?.data || []);
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
            }
        }
        loadStoreProducts();
    }, [valor2]);

    async function loadStoreProducts() {
        const apiClient = setupAPIClient();
        try {
            const response = await apiClient.get(`/store_products?store=${valor2}`);
            setListProducts(response?.data || []);
        } catch (error) {/* @ts-ignore */
            console.log(error.response.data);
        }
    }

    async function handleStoreProducts() {
        setLoading(true);
        const valorCodificado = encodeURIComponent(String(valor1));
        const apiClient = setupAPIClient();
        try {
            await apiClient.get(`/search_products?urlSearchStore=${valorCodificado}&stores=${valor2}`);
            setLoading(false);
            toast.success(`Produtos da concorrência ${valor2} capturados com sucesso`);
            loadStoreProducts();
        } catch (error) {/* @ts-ignore */
            console.log(error.response.data);
            toast.error(`Erro ao carregar dados da concorrência ${valor2}`);
            setLoading(false);
        }
    }


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
                        <h1>Escolha uma opção</h1>
                        <div className={styles.containerButton}>
                            {listProducts?.length === 0 ?
                                null
                                :
                                <button
                                    onClick={() => router.push(`/products/${valor2}`)}
                                >
                                    Ver os produtos dessa loja
                                </button>
                            }
                            <button
                                style={{ backgroundColor: 'gray' }}
                                onClick={handleStoreProducts}
                            >
                                Gerar uma nova lista de produtos dessa loja
                            </button>
                        </div>
                    </div>
                </>
            }
        </Modal>
    )
}
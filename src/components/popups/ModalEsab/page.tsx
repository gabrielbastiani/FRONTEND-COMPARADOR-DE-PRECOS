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
    onRequestClose: () => void;
}

export function ModalEsab({ isOpen, onRequestClose }: ModalStoreRequest) {

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

    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [listProducts, setListProducts] = useState<any[]>();

    useEffect(() => {
        const apiClient = setupAPIClient();
        async function loadStoreProducts() {
            try {
                const response = await apiClient.get(`/store_products?slug=esab`);
                setListProducts(response?.data || []);
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
            }
        }
        loadStoreProducts();
    }, []);

    async function handleStoreESABProducts() {
        setLoading(true);
        const apiClient = setupAPIClient();
        try {
            await apiClient.get(`/esab_machines_weld`);
            setLoading(false);
            toast.success(`Produtos da ESAB capturados com sucesso`);
        } catch (error) {/* @ts-ignore */
            console.log(error.response.data);
            toast.error(`Erro ao carregar dados da ESAB`);
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
                                    onClick={() => router.push(`/products/esab`)}
                                >
                                    Ver os produtos dessa loja
                                </button>
                            }
                            <button
                                style={{ backgroundColor: 'gray' }}
                                onClick={handleStoreESABProducts}
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
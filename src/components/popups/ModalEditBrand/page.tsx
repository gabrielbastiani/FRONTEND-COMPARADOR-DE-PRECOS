'use client'

import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import Modal from 'react-modal';
import { toast } from 'react-toastify';

import LoadingRequests from '@/components/LoadingRequests/page';

import { setupAPIClient } from '../../../services/api';
import styles from './styles.module.css';


interface ModalStoreRequest {
    isOpen: boolean;
    productId: string
    onRequestClose: () => void;
    productLoad: () => void;
}

export function ModalEditBrand({ isOpen, onRequestClose, productLoad, productId }: ModalStoreRequest) {

    const [loading, setLoading] = useState<boolean>(false);
    const [brand, setBrand] = useState<string>("");

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

    async function handleBrandProduct() {
        setLoading(true);
        const apiClient = setupAPIClient();
        try {
            await apiClient.put(`/update_brand?storeProduct_id=${productId}`,
                {
                    brand: brand
                }
            );
            setLoading(false);
            toast.success(`Marca do produto atualizada com sucesso`);
            onRequestClose();
            productLoad();
        } catch (error) {/* @ts-ignore */
            console.log(error.response.data);
            toast.error(`Erro ao atualizar a marca do produto`);
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
                        <h1>Digite corretamente a marca para esse produto</h1>
                        <div className={styles.containerBrand}>
                            <input
                                placeholder='Digite aqui o nome correto...'
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                            />
                            <button
                                onClick={handleBrandProduct}
                            >
                                Atualizar
                            </button>
                        </div>
                    </div>
                </>
            }
        </Modal>
    )
}
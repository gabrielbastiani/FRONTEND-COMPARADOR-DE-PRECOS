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

export function ModalEditTitle({ isOpen, onRequestClose, productLoad, productId }: ModalStoreRequest) {

    const [loading, setLoading] = useState<boolean>(false);
    const [title_product, setTitle_product] = useState<string>("");

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

    async function handleTitleProduct() {
        setLoading(true);
        const apiClient = setupAPIClient();
        try {
            await apiClient.put(`/update_title_product?storeProduct_id=${productId}`,
                {
                    title_product: title_product
                }
            );
            setLoading(false);
            toast.success(`Titulo do produto atualizado com sucesso`);
            onRequestClose();
            productLoad();
        } catch (error) {/* @ts-ignore */
            console.log(error.response.data);
            toast.error(`Erro ao atualizar o titulo do produto`);
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
                        <h3>Digite o titulo padrão para esse produto, conforme o produto que já cadastrou no sistema para que possa ser computado os valores de preço dessa loja.</h3>
                        <div className={styles.containerBrand}>
                            <input
                                placeholder='Digite aqui...'
                                value={title_product}
                                onChange={(e) => setTitle_product(e.target.value)}
                            />
                            <button
                                onClick={handleTitleProduct}
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
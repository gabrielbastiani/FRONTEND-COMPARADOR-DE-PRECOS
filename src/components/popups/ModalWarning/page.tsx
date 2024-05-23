'use client'

import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import Modal from 'react-modal';
import { toast } from 'react-toastify';

import LoadingRequests from '@/components/LoadingRequests/page';

import styles from './styles.module.css';

import { setupAPIClient } from '@/services/api';


interface Modalequest {
    isOpen: boolean;
    onRequestClose: () => void;
    productId: string;
    titleProduct: string;
    modalBrand: any;
    store: string;
    productLoad: () => void;
}

export function ModalWarning({ isOpen, onRequestClose, productId, modalBrand, productLoad, store, titleProduct }: Modalequest) {

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

    const [loading, setLoading] = useState<boolean>(false);

    function handleRegisterBrandandClose() {
        modalBrand(productId);
        onRequestClose();
    }

    async function handleRegisterProduct() {
        const apiClient = setupAPIClient();
        setLoading(true);
        try {
            await apiClient.post(`/create_product?storeProduct_id=${productId}`, {
                store: store,
                title_product: titleProduct
            });
            toast.success("Produto registrado com sucesso");
            onRequestClose();
            productLoad();
            setLoading(false);
        } catch (error) {/* @ts-ignore */
            console.log(error.response.data);
            toast.error("Opss... erro ao registrar o produto")
            setLoading(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
        >
            {loading ?
                <LoadingRequests />
                :
                <div>
                    <button
                        type='button'
                        onClick={onRequestClose}
                        className='react-modal-close'
                        style={{ background: 'transparent', border: 0, cursor: 'pointer' }}
                    >
                        <FiX size={45} color="#f34748" />
                    </button>

                    <div className={styles.mainContainer}>
                        <h3>ATENÇÃO!!! Antes certifique que a marca do produto esta correta e que não precisa editar a mesma, para isso, antes entre na página do produto e confira</h3>
                        <div className={styles.containerButton}>
                            <button
                                style={{ backgroundColor: "red" }}
                                onClick={handleRegisterBrandandClose}
                            >
                                Ajustar a marca
                            </button>

                            <button
                                onClick={handleRegisterProduct}
                            >
                                Já está correto
                            </button>
                        </div>
                    </div>
                </div>
            }
        </Modal>
    )
}
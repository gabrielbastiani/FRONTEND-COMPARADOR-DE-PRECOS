'use client'

import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import Modal from 'react-modal';
import { toast } from 'react-toastify';

import { Button } from '@/components/Button/page';
import LoadingRequests from '@/components/LoadingRequests/page';

import { setupAPIClient } from '../../../services/api';
import styles from './styles.module.css';


interface ModalDeleteProductRequest {
    isOpen: boolean;
    productCategory: string;
    storeProduct_id: string;
    onRequestClose: () => void;
    productLoad: () => void;
}

export function ModalProductCategory({ isOpen, onRequestClose, productCategory, productLoad, storeProduct_id }: ModalDeleteProductRequest) {
    
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

    async function deleteCategoryProduct() {
        const apiClient = setupAPIClient();
        setLoading(true);
        try {
            await apiClient.delete(`/delete_category_product?productCategory_id=${productCategory}&storeProduct_id=${storeProduct_id}`);
            productLoad();
            toast.success("Produto deletado dessa categoria com sucesso");
            setLoading(false);
            onRequestClose();
        } catch (error) {/* @ts-ignore */
            console.log(error.response.data);/* @ts-ignore */
            toast.error(`${error.response.data.error}`);
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
                <>
                    <button
                        type='button'
                        onClick={onRequestClose}
                        className='react-modal-close'
                        style={{ background: 'transparent', border: 0, cursor: 'pointer' }}
                    >
                        <FiX size={45} color="#f34748" />
                    </button>

                    <div className={styles.containerContent}>

                        <h2>Deseja deletar esse produto desta categoria?</h2>

                        <div className={styles.containerButton}>
                            <Button
                                style={{ width: '40%', fontWeight: "bold", fontSize: '14px' }}
                                onClick={deleteCategoryProduct}
                            >
                                Deletar
                            </Button>
                        </div>
                    </div>
                </>
            }
        </Modal>
    )
}
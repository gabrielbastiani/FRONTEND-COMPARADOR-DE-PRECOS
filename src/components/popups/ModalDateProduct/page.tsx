'use client'

import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import Modal from 'react-modal';
import { toast } from 'react-toastify';

import { Button } from '@/components/Button/page';
import { Input } from '@/components/Input/page';
import LoadingRequests from '@/components/LoadingRequests/page';

import { setupAPIClient } from '../../../services/api';
import styles from './styles.module.css';


interface ModalDeleteProductRequest {
    isOpen: boolean;
    productCategory: string;
    nameCategory: string;
    positionCategory: number;
    onRequestClose: () => void;
    productLoad: () => void;
}

export function ModalDateProduct({ isOpen, onRequestClose, productCategory, productLoad, nameCategory, positionCategory }: ModalDeleteProductRequest) {

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
    const [order, setOrder] = useState<number>(Number);

    async function updateOrder() {
        const apiClient = setupAPIClient();
        setLoading(true);
        try {
            await apiClient.put(`/update_positionCategory_product?productCategory_id=${productCategory}`, {
                order: order
            });
            productLoad();
            toast.success("Posição da ordem atualizada com sucesso");
            setLoading(false);
            onRequestClose();
        } catch (error) {/* @ts-ignore */
            console.log(error.response.data);
            toast.error("Erro ao atualizar a posição")
            setLoading(false);
        }
    }

    async function deleteCategoryProduct() {
        const apiClient = setupAPIClient();
        setLoading(true);
        try {
            await apiClient.delete(`/delete_category_product?productCategory_id=${productCategory}`);
            productLoad();
            toast.success("Categoria para esse produto deletada com sucesso");
            setLoading(false);
            onRequestClose();
        } catch (error) {/* @ts-ignore */
            console.log(error.response.data);
            toast.error("Erro ao deletar essa categoria desse produto")
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

                        <h2>Categoria {nameCategory}</h2>

                        <div className={styles.containerButton}>
                            <label>Posição dessa categoria: {positionCategory}</label>
                            <Input
                                placeholder="Ordem"
                                type='number'
                                value={order}/* @ts-ignore */
                                onChange={(e) => setOrder(e.target.value)}
                            />

                            <Button
                                style={{ width: '40%', fontWeight: "bold", fontSize: '14px', backgroundColor: 'green' }}
                                onClick={updateOrder}
                            >
                                Atualizar posição
                            </Button>

                            <h3>Deletar essa categoria desse produto?</h3>

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
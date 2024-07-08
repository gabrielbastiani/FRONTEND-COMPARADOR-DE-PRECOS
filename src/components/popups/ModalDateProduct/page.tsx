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
    productId: string;
    titleSlug: string;
    dataStore: string;
    title: string;
    onRequestClose: () => void;
    productLoad: () => void;
}

export function ModalDateProduct({ isOpen, onRequestClose, productId, productLoad, titleSlug, dataStore, title }: ModalDeleteProductRequest) {

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
    const [brand, setBrand] = useState<string>("");

    async function handleRegisterProduct() {
        const apiClient = setupAPIClient();
        setLoading(true);
        try {
            await apiClient.post(`/capture_product_welding_machine`, {
                storeProduct_id: productId,
                slug_title_product: titleSlug,
                store: dataStore
            });
            setLoading(false);
            toast.success("Produto cadastrado com sucesso.");
            window.location.reload();
        } catch (error) {/* @ts-ignore */
            console.log(error.response.data);
            setLoading(false);
            toast.error("Erro ao cadastrar esse produto!");
        }
    }

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

                        <h2>O nome desse produto é o padrão para com relação a outras lojas?</h2>
                        <h3>Se não... escolha abaixo o nome desse produto para que fique igual a todas as outras lojas.</h3>

                        <h3 style={{ color: "#f34748" }}>{title}</h3>

                        <select>
                            <option>fdsfsdfsf</option>
                        </select>

                        <div className={styles.containerButton}>

                            <Button
                                style={{ width: '40%', fontWeight: "bold", fontSize: '14px', backgroundColor: 'green' }}
                                onClick={handleRegisterProduct}
                            >
                                Registrar esse produto
                            </Button>

                            <h3>A Marca desse produto está correta não precisa edita-la?</h3>

                            <Input
                                placeholder='Digite aqui o nome correto...'
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                            />

                            <Button
                                style={{ width: '40%', fontWeight: "bold", fontSize: '14px' }}
                                onClick={handleBrandProduct}
                            >
                                Atualizar marca
                            </Button>
                        </div>
                    </div>
                </>
            }
        </Modal>
    )
}
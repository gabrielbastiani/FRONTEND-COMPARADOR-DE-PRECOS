'use client'

import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import Modal from 'react-modal';
import { toast } from 'react-toastify';

import LoadingRequests from '@/components/LoadingRequests/page';

import { setupAPIClient } from '../../../services/api';
import styles from './styles.module.css';


interface ModalRequest {
    isOpen: boolean;
    onRequestClose: () => void;
    productId: string;
}

export function ModalRegisterCategory({ isOpen, onRequestClose, productId }: ModalRequest) {

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
    const [categoryAmpere, setCategoryAmpere] = useState<any[]>();
    const [categoryProcess, setCategoryProcess] = useState<any[]>();
    const [categoryAcessory, setCategoryAcessory] = useState<any[]>();
    const [allCategory, setAllCategory] = useState<any[]>();
    const [typeCategory, setTypeCategory] = useState<string>("");

    function handleChangeTypeCategory(e: any) {
        setTypeCategory(e.target.value);
    }

    console.log(typeCategory)

    useEffect(() => {
        const apiClient = setupAPIClient();
        async function loadCategorys() {
            try {
                const { data } = await apiClient.get(`/all_categorys`);
                setCategoryAmpere(data?.categorys_amp || []);
                setCategoryProcess(data?.categorys_process || []);
                setCategoryAcessory(data?.categorys_accessory || []);
                setAllCategory(data?.all_categorys || []);
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
            }
        }
        loadCategorys();
    }, []);

    async function handleRegisterProduct() {
        const apiClient = setupAPIClient();
        setLoading(true);
        try {
            await apiClient.post(`/create_product?storeProduct_id=${productId}`, {
                name: typeCategory
            });
            toast.success("Produto registrado com sucesso");
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
            <button
                type='button'
                onClick={onRequestClose}
                className='react-modal-close'
                style={{ background: 'transparent', border: 0, cursor: 'pointer' }}
            >
                <FiX size={45} color="#f34748" />
            </button>
            <div className={styles.mainContainer}>
                <h1>Cadastre as categorias</h1>
                {loading ?
                    <LoadingRequests />
                    :
                    <div className={styles.containerButton}>
                        <h3>Qual a categoria geral?</h3>
                        <div className={styles.boxCategs}>
                            <select
                                onChange={handleChangeTypeCategory}
                            >
                                <option>Selecione aqui...</option>
                                {allCategory?.map((categs) => {
                                    return (
                                        <option key={categs.id} value={categs?.name}>{categs?.name}</option>
                                    )
                                })}
                            </select>
                            <button
                                onClick={handleRegisterProduct}
                                className={styles.addCategoryButton}
                            >
                                Adicionar
                            </button>
                        </div>
                        <br />
                        <h3>Possui amperagem esse produto?</h3>
                        <div className={styles.boxCategs}>
                            <select
                                onChange={handleChangeTypeCategory}
                            >
                                <option>Selecione aqui...</option>
                                {categoryAmpere?.map((cat) => {
                                    return (
                                        <option key={cat.id} value={cat?.name}>{cat?.name}</option>
                                    )
                                })}
                            </select>
                            <button
                                onClick={handleRegisterProduct}
                                className={styles.addCategoryButton}
                            >
                                Adicionar
                            </button>
                        </div>
                        <br />
                        <h3>Possui algum processo de soldagem?</h3>
                        <div className={styles.boxCategs}>
                            <select
                                onChange={handleChangeTypeCategory}
                            >
                                <option>Selecione aqui...</option>
                                {categoryProcess?.map((proc) => {
                                    return (
                                        <option key={proc.id} value={proc?.name}>{proc?.name}</option>
                                    )
                                })}
                            </select>
                            <button
                                onClick={handleRegisterProduct}
                                className={styles.addCategoryButton}
                            >
                                Adicionar
                            </button>
                        </div>
                        <br />
                        <h3>Esse produto é algum acessorio?</h3>
                        <div className={styles.boxCategs}>
                            <select
                                onChange={handleChangeTypeCategory}
                            >
                                <option>Selecione aqui...</option>
                                {categoryAcessory?.map((aces) => {
                                    return (
                                        <option key={aces.id} value={aces?.name}>{aces?.name}</option>
                                    )
                                })}
                            </select>
                            <button
                                onClick={handleRegisterProduct}
                                className={styles.addCategoryButton}
                            >
                                Adicionar
                            </button>
                        </div>
                    </div>
                }
            </div>
        </Modal>
    )
}
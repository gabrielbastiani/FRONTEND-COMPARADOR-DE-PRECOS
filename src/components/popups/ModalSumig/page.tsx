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

export function ModalSumig({ isOpen, onRequestClose }: ModalStoreRequest) {

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

    const machinesWelding = listProducts?.filter(item => item.slug_type === "maquinas-de-solda" && item.slug === "sumig");
    const machinesCut = listProducts?.filter(item => item.slug_type === "maquinas-de-corte-plasma-manual" && item.slug === "sumig");

    const sumig = "sumig";

    useEffect(() => {
        const apiClient = setupAPIClient();
        async function loadStoreProducts() {
            try {
                const response = await apiClient.get(`/store_products?slug=sumig`);
                setListProducts(response?.data || []);
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
            }
        }
        loadStoreProducts();
    }, []);

    async function handleStoreSUMIGMachinesWelding() {
        setLoading(true);
        const apiClient = setupAPIClient();
        try {
            await apiClient.get(`/sumig_machines_weld`);
            setLoading(false);
            toast.success(`Produtos da SUMIG capturados com sucesso`);
        } catch (error) {/* @ts-ignore */
            console.log(error.response.data);
            toast.error(`Erro ao carregar dados da SUMIG`);
            setLoading(false);
        }
    }

    async function handleStoreSUMIGMachinesCut() {
        setLoading(true);
        const apiClient = setupAPIClient();
        try {
            await apiClient.get(`/sumig_machines_cut`);
            setLoading(false);
            toast.success(`Produtos da SUMIG capturados com sucesso`);
        } catch (error) {/* @ts-ignore */
            console.log(error.response.data);
            toast.error(`Erro ao carregar dados da SUMIG`);
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
                            {machinesWelding?.length === 0 ?
                                null
                                :
                                <button
                                    onClick={() => router.push(`/products/maquinas_de_solda/${sumig}`)}
                                >
                                    Máquinas de solda dessa loja
                                </button>
                            }

                            {machinesCut?.length === 0 ?
                                null
                                :
                                <button
                                    onClick={() => router.push(`/products/maquinas_corte_plasma/${sumig}`)}
                                >
                                    Máquinas de corte plasma dessa loja
                                </button>
                            }

                            {machinesWelding?.length === 0 ?
                                <button
                                    style={{ backgroundColor: 'gray' }}
                                    onClick={handleStoreSUMIGMachinesWelding}
                                >
                                    Gerar lista de máquinas de solda dessa loja
                                </button>
                                :
                                <button
                                    style={{ backgroundColor: 'orange', color: 'black' }}
                                    onClick={handleStoreSUMIGMachinesWelding}
                                >
                                    Atualizar preços máquinas de solda dessa loja
                                </button>
                            }

                            {machinesCut?.length === 0 ?
                                <button
                                    style={{ backgroundColor: 'gray' }}
                                    onClick={handleStoreSUMIGMachinesCut}
                                >
                                    Gerar uma nova lista de máquinas de corte plasma dessa loja
                                </button>
                                :
                                <button
                                    style={{ backgroundColor: 'orange', color: 'black' }}
                                    onClick={handleStoreSUMIGMachinesCut}
                                >
                                    Atualizar preços de máquinas de corte plasma dessa loja
                                </button>
                            }

                        </div>
                    </div>
                </>
            }
        </Modal>
    )
}
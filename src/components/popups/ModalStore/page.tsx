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
    valor3: string;
    onRequestClose: () => void;
}

export function ModalStore({ isOpen, onRequestClose, valor1, valor2, valor3 }: ModalStoreRequest) {

    const router = useRouter();

    const handleReload = () => {
        router.refresh();
    };

    const [loading, setLoading] = useState<boolean>(false);
    const [listProducts, setListProducts] = useState<any[]>();

    const valueStore: string = removerAcentos(valor2);

    const machinesWelding = listProducts?.filter(item => item.slug_type === "maquinas-de-solda" && item.slug === valueStore);
    const machinesCut = listProducts?.filter(item => item.slug_type === "maquinas-de-corte-plasma-manual" && item.slug === valueStore);

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

    function removerAcentos(s: any) {
        return s.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/ +/g, "-")
            .replace(/-{2,}/g, "-")
            .replace(/[/]/g, "-");
    }

    useEffect(() => {
        const apiClient = setupAPIClient();
        async function loadStoreProducts() {
            try {
                const response = await apiClient.get(`/store_products?slug=${valueStore}`);
                setListProducts(response?.data || []);
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
            }
        }
        loadStoreProducts();
    }, [valueStore]);

    async function loadStoreProducts() {
        const apiClient = setupAPIClient();
        try {
            const response = await apiClient.get(`/store_products?slug=${valueStore}`);
            setListProducts(response?.data || []);
        } catch (error) {/* @ts-ignore */
            console.log(error.response.data);
        }
    }

    async function handleStoreMachineWelding() {
        setLoading(true);
        const valorCodificado = encodeURIComponent(String(valor1));
        const apiClient = setupAPIClient();
        try {
            await apiClient.get(`/search_machines_welding?urlSearchStore=${valorCodificado}&stores=${valor2}`);
            setLoading(false);
            toast.success(`Produtos da concorrência ${valor2} capturados com sucesso`);
            onRequestClose();
            handleReload();
            loadStoreProducts();
        } catch (error) {/* @ts-ignore */
            console.log(error.response.data);
            toast.error(`Erro ao carregar dados da concorrência ${valor2}`);
            setLoading(false);
        }
    }

    async function handleStoreMachineCut() {
        setLoading(true);
        const valorCodificado = encodeURIComponent(String(valor3));
        const apiClient = setupAPIClient();
        try {
            await apiClient.get(`/search_machines_cut?urlSearchStore=${valorCodificado}&stores=${valor2}`);
            setLoading(false);
            toast.success(`Produtos da concorrência ${valor2} capturados com sucesso`);
            onRequestClose();
            handleReload();
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

                    <div className={styles.mainContainer}>
                        <h1>Escolha uma opção</h1>
                        <div className={styles.containerButton}>
                            {machinesWelding?.length === 0 ?
                                null
                                :
                                <button
                                    onClick={() => router.push(`/products/maquinas_de_solda/${valueStore}`)}
                                >
                                    Máquinas de solda dessa loja
                                </button>
                            }

                            {machinesCut?.length === 0 ?
                                null
                                :
                                <>
                                    {valor3 === "NA" ?
                                        null
                                        :
                                        <button
                                            onClick={() => router.push(`/products/maquinas_corte_plasma/${valueStore}`)}
                                        >
                                            Máquinas de corte plasma dessa loja
                                        </button>
                                    }
                                </>
                            }

                            <button
                                style={{ backgroundColor: 'gray' }}
                                onClick={handleStoreMachineWelding}
                            >
                                Gerar uma nova lista de máquinas de solda dessa loja
                            </button>
                            {valor3 === "NA" ?
                                null
                                :
                                <button
                                    style={{ backgroundColor: 'gray' }}
                                    onClick={handleStoreMachineCut}
                                >
                                    Gerar uma nova lista de máquinas de corte plasma dessa loja
                                </button>
                            }
                        </div>
                    </div>
                </>
            }
        </Modal>
    )
}
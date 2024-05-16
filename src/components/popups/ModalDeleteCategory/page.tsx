'use client'

import { useRouter } from 'next/navigation';
import { FiX } from 'react-icons/fi';
import Modal from 'react-modal';
import { toast } from 'react-toastify';

import { Button } from '@/components/Button/page';

import { setupAPIClient } from '../../../services/api';
import styles from './styles.module.css';


interface ModalCategoryRequest {
    isOpen: boolean;
    categoryId: string;
    slugNameCategory: string;
    onRequestClose: () => void;
}

export function ModalDeleteCategory({ isOpen, onRequestClose, categoryId, slugNameCategory }: ModalCategoryRequest) {

    const router = useRouter();

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

    async function handleDeleteCategory() {
        try {
            const apiClient = setupAPIClient();

            await apiClient.delete(`/delete_category?category_id=${categoryId}&slug=${slugNameCategory}`);
            toast.success(`Categoria deletada com sucesso.`);

            router.push('/');

            onRequestClose();

        } catch (error) {/* @ts-ignore */
            console.log(error.response.data.error);/* @ts-ignore */
            toast.error(`${error.response.data.error}`);
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

            <div className={styles.containerContent}>

                <h2>Deseja mesmo deletar essa categoria?</h2>

                <div className={styles.containerButton}>
                    <Button
                        style={{ width: '40%', fontWeight: "bold", fontSize: '1.2rem' }}
                        onClick={() => handleDeleteCategory()}
                    >
                        Deletar
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
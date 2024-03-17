'use client'

import { useContext } from 'react';
import { FiX } from 'react-icons/fi';
import Modal from 'react-modal';
import { toast } from 'react-toastify';

import { Button } from '@/components/Button/page';

import { setupAPIClient } from '../../../services/api';
import styles from './styles.module.css';

import { AuthContext } from '@/contexts/AuthContext';


interface ModalUserRequest {
    isOpen: boolean;
    onRequestClose: () => void;
}

export function ModalDeleteUser({ isOpen, onRequestClose }: ModalUserRequest) {

    const { signOut, user } = useContext(AuthContext);

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


    async function handleDeleteUser() {
        try {
            const apiClient = setupAPIClient();

            await apiClient.delete(`/delete_user?user_id=${user?.id}`);
            toast.success(`Usuário deletado com sucesso.`);

            signOut();

            onRequestClose();

        } catch (error) {/* @ts-ignore */
            console.log(error.response.data);
            toast.error('Ops erro ao deletar o usuário!');
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

                <h2>Deseja mesmo deletar sua conta?</h2>

                <div className={styles.containerButton}>
                    <Button
                        style={{ width: '40%', fontWeight: "bold", fontSize: '1.2rem' }}
                        onClick={() => handleDeleteUser()}
                    >
                        Deletar
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
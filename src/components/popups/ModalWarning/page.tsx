'use client'

import { FiX } from 'react-icons/fi';
import Modal from 'react-modal';

import styles from './styles.module.css';


interface Modalequest {
    isOpen: boolean;
    onRequestClose: () => void;
    modalRegisterCategory: any;
    productId: string;
    modalBrand: any;
}

export function ModalWarning({ isOpen, onRequestClose, productId, modalBrand, modalRegisterCategory }: Modalequest) {

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

    function handleRegisterBrandandClose() {
        modalBrand(productId);
        onRequestClose();
    }

    function handleCategory() {
        modalRegisterCategory()
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
                <h3>ATENÇÃO!!! Antes certifique que a marca do produto esta correta e que não precisa editar a mesma, para isso, antes entre na página do produto e confira</h3>
                <div className={styles.containerButton}>
                    <button
                        style={{ backgroundColor: "red" }}
                        onClick={handleRegisterBrandandClose}
                    >
                        Ajustar a marca
                    </button>

                    <button
                        onClick={() => handleCategory()}
                    >
                        Já está correto
                    </button>
                </div>
            </div>
        </Modal>
    )
}
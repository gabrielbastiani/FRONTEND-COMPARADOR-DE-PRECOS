import styles from './styles.module.css';

interface ToggleRequest {
    statusUpdate: () => void;
    status: string;
}

function ButtonToggle({ statusUpdate, status }: ToggleRequest) {
    return (
        <button
            className={`${styles.toggleButton} ${status === "Disponivel" ? styles.active : styles.inactive}`}
            onClick={statusUpdate}
        >
            {status === "Disponivel" ? 'Ativo' : 'Inativo'}
        </button>
    );
}

export default ButtonToggle;

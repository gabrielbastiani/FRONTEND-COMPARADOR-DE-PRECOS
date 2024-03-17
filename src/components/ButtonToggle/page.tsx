import React, { useState } from 'react';

import styles from './styles.module.css';

function ButtonToggle() {
    const [isActive, setIsActive] = useState(false);

    const toggleButton = () => {
        setIsActive(!isActive);
    };

    return (
        <button
            className={`${styles.toggleButton} ${isActive ? styles.active : styles.inactive}`}
            onClick={toggleButton}
        >
            {isActive ? 'Ativo' : 'Inativo'}
        </button>
    );
}

export default ButtonToggle;

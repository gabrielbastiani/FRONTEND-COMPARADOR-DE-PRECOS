import styles from './styles.module.css';

export default function loading() {

    return (
        <div className={styles.loading_wrapper}>
            <div className={styles.loading_spinner}></div>
        </div>
    )
}
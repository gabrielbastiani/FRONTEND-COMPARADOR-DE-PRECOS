import styles from './styles.module.css';

export default function LoadingRequests() {

    return (
        <div className={styles.loading_wrapper}>
            <div className={styles.loading_spinner}></div>
        </div>
    )
}
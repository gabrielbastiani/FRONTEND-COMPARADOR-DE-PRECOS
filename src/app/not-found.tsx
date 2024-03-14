import Image from 'next/image';
import Link from "next/link";

import logoLoginImg from '../../public/logo.png';
import styles from './styles.module.css';

export default function NotFound() {

    return (
        <div className={styles.error_container}>
            <Image src={logoLoginImg} width={200} height={150} alt="Logo SUMIG" />
            <h1>Erro 404</h1>
            <p>Página não encontrada</p>
            <Link href="/">Voltar para a página inicial</Link>
        </div>
    )
}
'use client'

import { useRouter } from 'next/navigation';

import { Button } from '@/components/Button/page';
import { Header } from '@/components/Header/page';

import styles from './styles.module.css';


export default function More_category({ params }: { params: { category_id: string } }) {

    const router = useRouter();

    return (
        <>
            <Header />

            <main className={styles.mainContainer}>
                <div className={styles.mensage}>
                    <h2>Deseja cadastrar uma subcategoria para essa categoria ou não?</h2>
                </div>
                <div className={styles.buttons}>
                    <Button
                        style={{
                            backgroundColor: 'green',
                            width: '80px'
                        }}
                        onClick={() => router.push(`/add_subcategory/${params?.category_id}`)}
                    >
                        Sim
                    </Button>
                    <Button
                        style={{
                            width: '80px'
                        }}
                        onClick={() => router.push(`/category/${params?.category_id}`)}
                    >
                        Não
                    </Button>
                </div>
            </main>
        </>
    )
}
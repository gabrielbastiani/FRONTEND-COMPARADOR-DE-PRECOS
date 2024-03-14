"use client"

import Head from 'next/head';
import { useContext } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

import { Button } from '@/components/Button/page';
import { Header } from '@/components/Header/page';
import { Input } from '@/components/Input/page';

import styles from './styles.module.css';

import { AuthContext } from '@/contexts/AuthContext';


export default function User() {

    const { user } = useContext(AuthContext);

    return (
        <>
            <Head>
                <title>{`Usuário - ${user?.name}`}</title>
            </Head>

            <Header />

            <main className={styles.mainContainer}>
                <article className={styles.content}>
                    <div className={styles.contentText}>
                        <FaArrowLeft size={32} color='white' />
                        <div className={styles.text}>
                            <h2>Editar usuário</h2>
                        </div>
                    </div>
                    <div className={styles.contentValues}>
                        <Input
                            style={{ width: '300px', marginRight: '20px' }}
                            placeholder={user?.name}
                        />
                        <Button
                            style={{ backgroundColor: 'green', width: '80px', height: '35px', color: 'white' }}>Salvar</Button>
                    </div>
                    <div className={styles.contentValues}>
                        <Input
                            style={{ width: '300px', marginRight: '20px' }}
                            placeholder={user?.email}
                        />
                        <Button style={{ backgroundColor: 'green', width: '80px', height: '35px', color: 'white' }}>Salvar</Button>
                    </div>
                </article>
            </main>
        </>
    )
}
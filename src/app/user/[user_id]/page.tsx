"use client"

import Head from 'next/head';

import styles from './styles.module.css';


export default function User({ params }: { params: { user_id: string } }) {



    return (
        <>
            <Head>
                <title>Usuário - Comparador de preços SUMIG</title>
            </Head>

            <div style={{ color: 'white' }} className={styles.containerCenter}>
                <h1>{params?.user_id}</h1>
            </div>
        </>
    )
}
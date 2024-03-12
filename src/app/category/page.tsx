"use client"

import Head from 'next/head';

import styles from './styles.module.css';


export default function Category() {



    return (
        <>
            <Head>
                <title>Categoria - Comparador de preços SUMIG</title>
            </Head>

            <div style={{ color: 'white' }} className={styles.containerCenter}>
                <h1>Categorias</h1>
            </div>
        </>
    )
}
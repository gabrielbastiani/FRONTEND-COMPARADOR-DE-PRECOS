"use client"

import { Header } from '@/components/Header/page';

import styles from './styles.module.css';

export default function Edit_category({ params }: { params: { category_id: string } }) {


    return (
        <>
            <Header />
            <h1>{params.category_id}</h1>
        </>
    )
}
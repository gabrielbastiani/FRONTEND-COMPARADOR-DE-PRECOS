"use client"


import styles from "./styles.module.css";


export default function Historico_preco({ params }: { params: { product_id: string } }) {



    return (
        <>
            <h1>Historico de preços {params?.product_id}</h1>
        </>
    )
}
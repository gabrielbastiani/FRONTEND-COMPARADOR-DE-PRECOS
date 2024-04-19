"use client"

import Image from "next/image";
import { useEffect, useState } from "react";

import { HeaderProducts } from "@/components/HeaderProducts/page";
import LoadingRequests from "@/components/LoadingRequests/page";

import styles from "./styles.module.css";

import { setupAPIClient } from "@/services/api";


type ProductsStoreProps = {
    id: string;
    store: string;
    image: string;
    title_product: string;
    price: number;
    brand: string;
    link: number;
    created_at: string;
}

export default function Products({ params }: { params: { store: string } }) {

    const [listProducts, setListProducts] = useState<ProductsStoreProps[]>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const apiClient = setupAPIClient();
        async function loadStoreProducts() {
            setLoading(true);
            try {
                const response = await apiClient.get(`/store_products?store=${params?.store}`);
                setListProducts(response?.data || []);
                setLoading(false);
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
                setLoading(false);
            }
        }
        loadStoreProducts();
    }, [params?.store]);

    console.log(listProducts)

    return (
        <>
            {loading ?
                <LoadingRequests />
                :
                <>
                    <HeaderProducts />

                    <main className={styles.mainContainer}>
                        <article className={styles.content}>
                            <div className={styles.titleBox}>
                                <h1 className={styles.titulo}>{params?.store}</h1>
                            </div>
                            <div className={styles.grid_container}>
                                {listProducts?.map((item) => {
                                    return (
                                        <>
                                            <div className={styles.item1}>
                                                <Image src={item?.image} width={70} height={70} alt={item?.title_product} />
                                            </div>
                                            <div className={styles.item2}>Main</div>
                                            <div className={styles.item3}>Right</div>
                                            <div className={styles.item4}>Footer</div>
                                        </>
                                    )
                                })}
                            </div>
                        </article>
                    </main>
                </>
            }
        </>
    )
}
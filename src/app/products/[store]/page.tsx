"use client"

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
    },[params?.store]);

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

                        </article>
                    </main>

                </>
            }
        </>
    )
}
"use client"


import { useEffect, useState } from "react";

import { HeaderProducts } from "@/components/HeaderProducts/page";
import LoadingRequests from "@/components/LoadingRequests/page";

import styles from "./styles.module.css";

import { setupAPIClient } from "@/services/api";
import moment from "moment";


type ProductsProps = {
    length: number;
    created_at: string;
    id: string;
    name: string;
    order: number;
    product_id: string;
    slug: string;
    product: {
        created_at: string;
        id: string;
        store: string;
        storeProduct_id: string;
        storeProduct: {
            id: string;
            brand: string;
            created_at: string;
            image: string;
            link: string;
            price: number;
            slug: string;
            store: string;
            title_product: string;
            slug_title_product: string;
        }
    }
}

export default function Historico_preco({ params }: { params: { slug_title_product: string } }) {

    const [listProducts, setListProducts] = useState();
    const [loading, setLoading] = useState<boolean>(false);


    console.log(listProducts)


    useEffect(() => {
        const apiClient = setupAPIClient();
        async function loadStoreProducts() {
            setLoading(true);
            try {
                const response = await apiClient.get(`/find_product_history?slug_title_product=${params?.slug_title_product}`);
                setListProducts(response?.data || []);
                setLoading(false);
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
                setLoading(false);
            }
        }
        loadStoreProducts();
    }, [params?.slug_title_product]);


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
                                {/* <h1 className={styles.titulo}>{"Produtos cadastrados na categoria " + nameCategory}</h1> */}
                            </div>

                            {listProducts?.length === 0 ?
                                <div className={styles.notFound}>
                                    <h2>Não há produtos cadastros nessa categoria no momento...</h2>
                                </div>
                                :
                                <div className={styles.grid_container}>
                                    {listProducts?.map((item, index) => {
                                        return (
                                            <div key={index}>
                                                <div className={styles.title}>
                                                    <h3>{item?.product?.storeProduct?.title_product}</h3>
                                                </div>

                                                <div className={styles.containerInfos}>
                                                    <div className={styles.imageProduct}>
                                                        {/* <Image src={item?.product?.storeProduct?.image} quality={100} width={140} height={125} alt={item?.product?.storeProduct?.title_product} /> */}
                                                    </div>

                                                    <div className={styles.gridContainerProduct}>
                                                        <div className={styles.box}>
                                                            <strong>LOJA: </strong>
                                                            <span>{item?.product?.store}</span>
                                                            <div className={styles.boxBrand}>
                                                                <strong>MARCA:&nbsp;</strong>
                                                                <span>{item?.product?.storeProduct?.brand}</span>
                                                                
                                                            </div>
                                                            <strong>PREÇO: { }</strong>
                                                            <strong style={{ color: 'red' }}>{new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(item?.product?.storeProduct?.price)}</strong>
                                                            <div className={styles.boxData}>
                                                                <strong>DATA: </strong>
                                                                <strong style={{ color: 'rgb(17, 192, 17)' }}>{moment(item?.created_at).format('DD/MM/YYYY - HH:mm')}</strong>
                                                            </div>
                                                        </div>

                                                        <div className={styles.boxCategory}>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={styles.divisorBox}>
                                                    <hr />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            }
                        </article>
                    </main>
                </>
            }
        </>
    )
}
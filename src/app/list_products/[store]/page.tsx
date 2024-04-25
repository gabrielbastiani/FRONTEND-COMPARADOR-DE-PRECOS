"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { toast } from "react-toastify";

import { HeaderProducts } from "@/components/HeaderProducts/page";
import LoadingRequests from "@/components/LoadingRequests/page";

import styles from "./styles.module.css";

import { setupAPIClient } from "@/services/api";
import moment from "moment";


type ProductsProps = {
    id: string;
    storeProduct: {
        id: string;
        store: string;
        image: string;
        title_product: string;
        price: number;
        brand: string;
        link: string;
        created_at: string;
    }
    storeProduct_id: string;
    store: string;
    slug: string;
    created_at: string;
    ProductCategory: {
        id: string;
        product_id: string;
        Category: {
            id: string;
            name: string;
            slug: string;
            image: string;
            nivel: number;
            parentId: string;
            order: number;
            type_category: string;
            status: string;
        }
    }
}

export default function List_products({ params }: { params: { store: string } }) {

    const [listProducts, setListProducts] = useState<ProductsProps[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const [store, setStore] = useState<string>("");

    useEffect(() => {
        const apiClient = setupAPIClient();
        async function loadStore() {
            try {
                const response = await apiClient.get(`/findDataStore?slug=${params?.store}`);
                setStore(response?.data?.store || "");
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
            }
        }
        loadStore();
    }, [params?.store]);

    useEffect(() => {
        const apiClient = setupAPIClient();
        async function loadStoreProducts() {
            setLoading(true);
            try {
                const response = await apiClient.get(`/register_products?slug=${params?.store}`);
                setListProducts(response?.data || []);
                setLoading(false);
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
                setLoading(false);
            }
        }
        loadStoreProducts();
    }, [params?.store]);

    const handleButtonClick = (link: string) => {
        window.open(`${link}`, '_blank');
    };

    async function loadStoreProducts() {
        const apiClient = setupAPIClient();
        setLoading(true);
        try {
            const response = await apiClient.get(`/register_products?slug=${params?.store}`);
            setListProducts(response?.data || []);
            setLoading(false);
        } catch (error) {/* @ts-ignore */
            console.log(error.response.data);
            setLoading(false);
        }
    }

    async function deleteproduct(id: string) {
        const apiClient = setupAPIClient();
        setLoading(true);
        try {
            await apiClient.delete(`/delete_product?product_id=${id}`);
            loadStoreProducts();
            toast.success("Produto descadastrado com sucesso");
            setLoading(false);
        } catch (error) {/* @ts-ignore */
            console.log(error.response.data);
            toast.error("Erro ao descadastrar esse produto")
            setLoading(false);
        }
    }


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
                                <h1 className={styles.titulo}>{"Produtos cadastrados da " + store}</h1>
                            </div>

                            {listProducts?.length === 0 ?
                                <div className={styles.notFound}>
                                    <h2>Não há produtos refernete a essa empresa cadastrada no momento...</h2>
                                </div>
                                :
                                <div className={styles.grid_container}>
                                    {listProducts?.map((item, index) => {
                                        return (
                                            <div key={index}>
                                                <div className={styles.title}>
                                                    <h3>{item?.storeProduct?.title_product}</h3>
                                                </div>

                                                <div className={styles.containerInfos}>
                                                    <div className={styles.imageProduct}>
                                                        <Image src={item?.storeProduct?.image} quality={100} width={140} height={125} alt={item?.storeProduct?.title_product} />
                                                    </div>

                                                    <div className={styles.gridContainerProduct}>
                                                        <div className={styles.box}>
                                                            <strong>LOJA: </strong>
                                                            <span>{item?.store}</span>
                                                            <div className={styles.boxBrand}>
                                                                <strong>MARCA:&nbsp;</strong>
                                                                <span>{item?.storeProduct?.brand}</span>
                                                                <button

                                                                >
                                                                    <CiEdit color='red' size={21} />
                                                                </button>
                                                            </div>
                                                            <strong>PREÇO: </strong>
                                                            <strong style={{ color: 'red' }}>{new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(item?.storeProduct?.price)}</strong>
                                                            <div className={styles.boxData}>
                                                                <strong>DATA: </strong>
                                                                <strong style={{ color: 'rgb(17, 192, 17)' }}>{moment(item?.storeProduct?.created_at).format('DD/MM/YYYY - HH:mm')}</strong>
                                                            </div>
                                                        </div>

                                                        <div className={styles.boxCategory}>
                                                            <button
                                                                className={styles.buttonProduto}
                                                                onClick={() => handleButtonClick(item?.storeProduct?.link)}
                                                            >
                                                                Ver produto
                                                            </button>


                                                            <button

                                                                className={styles.addCategoryButton}
                                                            >
                                                                Cadastrar produto
                                                            </button>


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
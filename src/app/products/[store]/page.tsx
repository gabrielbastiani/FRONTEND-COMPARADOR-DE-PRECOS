"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import Modal from 'react-modal';
import { toast } from "react-toastify";

import { HeaderProducts } from "@/components/HeaderProducts/page";
import LoadingRequests from "@/components/LoadingRequests/page";
import { ModalEditCategory } from "@/components/popups/ModalEditCategory/page";
import { ModalWarning } from "@/components/popups/ModalWarning/page";

import styles from "./styles.module.css";

import { setupAPIClient } from "@/services/api";
import moment from "moment";


type ProductsStoreProps = {
    id: string;
    store: string;
    image: string;
    title_product: string;
    price: number;
    brand: string;
    link: string;
    created_at: string;
    Product: any;
}

export default function Products({ params }: { params: { store: string } }) {

    const [listProducts, setListProducts] = useState<ProductsStoreProps[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modalWarning, setModalWarning] = useState<boolean>(false);
    const [idProduct, setIdProduct] = useState<string>("");
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
                const response = await apiClient.get(`/store_products?slug=${params?.store}`);
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
            const response = await apiClient.get(`/store_products?slug=${params?.store}`);
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

    function handleCloseModal() {
        setModalVisible(false);
    }

    async function handleOpenModal(id: string) {
        setModalVisible(true);
        setIdProduct(id);
    }

    function handleCloseModalWarning() {
        setModalWarning(false);
    }

    async function handleOpenModalWarning(id: string) {
        setModalWarning(true);
        setIdProduct(id);
    }

    Modal.setAppElement('body');


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
                                <h1 className={styles.titulo}>{store}</h1>
                            </div>
                            <div className={styles.grid_container}>
                                {listProducts?.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            <div className={styles.title}>
                                                <h3>{item?.title_product}</h3>
                                            </div>

                                            <div className={styles.containerInfos}>
                                                <div className={styles.imageProduct}>
                                                    <Image src={item?.image} quality={100} width={140} height={125} alt={item?.title_product} />
                                                </div>

                                                <div className={styles.gridContainerProduct}>
                                                    <div className={styles.box}>
                                                        <strong>LOJA: </strong>
                                                        <span>{item?.store}</span>
                                                        <div className={styles.boxBrand}>
                                                            <strong>MARCA:&nbsp;</strong>
                                                            <span>{item?.brand}</span>
                                                            <button
                                                                onClick={() => handleOpenModal(item?.id)}
                                                            >
                                                                <CiEdit color='red' size={21} />
                                                            </button>
                                                        </div>
                                                        <strong>PREÇO: </strong>
                                                        <strong style={{ color: 'red' }}>{new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(item?.price)}</strong>
                                                        <div className={styles.boxData}>
                                                            <strong>DATA: </strong>
                                                            <strong style={{ color: 'rgb(17, 192, 17)' }}>{moment(item?.created_at).format('DD/MM/YYYY - HH:mm')}</strong>
                                                        </div>
                                                    </div>

                                                    <div className={styles.boxCategory}>
                                                        <button
                                                            className={styles.buttonProduto}
                                                            onClick={() => handleButtonClick(item?.link)}
                                                        >
                                                            Ver produto
                                                        </button>

                                                        {item.Product.length === 1 ?
                                                            <button
                                                                style={{ backgroundColor: 'gray' }}
                                                                onClick={() => deleteproduct(item?.Product[0]?.id)}
                                                                className={styles.addCategoryButton}
                                                            >
                                                                Descadastrar produto
                                                            </button>
                                                            :
                                                            <button
                                                                onClick={() => handleOpenModalWarning(item?.id)}
                                                                className={styles.addCategoryButton}
                                                            >
                                                                Cadastrar produto
                                                            </button>
                                                        }

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
                        </article>
                    </main>
                </>
            }
            {modalVisible && (
                <ModalEditCategory
                    isOpen={modalVisible}
                    onRequestClose={handleCloseModal}
                    productId={idProduct}
                    productLoad={loadStoreProducts}
                />
            )}

            {modalWarning && (
                <ModalWarning
                    isOpen={modalWarning}
                    onRequestClose={handleCloseModalWarning}
                    productId={idProduct}
                    store={store}
                    modalBrand={handleOpenModal}
                    productLoad={loadStoreProducts}
                />
            )}
        </>
    )
}
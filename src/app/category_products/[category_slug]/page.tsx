"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaTrashAlt } from "react-icons/fa";
import Modal from 'react-modal';
import { toast } from "react-toastify";

import { HeaderProducts } from "@/components/HeaderProducts/page";
import { Input } from "@/components/Input/page";
import LoadingRequests from "@/components/LoadingRequests/page";
import { ModalDateProduct } from "@/components/popups/ModalDateProduct/page";
import { ModalDeleteProduct } from "@/components/popups/ModalDeleteProduct/page";
import { ModalEditBrand } from "@/components/popups/ModalEditBrand/page";

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
        link: string;ima e
        created_at: string;
    }
    storeProduct_id: string;
    store: string;
    slug: string;
    created_at: string;
    productCategory: {
        map(arg0: (item: any) => import("react").JSX.Element): unknown;
        length: number;
        id: string;
        product_id: string;
        name: string;
        category: {
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

type CategorysProps = {
    id: string;
    name: string;
    slug: string;
    image: string;
}

export default function Category_products({ params }: { params: { category_slug: string } }) {

    const [listProducts, setListProducts] = useState<ProductsProps[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const [categorys, setCategorys] = useState<CategorysProps[]>();
    const [nameCategory, setNameCategory] = useState<string>("");
    const [idProduct, setIdProduct] = useState<string>("");
    const [categoryName, setCategoryName] = useState<string>("");
    const [order, setOrder] = useState<number>(Number);
    const [orderCategory, setOrderCategory] = useState<number>(Number);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modalVisibleDeleteProduct, setModalVisibleDeleteProduct] = useState<boolean>(false);
    const [modalVisibleDateProduct, setModalVisibleDateProduct] = useState<boolean>(false);

    async function handleIdProduct(id: string) {
        setIdProduct(id);
    }

    function handleNameCategory(e: any) {
        setNameCategory(e.target.value);
    }

    useEffect(() => {
        const apiClient = setupAPIClient();
        async function loadStoreProducts() {
            setLoading(true);
            try {
                const response = await apiClient.get(`/products_category?slug=${params?.category_slug}`);
                setListProducts(response?.data || []);
                setLoading(false);
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
                setLoading(false);
            }
        }
        loadStoreProducts();
    }, [params?.category_slug]);

    const handleButtonClick = (link: string) => {
        window.open(`${link}`, '_blank');
    };

    async function loadStoreProducts() {
        const apiClient = setupAPIClient();
        setLoading(true);
        try {
            const response = await apiClient.get(`/register_products?slug=${params?.category_slug}`);
            setListProducts(response?.data || []);
            setLoading(false);
        } catch (error) {/* @ts-ignore */
            console.log(error.response.data);
            setLoading(false);
        }
    }

    useEffect(() => {
        const apiClient = setupAPIClient();
        async function loadCategorys() {
            try {
                const { data } = await apiClient.get('/all_categorys');
                setCategorys(data?.all_categorys || []);
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
            }
        }
        loadCategorys();
    }, []);

    async function handleRegisterCategory() {
        const apiClient = setupAPIClient();
        setLoading(true);
        try {
            await apiClient.post(`/create_category_product`, {
                product_id: idProduct,
                name: nameCategory,
                order: order
            });
            loadStoreProducts();
            setLoading(false);
            toast.success("Categoria registrada com sucesso");
        } catch (error) {/* @ts-ignore */
            console.log(error.response.data);
            setLoading(false);
            toast.error("Erro ao cadastrar categoria no produto");
        }
    }

    async function handleOpenModal(id: string) {
        setModalVisible(true);
        setIdProduct(id);
    }

    function handleCloseModal() {
        setModalVisible(false);
    }

    async function handleOpenModalDeleteProduct(id: string) {
        setModalVisibleDeleteProduct(true);
        setIdProduct(id);
    }

    function handleCloseModalDeleteProduct() {
        setModalVisibleDeleteProduct(false);
    }

    async function handleOpenModalDateProduct(id: string, name: string, order: number) {
        setModalVisibleDateProduct(true);
        setIdProduct(id);
        setCategoryName(name);
        setOrderCategory(order);
    }

    function handleCloseModalDateProduct() {
        setModalVisibleDateProduct(false);
    }

    Modal.setAppElement('body');



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
                                <h1 className={styles.titulo}>{"Produtos cadastrados na categoria" + params?.category_slug}</h1>
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
                                                                    onClick={() => handleOpenModal(item?.storeProduct?.id)}
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

                                                        <div>
                                                            <FaTrashAlt
                                                                size={25}
                                                                color="red"
                                                                cursor="pointer"
                                                                onClick={() => handleOpenModalDeleteProduct(item?.id)}
                                                            />
                                                        </div>

                                                        <div className={styles.boxCategory}>

                                                            <button
                                                                className={styles.buttonProduto}
                                                                onClick={() => handleButtonClick(item?.storeProduct?.link)}
                                                            >
                                                                Ver produto
                                                            </button>

                                                            {item?.productCategory?.length === 0 ?
                                                                <span className={styles.notFoundCategs}>Sem categorias cadastradas...</span>
                                                                :
                                                                <>
                                                                    <strong className={styles.categoryStrong}>Categorias</strong>

                                                                    {item?.productCategory.map((item) => {
                                                                        return (
                                                                            <ul key={item.name}>
                                                                                <li
                                                                                    className={styles.categs}
                                                                                >
                                                                                    {item.name}
                                                                                    <CiEdit
                                                                                        color='red'
                                                                                        size={21}
                                                                                        cursor="pointer"
                                                                                        onClick={() => handleOpenModalDateProduct(item?.id, item?.name, item?.order)}
                                                                                    />
                                                                                </li>
                                                                            </ul>
                                                                        )
                                                                    })}
                                                                </>
                                                            }

                                                            <select
                                                                className={styles.selectImput}
                                                                onChange={handleNameCategory}
                                                                onClick={() => handleIdProduct(item?.id)}
                                                            >
                                                                <option value="">Selecione as categoria aqui...</option>
                                                                {categorys?.map((cat) => (
                                                                    <option key={cat?.id} value={cat?.name}>{cat.name}</option>
                                                                ))}
                                                            </select>

                                                            <label className={styles.position}>Posição da categoria</label>
                                                            <Input
                                                                placeholder="Ordem"
                                                                type='number'
                                                                value={order}/* @ts-ignore */
                                                                onChange={(e) => setOrder(e.target.value)}
                                                            />

                                                            <button
                                                                className={styles.addCategoryButton}
                                                                onClick={handleRegisterCategory}
                                                            >
                                                                Cadastrar categoria
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
                    {modalVisible && (
                        <ModalEditBrand
                            isOpen={modalVisible}
                            onRequestClose={handleCloseModal}
                            productId={idProduct}
                            productLoad={loadStoreProducts}
                        />
                    )}
                    {modalVisibleDeleteProduct && (
                        <ModalDeleteProduct
                            isOpen={modalVisibleDeleteProduct}
                            onRequestClose={handleCloseModalDeleteProduct}
                            productId={idProduct}
                            productLoad={loadStoreProducts}
                        />
                    )}
                    {modalVisibleDateProduct && (
                        <ModalDateProduct
                            isOpen={modalVisibleDateProduct}
                            onRequestClose={handleCloseModalDateProduct}
                            productCategory={idProduct}
                            nameCategory={categoryName}
                            positionCategory={orderCategory}
                            productLoad={loadStoreProducts}
                        />
                    )}
                </>
            }
        </>
    )
}
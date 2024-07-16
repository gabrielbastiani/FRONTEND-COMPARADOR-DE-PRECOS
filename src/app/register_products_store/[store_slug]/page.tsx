"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaArrowLeft, FaArrowRight, FaTrashAlt } from "react-icons/fa";
import Modal from 'react-modal';

import { Button } from "@/components/Button/page";
import { Header } from "@/components/Header/page";
import LoadingRequests from "@/components/LoadingRequests/page";
import { ModalCategory } from "@/components/popups/ModalCategory/page";
import { ModalEditBrand } from "@/components/popups/ModalEditBrand/page";
import { ModalProductCategory } from "@/components/popups/ModalProductCategory/page";

import styles from "./styles.module.css";

import { setupAPIClient } from "@/services/api";
import moment from "moment";


type ProductsStoreProps = {
    id: string;
    slug_type: string;
    store: string;
    slug: string;
    link_search: string;
    image: string;
    title_product: string;
    slug_title_product: string;
    price: number;
    brand: string;
    link: string;
    created_at: string;
    productCategory: {
        length: number;
        id: string;
        category_id: string;
        storeProduct_id: string;
        name: string;
        slug: string;
        order: number;
        created_at: string;
    }[];
}

export default function Register_products_store({ params }: { params: { store_slug: string } }) {

    const router = useRouter();

    const [listProducts, setListProducts] = useState<ProductsStoreProps[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);
    const [storeDate, setStoreDate] = useState<string>("");
    const [idProduct, setIdProduct] = useState<string>("");
    const [storeProduct_id, setStoreProduct_id] = useState<string>("");
    const [slugTitleProduct, setSlugTitleProduct] = useState<string>("");
    const [store, setStore] = useState<string>("");
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modalVisibleCategorysProduct, setModalVisibleCategorysProduct] = useState<boolean>(false);
    const [modalVisibleCategorys, setModalVisibleCategorys] = useState<boolean>(false);

    const initialFilters = {
        filter: '',
        minPrice: '',
        maxPrice: '',
        sort: 'price',
        order: 'desc',
        limit: 10
    };

    const [filters, setFilters] = useState(initialFilters);

    useEffect(() => {
        const apiClient = setupAPIClient();
        async function loadStoreProducts() {
            try {
                const response = await apiClient.get(`/list_all_products_store`, {
                    params: {
                        slug: params.store_slug,
                        page: currentPage,
                        limit: filters.limit,
                        filter: filters.filter,
                        sort: filters.sort,
                        order: filters.order,
                        minPrice: filters.minPrice,
                        maxPrice: filters.maxPrice
                    },
                });
                const uniqueProducts = response?.data?.product?.reduce((acc: any[], product: { title_product: any; }) => {
                    if (!acc.find(p => p.title_product === product.title_product)) {
                        acc.push(product);
                    }
                    return acc;
                }, []);

                setListProducts(uniqueProducts || []);
                setTotalPages(response?.data?.totalPages);
                setStoreDate(response?.data?.productDate?.store || "");
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
            }
        }
        loadStoreProducts();
    }, [currentPage, filters.filter, filters.limit, filters.maxPrice, filters.minPrice, filters.order, filters.sort, params?.store_slug]);

    async function loadStoreProducts() {
        const apiClient = setupAPIClient();
        setLoading(true);
        try {
            const response = await apiClient.get(`/list_all_products_store`, {
                params: {
                    slug: params.store_slug,
                    page: currentPage,
                    limit: filters.limit,
                    filter: filters.filter,
                    sort: filters.sort,
                    order: filters.order,
                    minPrice: filters.minPrice,
                    maxPrice: filters.maxPrice
                },
            });
            setListProducts(response?.data?.product || []);
            setTotalPages(response?.data?.totalPages);
            setStoreDate(response?.data?.productDate?.name || "");
            setLoading(false);
        } catch (error) {/* @ts-ignore */
            console.log(error.response.data);
            setLoading(false);
        }
    }

    const updateFilter = (filter: string, value: string | number) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filter]: value,
        }));
    };

    const applyFilters = () => {
        setCurrentPage(1);
        loadStoreProducts();
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateFilter('limit', parseInt(e.target.value));
        setCurrentPage(1);
    };

    const renderPagination = () => {
        const pages = [];
        const maxPagesToShow = 10;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = startPage + maxPagesToShow - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`${styles.paginationButton} ${i === currentPage ? styles.current : ''}`}
                    disabled={i === currentPage}
                >
                    {i}
                </button>
            );
        }

        return pages;
    };

    const resetFilters = () => {
        setFilters(initialFilters);
        setCurrentPage(1);
    };

    const handleButtonClick = (link: string) => {
        window.open(`${link}`, '_blank');
    };

    async function handleOpenModal(id: string) {
        setModalVisible(true);
        setIdProduct(id);
    }

    function handleCloseModal() {
        setModalVisible(false);
    }

    async function handleOpenModalDeleteProduct(id: string, storeProduct_id: string) {
        setModalVisibleCategorysProduct(true);
        setIdProduct(id);
        setStoreProduct_id(storeProduct_id);
    }

    function handleCloseModalDeleteProduct() {
        setModalVisibleCategorysProduct(false);
    }

    async function handleOpenModalCategorys(id: string, store: string, slug_title_product: string) {
        setModalVisibleCategorys(true);
        setIdProduct(id);
        setStore(store);
        setSlugTitleProduct(slug_title_product)
    }

    function handleCloseModalCategorys() {
        setModalVisibleCategorys(false);
    }

    Modal.setAppElement('body');



    return (
        <>
            {loading ?
                <LoadingRequests />
                :
                <>
                    <Header />

                    <main className={styles.mainContainer}>
                        <article className={styles.content}>
                            <div className={styles.titleBox}>
                                <div className={styles.contentText}>
                                    <FaArrowLeft
                                        onClick={() => router.back()}
                                        size={32}
                                        color='red'
                                    />
                                    <h1 className={styles.titulo}>{"Produtos capturados da loja " + storeDate}</h1>
                                </div>
                                <div className={styles.containerFilters}>
                                    <div className={styles.boxFilters}>
                                        <label>Pesquisar: </label>
                                        <input type="text" value={filters.filter} onChange={(e) => updateFilter('filter', e.target.value)} placeholder="Busque aqui..." />
                                    </div>
                                    <div className={styles.boxFilters}>
                                        <label>Por faixa de preço: </label>
                                        De&nbsp;&nbsp;
                                        <input type="text" value={filters.minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)} placeholder="Preço minimo (EX: 250)" />
                                        Até&nbsp;&nbsp;&nbsp;
                                        <input type="text" value={filters.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} placeholder="Preço máximo (EX: 2000)" />
                                        <Button onClick={applyFilters}>Aplicar filtro de preço</Button>
                                    </div>
                                    <div className={styles.boxFilters}>
                                        <label>Ordenação: </label>
                                        <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}>
                                            <option value="price">Preço</option>
                                            <option value="created_at">Data</option>
                                        </select>
                                        <select value={filters.order} onChange={(e) => updateFilter('order', e.target.value)}>
                                            <option value="desc">Maior para o menor</option>
                                            <option value="asc">Menor para o maior</option>
                                        </select>
                                    </div>
                                    <div className={styles.boxFilters}>
                                        <label>Produtos por página: </label>
                                        <select value={filters.limit} onChange={handleLimitChange}>
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={20}>20</option>
                                            <option value={50}>50</option>
                                        </select>
                                        <Button onClick={resetFilters}>Resetar filtros</Button>
                                    </div>
                                </div>
                            </div>
                            {listProducts?.length === 0 ?
                                <div className={styles.notFound}>
                                    <h2>Não há produtos capturados dessa loja no momento...</h2>
                                </div>
                                :
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
                                                            <strong>PREÇO: { }</strong>
                                                            <strong style={{ color: 'red' }}>{new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(item?.price)}</strong>
                                                            <div className={styles.boxData}>
                                                                <strong>DATA: </strong>
                                                                <strong style={{ color: 'rgb(17, 192, 17)' }}>{moment(item?.created_at).format('DD/MM/YYYY - HH:mm')}</strong>
                                                            </div>
                                                        </div>


                                                        {item.productCategory.filter(item => item.category_id === params?.store_slug[0]).map((item, index) => {
                                                            return (
                                                                <div key={index}>
                                                                    <FaTrashAlt
                                                                        size={25}
                                                                        color="red"
                                                                        cursor="pointer"
                                                                        onClick={() => handleOpenModalDeleteProduct(item?.id, item?.storeProduct_id)}
                                                                    />
                                                                </div>
                                                            )
                                                        })}

                                                        <div className={styles.boxCategory}>

                                                            <button
                                                                className={styles.buttonProduto}
                                                                onClick={() => handleButtonClick(item?.link)}
                                                            >
                                                                Ver produto
                                                            </button>

                                                            {item.productCategory.filter(item => item.category_id === params?.store_slug[0]).map((categs, index) => {
                                                                return (
                                                                    <div key={index}>
                                                                        <button
                                                                            className={styles.buttonProdutoCategs}
                                                                            onClick={() => handleOpenModalCategorys(item?.id, item?.store, item?.slug_title_product)}
                                                                        >
                                                                            Registros de categorias
                                                                        </button>
                                                                    </div>
                                                                )
                                                            })}

                                                            <button
                                                                className={styles.buttonPrices}
                                                                onClick={() => router.push(`/historico_preco/${item?.slug}/${item?.slug_title_product}`)}
                                                            >
                                                                Historico de Preços
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
                            <div className={styles.boxPages}>
                                <button className={styles.buttonPrevius} disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}><FaArrowLeft size={25} /></button>
                                {renderPagination()}
                                <button className={styles.buttonNext} disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}><FaArrowRight size={25} /></button>
                            </div>

                            <div className={styles.boxPagesTotal}>
                                Página {currentPage} de {totalPages}
                            </div>
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
                    {modalVisibleCategorysProduct && (
                        <ModalProductCategory
                            isOpen={modalVisibleCategorysProduct}
                            onRequestClose={handleCloseModalDeleteProduct}
                            productCategory={idProduct}
                            productLoad={loadStoreProducts}
                            storeProduct_id={storeProduct_id}
                        />
                    )}
                    {modalVisibleCategorys && (
                        <ModalCategory
                            isOpen={modalVisibleCategorys}
                            onRequestClose={handleCloseModalCategorys}
                            productCategory={idProduct}
                            store={store}
                            slug_title_product={slugTitleProduct}
                            productLoad={loadStoreProducts}
                        />
                    )}
                </>
            }
        </>
    )
}
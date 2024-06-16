"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Modal from 'react-modal';
import { toast } from "react-toastify";

import { Button } from "@/components/Button/page";
import { HeaderProducts } from "@/components/HeaderProducts/page";
import LoadingRequests from "@/components/LoadingRequests/page";
import { ModalEditBrand } from "@/components/popups/ModalEditBrand/page";
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
    product: any;
}

export default function Products({ params }: { params: { store: string } }) {

    const [listProducts, setListProducts] = useState<ProductsStoreProps[]>();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modalWarning, setModalWarning] = useState<boolean>(false);
    const [idProduct, setIdProduct] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [store, setStore] = useState<string>("");

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
            try {
                const response = await apiClient.get(`/page_products`, {
                    params: {
                        slug: params?.store,
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
                setTotalPages(response.data.totalPages);
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
            }
        }
        loadStoreProducts();
    }, [currentPage, filters.filter, filters.limit, filters.maxPrice, filters.minPrice, filters.order, filters.sort, params?.store]);

    async function loadStoreProducts() {
        const apiClient = setupAPIClient();
        setLoading(true);
        try {
            const response = await apiClient.get(`/page_products`, {
                params: {
                    slug: params?.store,
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
            setTotalPages(response.data.totalPages);
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

    async function handleOpenModalWarning(id: string, title_product: string) {
        setModalWarning(true);
        setIdProduct(id);
        setTitle(title_product);
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
                                <h1 className={styles.titulo}>{store}</h1>
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

                                                        {item.product.length === 1 ?
                                                            <button
                                                                style={{ backgroundColor: 'gray' }}
                                                                onClick={() => deleteproduct(item?.product[0]?.id)}
                                                                className={styles.addCategoryButton}
                                                            >
                                                                Descadastrar produto
                                                            </button>
                                                            :
                                                            <button
                                                                onClick={() => handleOpenModalWarning(item?.id, item?.title_product)}
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
                                <div className={styles.boxPages}>
                                    <button className={styles.buttonPrevius} disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}><FaArrowLeft size={25} /></button>
                                    {renderPagination()}
                                    <button className={styles.buttonNext} disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}><FaArrowRight size={25} /></button>
                                </div>

                                <div className={styles.boxPagesTotal}>
                                    Página {currentPage} de {totalPages}
                                </div>
                            </div>
                        </article>
                    </main>
                </>
            }
            {modalVisible && (
                <ModalEditBrand
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
                    titleProduct={title}
                    store={store}
                    modalBrand={handleOpenModal}
                    productLoad={loadStoreProducts}
                />
            )}
        </>
    )
}
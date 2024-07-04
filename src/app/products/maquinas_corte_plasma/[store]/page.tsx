"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Modal from 'react-modal';
import { toast } from "react-toastify";

import { Button } from "@/components/Button/page";
import { Header } from "@/components/Header/page";
import LoadingRequests from "@/components/LoadingRequests/page";
import { ModalDateProduct } from "@/components/popups/ModalDateProduct/page";
import { ModalEditBrand } from "@/components/popups/ModalEditBrand/page";

import styles from "./styles.module.css";

import { setupAPIClient } from "@/services/api";
import moment from "moment";


type ProductsStoreProps = {
    id: string;
    type_product: string;
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
        storeProduct_id: string;
        name: string;
        slug: string;
        order: number;
        created_at: string;
        slug_title_product: string;
        store: string;
    }[];
}

type CategorysProps = {
    id: string;
    name: string;
    category_id: string;
    slug: string;
    image: string;
}

export default function Products({ params }: { params: { store: string } }) {

    const router = useRouter();

    const [listProducts, setListProducts] = useState<ProductsStoreProps[]>([]);
    const [categorysProducts, setCategorysProducts] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [idProduct, setIdProduct] = useState<string>("");
    const [store, setStore] = useState<string>("");
    const [modalVisibleDateProduct, setModalVisibleDateProduct] = useState<boolean>(false);
    const [categoryName, setCategoryName] = useState<string>("");
    const [orderCategory, setOrderCategory] = useState<number>(Number);
    const [nameCategory, setNameCategory] = useState<{ name: string; categoryId: string | null }>({ name: '', categoryId: null });
    const [categorys, setCategorys] = useState<CategorysProps[]>();

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
        async function loadCategorys() {
            try {
                const { data } = await apiClient.get('/all_categorys');
                setCategorys(data?.categorys_zero || []);
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
            }
        }
        loadCategorys();
    }, []);

    useEffect(() => {
        const apiClient = setupAPIClient();
        async function loadCategorysProductsAll() {
            try {
                const response = await apiClient.get('/list_all_products_categorys');
                setCategorysProducts(response?.data || []);
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
            }
        }
        loadCategorysProductsAll();
    }, []);

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
                const response = await apiClient.get(`/page_products_machine_cut`, {
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
                const uniqueProducts = response?.data?.product?.reduce((acc: any[], product: { title_product: any; }) => {
                    if (!acc.find(p => p.title_product === product.title_product)) {
                        acc.push(product);
                    }
                    return acc;
                }, []);

                setListProducts(uniqueProducts || []);
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
            const response = await apiClient.get(`/page_products_machine_cut`, {
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
            const uniqueProducts = response?.data?.product?.reduce((acc: any[], product: { title_product: any; }) => {
                if (!acc.find(p => p.title_product === product.title_product)) {
                    acc.push(product);
                }
                return acc;
            }, []);

            setListProducts(uniqueProducts || []);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (error) {/* @ts-ignore */
            console.log(error.response.data);
            setLoading(false);
        }
    }

    async function handleIdProduct(id: string) {
        setIdProduct(id);
    }

    const handleNameCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const [name, categoryId] = event.target.value.split(',');
        setNameCategory({ name, categoryId });
        console.log('Name:', name, 'Category ID:', categoryId);
    };

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

    async function handleRegisterCategory(id: string, slug_title_product: string, store: string) {
        const apiClient = setupAPIClient();
        setLoading(true);
        try {
            await apiClient.post(`/create_category_product`, {
                storeProduct_id: id,
                category_id: nameCategory.categoryId,
                name: nameCategory.name,
                order: 0,
                slug_title_product: slug_title_product,
                store: store
            });
            setLoading(false);
            toast.success("Categoria registrada com sucesso.");
            window.location.reload();
        } catch (error) {/* @ts-ignore */
            if (error.response.data?.error === "Categoria já cadastrada nesse produto!") {
                /* @ts-ignore */
                toast.error(error.response.data?.error);
                setLoading(false);
            } else {/* @ts-ignore */
                console.log(error.response.data);
                setLoading(false);
                toast.error("Erro ao cadastrar esse produto nesta categoria!")
            }
        }
    }

    function handleCloseModal() {
        setModalVisible(false);
    }

    async function handleOpenModal(id: string) {
        setModalVisible(true);
        setIdProduct(id);
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
                                    <h1 className={styles.titulo}>{store}</h1>
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
                            <div className={styles.grid_container}>
                                {listProducts.filter(product => !categorysProducts.some(category => category.slug_title_product === product.slug_title_product)).map((item, index) => {
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

                                                        {item?.productCategory?.length === 0 ?
                                                            <span className={styles.notFoundCategs}>Sem categorias cadastradas...</span>
                                                            :
                                                            <>
                                                                <strong className={styles.categoryStrong}>Categorias</strong>

                                                                {Array.isArray(item?.productCategory) ? (
                                                                    item?.productCategory.map((item) => {
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
                                                                    })
                                                                ) : (
                                                                    <p>Recarregue a página por favor...</p>
                                                                )}
                                                            </>
                                                        }

                                                        <select
                                                            className={styles.selectImput}
                                                            onChange={handleNameCategory}
                                                            onClick={() => handleIdProduct(item?.id)}
                                                        >
                                                            <option value="">Selecione a categoria aqui...</option>
                                                            {categorys?.[1] ? (
                                                                <option value={`${categorys[1].name},${categorys[1].id}`}>{categorys[1].name}</option>
                                                            ) : (
                                                                <option value="" disabled>Nenhuma categoria disponível</option>
                                                            )}
                                                        </select>

                                                        <button
                                                            className={styles.addCategoryButton}
                                                            onClick={() => handleRegisterCategory(item?.id, item?.slug_title_product, item?.store)}
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
    )
}
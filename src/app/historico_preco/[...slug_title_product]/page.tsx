"use client"


import { FunctionComponent, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Header } from "@/components/Header/page";
import LoadingRequests from "@/components/LoadingRequests/page";

import styles from "./styles.module.css";

import { setupAPIClient } from "@/services/api";
import moment from "moment";
import { CartesianGrid, ComposedChart, LabelList, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


export default function Historico_preco({ params }: { params: { slug: string, slug_title_product: string } }) {

    const [listProducts, setListProducts] = useState<any[]>([]);
    const [comparativeProducts, setComparativeProducts] = useState<any[]>([]);
    const [name, setName] = useState<string>("");
    const [link, setLink] = useState<string>("");
    const [linkSearch, setLinkSearch] = useState<string>("");
    const [store, setStore] = useState<string>("");
    const [slugType, setSlugType] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [average, setAverage] = useState<number>(0);
    const [minValue, setMinValue] = useState<number>(0);
    const [timeMinValue, setTimeMinValue] = useState();
    const [maxAmount, setMaxAmount] = useState<number>(0);
    const [creationDate, setCreationDate] = useState();
    const [showCoparative, setShowCoparative] = useState<boolean>(false);

    const showOrHide = () => {
        setShowCoparative(!showCoparative);
    }

    useEffect(() => {
        const apiClient = setupAPIClient();
        async function loadStoreProducts() {
            setLoading(true);
            try {
                const { data } = await apiClient.get(`/find_product_history?slug_title_product=${params?.slug_title_product[1]}&slug=${params?.slug_title_product[0]}`);
                setListProducts(data?.product || []);
                setComparativeProducts(data?.allProduct || []);
                setLink(data?.date_product?.link || "");
                setLinkSearch(data?.date_product?.link_search || "");
                setName(data?.date_product?.title_product || "");
                setStore(data?.date_product?.store || "");
                setSlugType(data?.date_product?.slug_type || "");
                setLoading(false);
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
                setLoading(false);
            }
        }
        loadStoreProducts();
    }, [params?.slug_title_product]);

    async function loadStoreProducts() {
        const apiClient = setupAPIClient();
        setLoading(true);
        try {
            const { data } = await apiClient.get(`/find_product_history?slug_title_product=${params?.slug_title_product[1]}&slug=${params?.slug_title_product[0]}`);
            setListProducts(data?.product || []);
            setComparativeProducts(data?.allProduct || []);
            setLink(data?.date_product?.link || "");
            setLinkSearch(data?.date_product?.link_search || "");
            setName(data?.date_product?.title_product || "");
            setStore(data?.date_product?.store || "");
            setSlugType(data?.date_product?.slug_type || "");
            setLoading(false);
        } catch (error) {/* @ts-ignore */
            console.log(error.response.data);
            setLoading(false);
        }
    }

    const date_product: any = [];
    (listProducts || []).forEach((item) => {
        date_product.push({
            "Data": moment(item.created_at).format('DD/MM/YYYY - HH:mm'),
            "Preço": item.price
        });
    });

    const CustomizedLabel: FunctionComponent<any> = (props: any) => {
        const { x, y, stroke, value } = props;

        return (
            <text x={x} y={y} dy={-4} fill={stroke} fontSize={14} textAnchor="middle">
                {value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </text>
        );
    };

    const handleButtonClick = (link: string) => {
        window.open(`${link}`, '_blank');
    };

    useEffect(() => {
        const amounts = listProducts.map(transaction => transaction.price);
        const total = amounts.reduce((acc, amount) => acc + amount, 0);
        const avg = total / amounts.length;
        setAverage(avg);

        if (listProducts.length > 0) {
            const minRecord = listProducts.reduce((minRecord, currentRecord) => {
                return currentRecord.price < minRecord.price ? currentRecord : minRecord;
            }, listProducts[0]);
            setMinValue(minRecord.price);
            setTimeMinValue(minRecord.created_at);
        }

        if (listProducts.length > 0) {
            const maxRecord = listProducts.reduce((prev, current) => {
                return (prev.price > current.price) ? prev : current;
            });

            setMaxAmount(maxRecord.price);
            setCreationDate(maxRecord.created_at);
        }

    }, [listProducts]);

    const formattedData = comparativeProducts.map(item => ({
        ...item,
        data: moment(item.created_at).format('DD/MM/YYYY - HH:mm')
    }));

    const groupedData = formattedData.reduce((acc, item) => {
        if (!acc[item.store]) {
            acc[item.store] = [];
        }
        acc[item.store].push(item);
        return acc;
    }, {});

    const chartData = Object.keys(groupedData).map(store => ({
        store,
        data: groupedData[store]
    }));

    const CustomizedLabelComparative: FunctionComponent<any> = (props: any) => {
        const { x, y, stroke, value } = props;

        return (
            <text x={x} y={y} dy={-4} fill={stroke} fontSize={14} textAnchor="middle">
                {value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </text>
        );
    };

    const handleButtonClickComaratives = (e: any, payload: any) => {
        window.open(`${payload?.payload?.link}`, '_blank');
    };

    async function handleStoreProducts() {
        setLoading(true);
        const valorCodificado = encodeURIComponent(String(linkSearch));
        const apiClient = setupAPIClient();
        if (slugType === "maquinas-de-solda") {
            try {
                await apiClient.get(`/search_machines_welding?urlSearchStore=${valorCodificado}&stores=${store}`);
                setLoading(false);
                toast.success(`Produtos da concorrência ${store} capturados com sucesso`);
                loadStoreProducts();
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
                toast.error(`Erro ao carregar dados da concorrência ${store}`);
                setLoading(false);
            }
        }

        if (slugType === "maquinas-de-corte-plasma-manual") {
            try {
                await apiClient.get(`/search_machines_cut?urlSearchStore=${valorCodificado}&stores=${store}`);
                setLoading(false);
                toast.success(`Produtos da concorrência ${store} capturados com sucesso`);
                loadStoreProducts();
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
                toast.error(`Erro ao carregar dados da concorrência ${store}`);
                setLoading(false);
            }
        }
    }

    async function handleStoreSUMIGOrEsabProducts() {
        setLoading(true);
        const apiClient = setupAPIClient();
        if (store === "ESAB" && slugType === "maquinas-de-solda") {
            try {
                await apiClient.get(`/esab_machines_weld`);
                setLoading(false);
                toast.success(`Produtos da ESAB capturados com sucesso`);
                loadStoreProducts();
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
                toast.error(`Erro ao carregar dados da ESAB`);
                setLoading(false);
            }
        }

        if (store === "ESAB" && slugType === "maquinas-de-corte-plasma-manual") {
            try {
                await apiClient.get(`/esab_machines_cut`);
                setLoading(false);
                toast.success(`Produtos da ESAB capturados com sucesso`);
                loadStoreProducts();
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
                toast.error(`Erro ao carregar dados da ESAB`);
                setLoading(false);
            }
        }

        if (store === "SUMIG" && slugType === "maquinas-de-solda") {
            try {
                await apiClient.get(`/sumig_machines_weld`);
                setLoading(false);
                toast.success(`Produtos da SUMIG capturados com sucesso`);
                loadStoreProducts();
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
                toast.error(`Erro ao carregar dados da SUMIG`);
                setLoading(false);
            }
        }

        if (store === "SUMIG" && slugType === "maquinas-de-corte-plasma-manual") {
            try {
                await apiClient.get(`/sumig_machines_cut`);
                setLoading(false);
                toast.success(`Produtos da SUMIG capturados com sucesso`);
                loadStoreProducts();
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
                toast.error(`Erro ao carregar dados da SUMIG`);
                setLoading(false);
            }
        }
    }

    async function handleAllStoreProductsMachines() {
        setLoading(true);
        const apiClient = setupAPIClient();
        if (slugType === "maquinas-de-solda") {
            try {
                await apiClient.get(`/search_all_stores_machines`);
                setLoading(false);
                toast.success(`Produtos da concorrência capturados com sucesso`);
                loadStoreProducts();
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
                toast.error(`Erro ao carregar dados da concorrência`);
                setLoading(false);
            }
        }

        if (slugType === "maquinas-de-corte-plasma-manual") {
            try {
                await apiClient.get(`/search_all_stores_cuts`);
                setLoading(false);
                toast.success(`Produtos da concorrência capturados com sucesso`);
                loadStoreProducts();
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
                toast.error(`Erro ao carregar dados da concorrência`);
                setLoading(false);
            }
        }
        
    }


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
                                <h1 className={styles.titulo}>Histórico do produto</h1>
                            </div>

                            <div className={styles.grid_container}>

                                <h2>{name}</h2>
                                <br />
                                <h3>LOJA: {store}</h3>
                                <br />
                                <br />
                                <div className={styles.boxButtons}>
                                    <button
                                        className={styles.buttonProduto}
                                        onClick={() => handleButtonClick(link)}
                                    >
                                        Ver produto
                                    </button>

                                    {store === "SUMIG" || store === "ESAB" ?
                                        <button
                                            className={styles.searchProduto}
                                            onClick={handleStoreSUMIGOrEsabProducts}
                                        >
                                            Atualizar preços
                                        </button>
                                        :
                                        <button
                                            className={styles.searchProduto}
                                            onClick={handleStoreProducts}
                                        >
                                            Atualizar preços
                                        </button>
                                    }

                                </div>
                                <br />
                                <br />
                                <br />
                                <ResponsiveContainer width="100%" height={400}>
                                    <ComposedChart
                                        width={500}
                                        height={400}
                                        data={date_product}
                                        margin={{
                                            top: 20, right: 30, left: 20, bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="4 4" />
                                        <XAxis dataKey="Data" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="Preço" stroke="red" >
                                            <LabelList content={<CustomizedLabel />} />
                                        </Line>
                                    </ComposedChart>
                                </ResponsiveContainer>
                                <br />
                                <h3>Média de preço: <strong className={styles.media}>{average.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></h3>
                                <h3>Menor de preço: <strong className={styles.media}>{minValue !== null ? `${minValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}` : 'Não encontrado'}</strong> em {timeMinValue !== null ? moment(timeMinValue).format('DD/MM/YYYY - HH:mm') : 'Não encontrado'}</h3>
                                <h3>Maior de preço: <strong className={styles.media}>{maxAmount !== null ? `${maxAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}` : 'Não encontrado'}</strong> em {creationDate !== null ? moment(creationDate).format('DD/MM/YYYY - HH:mm') : 'Não encontrado'}</h3>
                                <br />
                                <br />
                                <br />
                                <button
                                    className={styles.buttonComparative}
                                    onClick={showOrHide}
                                >
                                    Comparar com outras lojas
                                </button>
                                {showCoparative ?
                                    <>
                                        <button
                                            className={styles.searchProduto}
                                            onClick={handleAllStoreProductsMachines}
                                        >
                                            Atualizar preços de todas as lojas
                                        </button>
                                        <br />
                                        <br />
                                        <br />
                                        <ResponsiveContainer width="100%" height={400}>
                                            <LineChart width={600} height={300} data={chartData}>
                                                <CartesianGrid strokeDasharray="6 6" />
                                                <XAxis dataKey="data" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                {Object.keys(groupedData).map((store, index) => (
                                                    <Line
                                                        key={store}
                                                        type="monotone"
                                                        dataKey="price"
                                                        data={groupedData[store]}
                                                        name={store}
                                                        stroke={index === 0 ? "#8884d8" : index === 1 ? "#82ca9d" : "#ffc658"}
                                                        activeDot={{ onClick: handleButtonClickComaratives }}
                                                    >
                                                        <LabelList content={<CustomizedLabelComparative />} />
                                                    </Line>
                                                ))}
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </>
                                    :
                                    null
                                }
                            </div>
                        </article>
                    </main>
                </>
            }
        </>
    )
}
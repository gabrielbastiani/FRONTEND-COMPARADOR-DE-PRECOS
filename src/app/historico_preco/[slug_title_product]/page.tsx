"use client"


import { FunctionComponent, useEffect, useState } from "react";

import { HeaderProducts } from "@/components/HeaderProducts/page";
import LoadingRequests from "@/components/LoadingRequests/page";

import styles from "./styles.module.css";

import { setupAPIClient } from "@/services/api";
import moment from "moment";
import { CartesianGrid, ComposedChart, LabelList, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


export default function Historico_preco({ params }: { params: { slug_title_product: string } }) {

    const [listProducts, setListProducts] = useState<any[]>([]);
    const [name, setName] = useState<string>("");
    const [link, setLink] = useState<string>("");
    const [store, setStore] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [average, setAverage] = useState<number>(0);
    const [showCoparative, setShowCoparative] = useState<boolean>(false);

    const showOrHide = () => {
        setShowCoparative(!showCoparative);
    }

    useEffect(() => {
        const apiClient = setupAPIClient();
        async function loadStoreProducts() {
            setLoading(true);
            try {
                const { data } = await apiClient.get(`/find_product_history?slug_title_product=${params?.slug_title_product}`);
                setListProducts(data?.product || []);
                setLink(data?.date_product?.link || "");
                setName(data?.date_product?.title_product || "");
                setStore(data?.date_product?.store || "");
                setLoading(false);
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
                setLoading(false);
            }
        }
        loadStoreProducts();
    }, [params?.slug_title_product]);

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
    }, [listProducts]);


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
                                <h1 className={styles.titulo}>Histórico do produto</h1>
                            </div>

                            <div className={styles.grid_container}>

                                <h2>{name}</h2>
                                <br />
                                <h3>LOJA: {store}</h3>
                                <br />
                                <br />
                                <button
                                    className={styles.buttonProduto}
                                    onClick={() => handleButtonClick(link)}
                                >
                                    Ver produto
                                </button>
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
                                <h2>Média de preço: <strong className={styles.media}>{average.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></h2>
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
                                    <h1 style={{ color: 'black' }}>ABRIU</h1>
                                    :
                                    <h1 style={{ color: 'black' }}>FECHOU</h1>
                                }
                            </div>
                        </article>
                    </main>
                </>
            }
        </>
    )
}
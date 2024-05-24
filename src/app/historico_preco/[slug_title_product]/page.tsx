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
    const [loading, setLoading] = useState<boolean>(false);

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
                            </div>
                        </article>
                    </main>
                </>
            }
        </>
    )
}
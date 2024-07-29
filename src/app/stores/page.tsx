"use client"

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { TbCapture } from 'react-icons/tb';
import Modal from 'react-modal';

import { Header } from '@/components/Header/page';
import LoadingRequests from '@/components/LoadingRequests/page';
import { ModalEsab } from '@/components/popups/ModalEsab/page';
import { ModalStore } from '@/components/popups/ModalStore/page';
import { ModalSumig } from '@/components/popups/ModalSumig/page';

import amazon from '../../../public/amazon.png';
import americanas from '../../../public/americanas.png';
import carrefour from '../../../public/carrefour.png';
import casasbahia from '../../../public/casasbahia.png';
import dutramaquinas from '../../../public/dutramaquinas.png';
import esab from '../../../public/esab.png';
import leroymerlin from '../../../public/leroyMerlin.png';
import lojadomecanico from '../../../public/lojamecanico.png';
import magazineluiza from '../../../public/magazineluiza.png';
import mercadolivre from '../../../public/mercado-livre.png';
import pontofrio from '../../../public/pontofrio.png';
import shopee from '../../../public/shopee.png';
import shoptime from '../../../public/shoptime.png';
import sumig from '../../../public/sumig.png';
import styles from './styles.module.css';

import { setupAPIClient } from '@/services/api';


export default function Stores() {

    const router = useRouter();

    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleSumig, setModalVisibleSumig] = useState(false);
    const [modalVisibleEsab, setModalVisibleEsab] = useState(false);
    const [valor1, setValor1] = useState<string>("");
    const [valor2, setValor2] = useState<string>("");
    const [valor3, setValor3] = useState<string>("");
    const [listProducts, setListProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);


    useEffect(() => {
        const apiClient = setupAPIClient();
        async function loadStoreProducts() {
            setLoading(true);
            try {
                const response = await apiClient.get(`/list_all_products`);
                setListProducts(response?.data || []);
                setLoading(false);
            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
                setLoading(false);
            }
        }
        loadStoreProducts();
    }, []);

    function handleCloseModal() {
        setModalVisible(false);
    }

    async function handleOpenModal(valor1: string, valor2: string, valor3: string) {
        setModalVisible(true);
        setValor1(valor1);
        setValor2(valor2);
        setValor3(valor3);
    }

    function handleCloseModalSumig() {
        setModalVisibleSumig(false);
    }

    async function handleOpenModalSumig() {
        setModalVisibleSumig(true);
    }

    function handleCloseModalEsab() {
        setModalVisibleEsab(false);
    }

    async function handleOpenModalEsab() {
        setModalVisibleEsab(true);
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
                        <div className={styles.contentText}>
                            <FaArrowLeft
                                onClick={() => router.back()}
                                size={32}
                                color='white'
                            />
                            <div className={styles.text}>
                                <h1>Lojas</h1>
                            </div>

                            <div className={styles.text}></div>
                        </div>

                        <div className={styles.grid_container}>
                            <div className={styles.grid_item}>
                                <button
                                    onClick={handleOpenModalSumig}
                                >
                                    <Image src={sumig} width={80} height={40} alt="SUMIG" />
                                    <strong>
                                        SUMIG
                                    </strong>
                                    <span>{listProducts.filter(item => item.slug === "sumig").length}</span>
                                </button>
                                <TbCapture
                                    color='red'
                                    size={40}
                                    onClick={() => router.push(`/register_products_store/sumig`)}
                                />
                                <span style={{ color: 'orange', fontWeight: 'bold' }}>{listProducts.filter(item => item.slug === "sumig" && item.register === "Sim").length}</span>
                            </div>

                            <div className={styles.grid_item}>
                                <button
                                    onClick={handleOpenModalEsab}
                                >
                                    <Image src={esab} width={80} height={70} alt="Esab" />
                                    <strong>
                                        ESAB
                                    </strong>
                                    <span>{listProducts.filter(item => item.slug === "esab").length}</span>
                                </button>
                                <TbCapture
                                    color='red'
                                    size={40}
                                    onClick={() => router.push(`/register_products_store/esab`)}
                                />
                                <span style={{ color: 'orange', fontWeight: 'bold' }}>{listProducts.filter(item => item.slug === "esab" && item.register === "Sim").length}</span>
                            </div>

                            <div className={styles.grid_item}>
                                <button
                                    onClick={() => handleOpenModal('https://www.google.com/search?sca_esv=584838229&tbm=shop&sxsrf=ACQVn0_wJfSTuXc6puQpufdi7SJl0HJM-Q:1710955161295&q=maquina+de+solda&tbs=mr:1,merchagg:g134886126%7Cm134880504&sa=X&ved=0ahUKEwj71fXUrIOFAxVDAbkGHRyNCjYQsysIuQkoAA&biw=1592&bih=752&dpr=1', 'Amazon.com.br - Seller', 'https://www.google.com/search?sca_esv=34178eb96b5aeaa8&tbm=shop&sxsrf=ADLYWII9yVc42I3GhQXMXLAeI6amabeVuA:1718634317958&q=maquina+de+corte+plasma+manual&tbs=mr:1,merchagg:g134886126%7Cm134880504%7Cm134942054&sa=X&ved=0ahUKEwjjvpTg6-KGAxU7pJUCHQyLB8cQsysIowgoAQ&biw=1592&bih=752&dpr=1')} data-valor1="valor1" data-valor2="valor2" data-valor3="valor3"
                                >
                                    <Image src={amazon} width={70} height={70} alt="Amazon.com.br - Seller" />
                                    <strong>
                                        Amazon.com.br - Seller
                                    </strong>
                                    <span>{listProducts.filter(item => item.slug === "amazon.com.br-seller").length}</span>
                                </button>
                                <TbCapture
                                    color='red'
                                    size={40}
                                    onClick={() => router.push(`/register_products_store/amazon.com.br-seller`)}
                                />
                                <span style={{ color: 'orange', fontWeight: 'bold' }}>{listProducts.filter(item => item.slug === "amazon.com.br-seller" && item.register === "Sim").length}</span>
                            </div>

                            <div className={styles.grid_item}>
                                <button
                                    onClick={() => handleOpenModal("https://www.google.com/search?sca_esv=584838229&tbm=shop&sxsrf=ACQVn09ZpQa6AarvDV0CC_cutsi5fDC3ZA:1710955611105&q=maquina+de+solda&tbs=mr:1,merchagg:g103278022%7Cm110551677%7Cm143935386&sa=X&ved=0ahUKEwiC77OrroOFAxXGqpUCHaJDDEEQsysItgkoAQ&biw=1592&bih=752&dpr=1", "Americanas.com", "https://www.google.com/search?sca_esv=34178eb96b5aeaa8&tbm=shop&sxsrf=ADLYWIICuGfOD17uZESyFhKDioYMOlSnNA:1718633832249&q=maquina+de+corte+plasma+manual&tbs=mr:1,merchagg:g103278022%7Cm111579559&sa=X&ved=0ahUKEwj1lMf46eKGAxVgqJUCHSVQHu8QsysIrAgoAQ&biw=1592&bih=752&dpr=1")} data-valor1="valor1" data-valor2="valor2" data-valor3="valor3"
                                >
                                    <Image src={americanas} width={70} height={70} alt="americanas.com" />
                                    <strong>
                                        Americanas.com
                                    </strong>
                                    <span>{listProducts.filter(item => item.slug === "americanas.com").length}</span>
                                </button>
                                <TbCapture
                                    color='red'
                                    size={40}
                                    onClick={() => router.push(`/register_products_store/americanas.com`)}
                                />
                                <span style={{ color: 'orange', fontWeight: 'bold' }}>{listProducts.filter(item => item.slug === "americanas.com" && item.register === "Sim").length}</span>
                            </div>

                            <div className={styles.grid_item}>
                                <button
                                    onClick={() => handleOpenModal("https://www.google.com/search?sca_esv=584838229&tbm=shop&sxsrf=ACQVn0__5wwhfIX4p4OoeX_x6uZzZNnXww:1710955695943&q=maquina+de+solda&tbs=mr:1,merchagg:g115994814%7Cm142916516&sa=X&ved=0ahUKEwja8e3TroOFAxUrppUCHRSaD84QsysIuwkoAg&biw=1592&bih=752&dpr=1", "Carrefour", "https://www.google.com/search?sca_esv=34178eb96b5aeaa8&tbm=shop&sxsrf=ADLYWIIV6_N2akOJf9EsyHG0on2X9k4LgA:1718634391748&q=maquina+de+corte+plasma+manual&tbs=mr:1,merchagg:g115994814%7Cm142915541&sa=X&ved=0ahUKEwjrlqyD7OKGAxX_pZUCHVY3CnYQsysI1wUoAA&biw=1592&bih=752&dpr=1")} data-valor1="valor1" data-valor2="valor2" data-valor3="valor3"
                                >
                                    <Image src={carrefour} width={90} height={70} alt="Carrefour" />
                                    <strong>
                                        Carrefour
                                    </strong>
                                    <span>{listProducts.filter(item => item.slug === "carrefour").length}</span>
                                </button>
                                <TbCapture
                                    color='red'
                                    size={40}
                                    onClick={() => router.push(`/register_products_store/carrefour`)}
                                />
                                <span style={{ color: 'orange', fontWeight: 'bold' }}>{listProducts.filter(item => item.slug === "carrefour" && item.register === "Sim").length}</span>
                            </div>

                            <div className={styles.grid_item}>
                                <button
                                    onClick={() => handleOpenModal("https://www.google.com/search?sca_esv=584838229&tbm=shop&sxsrf=ACQVn09LuiVtULhTjINYXdiXO2q6hmTN6A:1710955781552&q=maquina+de+solda&tbs=mr:1,merchagg:g115160181%7Cm143357536%7Cm501057771%7Cm336930894&sa=X&ved=0ahUKEwibhdf8roOFAxUPq5UCHas_Cl0QsysIvAkoAw&biw=1592&bih=752&dpr=1", "Casas Bahia", "https://www.google.com/search?sca_esv=34178eb96b5aeaa8&tbm=shop&sxsrf=ADLYWILZCNwC08mQHDtARcf7r_197Y-vjA:1718634455650&q=maquina+de+corte+plasma+manual&tbs=mr:1,merchagg:g115160181%7Cm143357536%7Cm501057771%7Cm336930894&sa=X&ved=0ahUKEwiRxOih7OKGAxWYrZUCHW6aC18QsysIxQgoAQ&biw=1592&bih=752&dpr=1")} data-valor1="valor1" data-valor2="valor2" data-valor3="valor3"
                                >
                                    <Image src={casasbahia} width={70} height={70} alt="casas-bahia" />
                                    <strong>
                                        Casas Bahia
                                    </strong>
                                    <span>{listProducts.filter(item => item.slug === "casas-bahia").length}</span>
                                </button>
                                <TbCapture
                                    color='red'
                                    size={40}
                                    onClick={() => router.push(`/register_products_store/casas-bahia`)}
                                />
                                <span style={{ color: 'orange', fontWeight: 'bold' }}>{listProducts.filter(item => item.slug === "casas-bahia" && item.register === "Sim").length}</span>
                            </div>

                            <div className={styles.grid_item}>
                                <button
                                    onClick={() => handleOpenModal("https://www.google.com/search?sca_esv=584838229&tbm=shop&sxsrf=ACQVn09SVtyp7_lHQv0h1sOCFUP8HgZRcg:1710955948123&q=maquina+de+solda&tbs=mr:1,merchagg:g103001188%7Cm7423416&sa=X&ved=0ahUKEwjP5I3Mr4OFAxW_qpUCHaq8CegQsysIvwkoBg&biw=1592&bih=752&dpr=1", "Dutra Máquinas", "https://www.google.com/search?sca_esv=34178eb96b5aeaa8&tbm=shop&sxsrf=ADLYWILggncPA0_WWJrNZ44slvhV8Dp86g:1718634518249&q=maquina+de+corte+plasma+manual&tbs=mr:1,merchagg:g103001188%7Cm7423416&sa=X&ved=0ahUKEwizodW_7OKGAxX_mZUCHUaKC9oQsysIwQgoAQ&biw=1592&bih=752&dpr=1")} data-valor1="valor1" data-valor2="valor2" data-valor3="valor3"
                                >
                                    <Image src={dutramaquinas} width={70} height={70} alt="dutra-maquinas" />
                                    <strong>
                                        Dutra Máquinas
                                    </strong>
                                    <span>{listProducts.filter(item => item.slug === "dutra-maquinas").length}</span>
                                </button>
                                <TbCapture
                                    color='red'
                                    size={40}
                                    onClick={() => router.push(`/register_products_store/dutra-maquinas`)}
                                />
                                <span style={{ color: 'orange', fontWeight: 'bold' }}>{listProducts.filter(item => item.slug === "dutra-maquinas" && item.register === "Sim").length}</span>
                            </div>

                            <div className={styles.grid_item}>
                                <button
                                    onClick={() => handleOpenModal("https://www.google.com/search?sca_esv=584838229&tbm=shop&sxsrf=ACQVn0-66EC-Y6-kKglNy5WDdYrbSeXRgw:1710956182333&q=maquina+de+solda&tbs=mr:1,merchagg:g208973168%7Cm101617997&sa=X&ved=0ahUKEwjp9-S7sIOFAxVJBbkGHcbzDhYQsysIwgkoCQ&biw=1592&bih=752&dpr=1", "Leroy Merlin", "https://www.google.com/search?sca_esv=34178eb96b5aeaa8&tbm=shop&sxsrf=ADLYWILhs2OAy1vPHrsILGLxStNx_X7ihA:1718634587211&q=maquina+de+corte+plasma+manual&tbs=mr:1,merchagg:g208973168%7Cm101617997&sa=X&ved=0ahUKEwi5lMbg7OKGAxXOrpUCHf80AvcQsysI6wYoAg&biw=1592&bih=752&dpr=1")} data-valor1="valor1" data-valor2="valor2" data-valor3="valor3"
                                >
                                    <Image src={leroymerlin} width={90} height={70} alt="leroy merlin" />
                                    <strong>
                                        Leroy Merlin
                                    </strong>
                                    <span>{listProducts.filter(item => item.slug === "leroy-merlin").length}</span>
                                </button>
                                <TbCapture
                                    color='red'
                                    size={40}
                                    onClick={() => router.push(`/register_products_store/leroy-merlin`)}
                                />
                                <span style={{ color: 'orange', fontWeight: 'bold' }}>{listProducts.filter(item => item.slug === "leroy-merlin" && item.register === "Sim").length}</span>
                            </div>

                            <div className={styles.grid_item}>
                                <button
                                    onClick={() => handleOpenModal("https://www.google.com/search?sca_esv=584838229&tbm=shop&sxsrf=ACQVn09fSGfy88Oi7V-9iTrh_juDnmtJQA:1710956314816&q=maquina+de+solda&tbs=mr:1,merchagg:m10892984&sa=X&ved=0ahUKEwig__r6sIOFAxVqIbkGHQs8BywQsysIwAkoCw&biw=1592&bih=752&dpr=1", "Loja do Mecânico", "https://www.google.com/search?sca_esv=34178eb96b5aeaa8&tbm=shop&sxsrf=ADLYWILjTqPGcpesk7OlK1KyZXYuYuJq4w:1718634655351&q=maquina+de+corte+plasma+manual&tbs=mr:1,merchagg:m10892984&sa=X&ved=0ahUKEwj3qoWB7eKGAxUsqpUCHSP_C88QsysI4QcoAw&biw=1592&bih=752&dpr=1")} data-valor1="valor1" data-valor2="valor2" data-valor3="valor3"
                                >
                                    <Image src={lojadomecanico} width={90} height={70} alt="Loja do Mecânico" />
                                    <strong>
                                        Loja do Mecânico
                                    </strong>
                                    <span>{listProducts.filter(item => item.slug === "loja-do-mecanico").length}</span>
                                </button>
                                <TbCapture
                                    color='red'
                                    size={40}
                                    onClick={() => router.push(`/register_products_store/loja-do-mecanico`)}
                                />
                                <span style={{ color: 'orange', fontWeight: 'bold' }}>{listProducts.filter(item => item.slug === "loja-do-mecanico" && item.register === "Sim").length}</span>
                            </div>

                            <div className={styles.grid_item}>
                                <button
                                    onClick={() => handleOpenModal("https://www.google.com/search?sca_esv=584838229&tbm=shop&sxsrf=ACQVn09QFdURnfro7eXrxffoAW5K_E4m_Q:1710956474909&q=maquina+de+solda&tbs=mr:1,merchagg:g104823487%7Cm553660352%7Cm478855842%7Cm252108464%7Cm626893472%7Cm566737406&sa=X&ved=0ahUKEwi3rabHsYOFAxXrDbkGHTmTCsgQsysIxQkoDA&biw=1592&bih=752&dpr=1", "Magazine Luiza", "https://www.google.com/search?sca_esv=34178eb96b5aeaa8&tbm=shop&sxsrf=ADLYWIKXWlsHdQ7g2FlnZxO_8n0g7S3qdg:1718634709747&q=maquina+de+corte+plasma+manual&tbs=mr:1,merchagg:g104823487%7Cm553660352%7Cm478855842%7Cm626893472%7Cm732046960%7Cm135437352&sa=X&ved=0ahUKEwjYj_2a7eKGAxWMppUCHcO9D0oQsysIqAgoBA&biw=1592&bih=752&dpr=1")} data-valor1="valor1" data-valor2="valor2" data-valor3="valor3"
                                >
                                    <Image src={magazineluiza} width={70} height={60} alt="Magazine Luiza" />
                                    <strong>
                                        Magazine Luiza
                                    </strong>
                                    <span>{listProducts.filter(item => item.slug === "magazine-luiza").length}</span>
                                </button>
                                <TbCapture
                                    color='red'
                                    size={40}
                                    onClick={() => router.push(`/register_products_store/magazine-luiza`)}
                                />
                                <span style={{ color: 'orange', fontWeight: 'bold' }}>{listProducts.filter(item => item.slug === "magazine-luiza" && item.register === "Sim").length}</span>
                            </div>

                            <div className={styles.grid_item}>
                                <button
                                    onClick={() => handleOpenModal("https://www.google.com/search?sca_esv=584838229&tbm=shop&sxsrf=ACQVn0-RYH3NaBcNoPMptADC4-BOizTodQ:1710956692535&q=maquina+de+solda&tbs=mr:1,merchagg:g8670533%7Cm735125422%7Cm735128188%7Cm735098639%7Cm735098660%7Cm538023868&sa=X&ved=0ahUKEwje94ivsoOFAxUru5UCHR1zCt0QsysIxgkoDQ&biw=1592&bih=752&dpr=1", "Mercado Livre", "https://www.google.com/search?sca_esv=34178eb96b5aeaa8&tbm=shop&sxsrf=ADLYWIJd8_f30UeRWEn3eHXVM46YAc3Znw:1718634797059&q=maquina+de+corte+plasma+manual&tbs=mr:1,merchagg:g8670533%7Cm735098639%7Cm735098660%7Cm735128188%7Cm735125422%7Cm735128761&sa=X&ved=0ahUKEwjNzM7E7eKGAxWMrpUCHactDQQQsysI3AgoBQ&biw=1592&bih=752&dpr=1")} data-valor1="valor1" data-valor2="valor2" data-valor3="valor3"
                                >
                                    <Image src={mercadolivre} width={90} height={70} alt="Mercado Livre" />
                                    <strong>
                                        Mercado Livre
                                    </strong>
                                    <span>{listProducts.filter(item => item.slug === "mercado-livre").length}</span>
                                </button>
                                <TbCapture
                                    color='red'
                                    size={40}
                                    onClick={() => router.push(`/register_products_store/mercado-livre`)}
                                />
                                <span style={{ color: 'orange', fontWeight: 'bold' }}>{listProducts.filter(item => item.slug === "mercado-livre" && item.register === "Sim").length}</span>
                            </div>

                            <div className={styles.grid_item}>
                                <button
                                    onClick={() => handleOpenModal("https://www.google.com/search?sca_esv=584838229&tbm=shop&sxsrf=ACQVn0_CZ8OXadsOxwFY0GxF_MWcp1Dibw:1710957106051&q=maquina+de+solda&tbs=mr:1,merchagg:g115172300%7Cm143195331&sa=X&ved=0ahUKEwjjhKD0s4OFAxXCppUCHeJ8DhAQsysI1QkoEA&biw=1592&bih=752&dpr=1", "Pontofrio.com", "NA")} data-valor1="valor1" data-valor2="valor2" data-valor3="valor3"
                                >
                                    <Image src={pontofrio} width={80} height={30} alt="Pontofrio.com" />
                                    <strong>
                                        Pontofrio.com
                                    </strong>
                                    <span>{listProducts.filter(item => item.slug === "pontofrio.com").length}</span>
                                </button>
                                <TbCapture
                                    color='red'
                                    size={40}
                                    onClick={() => router.push(`/register_products_store/pontofrio.com`)}
                                />
                                <span style={{ color: 'orange', fontWeight: 'bold' }}>{listProducts.filter(item => item.slug === "pontofrio.com" && item.register === "Sim").length}</span>
                            </div>

                            <div className={styles.grid_item}>
                                <button
                                    onClick={() => handleOpenModal("https://www.google.com/search?sca_esv=584838229&tbm=shop&sxsrf=ACQVn082dW2dvIHVvEUc02Hp5542XPBahg:1710957329852&q=maquina+de+solda&tbs=mr:1,merchagg:g142484886%7Cm5069529892%7Cm733145420%7Cm623309586%7Cm265940141%7Cm507986362&sa=X&ved=0ahUKEwjo4vvetIOFAxWxr5UCHX-sD94QsysI2gkoEg&biw=1592&bih=752&dpr=1", "Shopee", "https://www.google.com/search?sca_esv=34178eb96b5aeaa8&tbm=shop&sxsrf=ADLYWIJS4e1Q5W-BqD4S_vC5mQWuz65p1g:1718635080103&q=maquina+de+corte+plasma+manual&tbs=mr:1,merchagg:g142484886%7Cm265940141%7Cm507986362%7Cm750397669&sa=X&ved=0ahUKEwjz4cnL7uKGAxXmpZUCHdodAf0QsysI5QgoAQ&biw=1592&bih=752&dpr=1")} data-valor1="valor1" data-valor2="valor2" data-valor3="valor3"
                                >
                                    <Image src={shopee} width={70} height={70} alt="Shopee" />
                                    <strong>
                                        Shopee
                                    </strong>
                                    <span>{listProducts.filter(item => item.slug === "shopee").length}</span>
                                </button>
                                <TbCapture
                                    color='red'
                                    size={40}
                                    onClick={() => router.push(`/register_products_store/shopee`)}
                                />
                                <span style={{ color: 'orange', fontWeight: 'bold' }}>{listProducts.filter(item => item.slug === "shopee" && item.register === "Sim").length}</span>
                            </div>

                            <div className={styles.grid_item}>
                                <button
                                    onClick={() => handleOpenModal("https://www.google.com/search?sca_esv=584838229&tbm=shop&sxsrf=ACQVn0_ggscEc4TJx3bg9I-3AZmuwH62Xw:1710957528042&q=maquina+de+solda&tbs=mr:1,merchagg:g103272221%7Cm142944258&sa=X&ved=0ahUKEwjSt7y9tYOFAxWrrJUCHcqBDkIQsysI2QkoEw&biw=1592&bih=752&dpr=1", "Shoptime", "https://www.google.com/search?sca_esv=34178eb96b5aeaa8&tbm=shop&sxsrf=ADLYWIIbrAqw6wgPO0y7qDHP4PkgAlEFCg:1718635135149&q=maquina+de+corte+plasma+manual&tbs=mr:1,merchagg:g103272221%7Cm110551671%7Cm163052276%7Cm133736100&sa=X&ved=0ahUKEwiW0unl7uKGAxVJpZUCHQjYDSIQsysI2AgoBQ&biw=1592&bih=752&dpr=1")} data-valor1="valor1" data-valor2="valor2" data-valor3="valor3"
                                >
                                    <Image src={shoptime} width={80} height={40} alt="Shoptime" />
                                    <strong>
                                        Shoptime
                                    </strong>
                                    <span>{listProducts.filter(item => item.slug === "shoptime").length}</span>
                                </button>
                                <TbCapture
                                    color='red'
                                    size={40}
                                    onClick={() => router.push(`/register_products_store/shoptime`)}
                                />
                                <span style={{ color: 'orange', fontWeight: 'bold' }}>{listProducts.filter(item => item.slug === "shoptime" && item.register === "Sim").length}</span>
                            </div>
                        </div>
                        {
                            modalVisible && (
                                <ModalStore
                                    isOpen={modalVisible}
                                    onRequestClose={handleCloseModal}
                                    valor1={valor1}
                                    valor2={valor2}
                                    valor3={valor3}
                                />
                            )
                        }
                        {
                            modalVisibleSumig && (
                                <ModalSumig
                                    isOpen={modalVisibleSumig}
                                    onRequestClose={handleCloseModalSumig}
                                />
                            )
                        }
                        {
                            modalVisibleEsab && (
                                <ModalEsab
                                    isOpen={modalVisibleEsab}
                                    onRequestClose={handleCloseModalEsab}
                                />
                            )
                        }
                    </main>
                </>
            }
        </>
    )
}
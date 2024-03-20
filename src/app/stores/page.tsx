"use client"

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

import { Header } from '@/components/Header/page';


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



export default function Stores() {

    const router = useRouter();

    const [storeChange, setStoreChange] = useState<string>("");

    const handleChangeStore = (e: any) => {
        setStoreChange(e.target.value)
    }

    const valueStore = storeChange.split('|');



    return (
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
                            onClick={handleChangeStore}
                        >
                            <Image src={sumig} width={80} height={40} alt="SUMIG" />
                            <strong>
                                SUMIG
                            </strong>
                        </button>
                    </div>

                    <div className={styles.grid_item}>
                        <button
                            onClick={handleChangeStore}
                        >
                            <Image src={esab} width={80} height={70} alt="Esab" />
                            <strong>
                                ESAB
                            </strong>
                        </button>
                    </div>

                    <div className={styles.grid_item}>
                        <button
                            onClick={handleChangeStore}
                            value="https://www.google.com/search?sca_esv=584838229&tbm=shop&sxsrf=ACQVn0_wJfSTuXc6puQpufdi7SJl0HJM-Q:1710955161295&q=maquina+de+solda&tbs=mr:1,merchagg:g134886126%7Cm134880504&sa=X&ved=0ahUKEwj71fXUrIOFAxVDAbkGHRyNCjYQsysIuQkoAA&biw=1592&bih=752&dpr=1|Amazon.com"
                        >
                            <Image src={amazon} width={70} height={70} alt="Amazon.com" />
                            <strong>
                                Amazon.com
                            </strong>
                        </button>
                    </div>

                    <div className={styles.grid_item}>
                        <button
                            onClick={handleChangeStore}
                            value="https://www.google.com/search?sca_esv=584838229&tbm=shop&sxsrf=ACQVn09ZpQa6AarvDV0CC_cutsi5fDC3ZA:1710955611105&q=maquina+de+solda&tbs=mr:1,merchagg:g103278022%7Cm110551677%7Cm143935386&sa=X&ved=0ahUKEwiC77OrroOFAxXGqpUCHaJDDEEQsysItgkoAQ&biw=1592&bih=752&dpr=1|Americanas"
                        >
                            <Image src={americanas} width={70} height={70} alt="Americanas" />
                            <strong>
                                Americanas
                            </strong>
                        </button>
                    </div>

                    <div className={styles.grid_item}>
                        <button
                            onClick={handleChangeStore}
                            value="https://www.google.com/search?sca_esv=584838229&tbm=shop&sxsrf=ACQVn0__5wwhfIX4p4OoeX_x6uZzZNnXww:1710955695943&q=maquina+de+solda&tbs=mr:1,merchagg:g115994814%7Cm142916516&sa=X&ved=0ahUKEwja8e3TroOFAxUrppUCHRSaD84QsysIuwkoAg&biw=1592&bih=752&dpr=1|Carrefour"
                        >
                            <Image src={carrefour} width={90} height={70} alt="Carrefour" />
                            <strong>
                                Carrefour
                            </strong>
                        </button>
                    </div>

                    <div className={styles.grid_item}>
                        <button
                            onClick={handleChangeStore}
                            value="https://www.google.com/search?sca_esv=584838229&tbm=shop&sxsrf=ACQVn09LuiVtULhTjINYXdiXO2q6hmTN6A:1710955781552&q=maquina+de+solda&tbs=mr:1,merchagg:g115160181%7Cm143357536%7Cm501057771%7Cm336930894&sa=X&ved=0ahUKEwibhdf8roOFAxUPq5UCHas_Cl0QsysIvAkoAw&biw=1592&bih=752&dpr=1|Casas Bahia"
                        >
                            <Image src={casasbahia} width={70} height={70} alt="Casas bahia" />
                            <strong>
                                Casas Bahia
                            </strong>
                        </button>
                    </div>

                    <div className={styles.grid_item}>
                        <button
                            onClick={handleChangeStore}
                            value="https://www.google.com/search?sca_esv=584838229&tbm=shop&sxsrf=ACQVn09SVtyp7_lHQv0h1sOCFUP8HgZRcg:1710955948123&q=maquina+de+solda&tbs=mr:1,merchagg:g103001188%7Cm7423416&sa=X&ved=0ahUKEwjP5I3Mr4OFAxW_qpUCHaq8CegQsysIvwkoBg&biw=1592&bih=752&dpr=1|Dutra Máquinas"
                        >
                            <Image src={dutramaquinas} width={70} height={70} alt="Dutra maquinas" />
                            <strong>
                                Dutra Máquinas
                            </strong>
                        </button>
                    </div>

                    <div className={styles.grid_item}>
                        <button
                            onClick={handleChangeStore}
                            value="https://www.google.com/search?sca_esv=584838229&tbm=shop&sxsrf=ACQVn0-66EC-Y6-kKglNy5WDdYrbSeXRgw:1710956182333&q=maquina+de+solda&tbs=mr:1,merchagg:g208973168%7Cm101617997&sa=X&ved=0ahUKEwjp9-S7sIOFAxVJBbkGHcbzDhYQsysIwgkoCQ&biw=1592&bih=752&dpr=1|Leroy Merlin"
                        >
                            <Image src={leroymerlin} width={90} height={70} alt="leroy merlin" />
                            <strong>
                                Leroy Merlin
                            </strong>
                        </button>
                    </div>

                    <div className={styles.grid_item}>
                        <button
                            onClick={handleChangeStore}
                            value="https://www.google.com/search?sca_esv=584838229&tbm=shop&sxsrf=ACQVn09fSGfy88Oi7V-9iTrh_juDnmtJQA:1710956314816&q=maquina+de+solda&tbs=mr:1,merchagg:m10892984&sa=X&ved=0ahUKEwig__r6sIOFAxVqIbkGHQs8BywQsysIwAkoCw&biw=1592&bih=752&dpr=1|Loja do Mecânico"
                        >
                            <Image src={lojadomecanico} width={90} height={70} alt="Loja do Mecânico" />
                            <strong>
                                Loja do Mecânico
                            </strong>
                        </button>
                    </div>

                    <div className={styles.grid_item}>
                        <button
                            onClick={handleChangeStore}
                            value="https://www.google.com/search?sca_esv=584838229&tbm=shop&sxsrf=ACQVn09QFdURnfro7eXrxffoAW5K_E4m_Q:1710956474909&q=maquina+de+solda&tbs=mr:1,merchagg:g104823487%7Cm553660352%7Cm478855842%7Cm252108464%7Cm626893472%7Cm566737406&sa=X&ved=0ahUKEwi3rabHsYOFAxXrDbkGHTmTCsgQsysIxQkoDA&biw=1592&bih=752&dpr=1|Magazine Luiza"
                        >
                            <Image src={magazineluiza} width={70} height={60} alt="Magazine Luiza" />
                            <strong>
                                Magazine Luiza
                            </strong>
                        </button>
                    </div>

                    <div className={styles.grid_item}>
                        <button
                            onClick={handleChangeStore}
                            value="https://www.google.com/search?sca_esv=584838229&tbm=shop&sxsrf=ACQVn0-RYH3NaBcNoPMptADC4-BOizTodQ:1710956692535&q=maquina+de+solda&tbs=mr:1,merchagg:g8670533%7Cm735125422%7Cm735128188%7Cm735098639%7Cm735098660%7Cm538023868&sa=X&ved=0ahUKEwje94ivsoOFAxUru5UCHR1zCt0QsysIxgkoDQ&biw=1592&bih=752&dpr=1|Mercado Livre"
                        >
                            <Image src={mercadolivre} width={90} height={70} alt="Mercado Livre" />
                            <strong>
                                Mercado Livre
                            </strong>
                        </button>
                    </div>

                    <div className={styles.grid_item}>
                        <button
                            onClick={handleChangeStore}
                            value="https://www.google.com/search?sca_esv=584838229&tbm=shop&sxsrf=ACQVn0_CZ8OXadsOxwFY0GxF_MWcp1Dibw:1710957106051&q=maquina+de+solda&tbs=mr:1,merchagg:g115172300%7Cm143195331&sa=X&ved=0ahUKEwjjhKD0s4OFAxXCppUCHeJ8DhAQsysI1QkoEA&biw=1592&bih=752&dpr=1|Ponto Frio"
                        >
                            <Image src={pontofrio} width={80} height={30} alt="Ponto Frio" />
                            <strong>
                                Ponto Frio
                            </strong>
                        </button>
                    </div>

                    <div className={styles.grid_item}>
                        <button
                            onClick={handleChangeStore}
                            value="https://www.google.com/search?sca_esv=584838229&tbm=shop&sxsrf=ACQVn082dW2dvIHVvEUc02Hp5542XPBahg:1710957329852&q=maquina+de+solda&tbs=mr:1,merchagg:g142484886%7Cm5069529892%7Cm733145420%7Cm623309586%7Cm265940141%7Cm507986362&sa=X&ved=0ahUKEwjo4vvetIOFAxWxr5UCHX-sD94QsysI2gkoEg&biw=1592&bih=752&dpr=1|Shopee"
                        >
                            <Image src={shopee} width={70} height={70} alt="Shopee" />
                            <strong>
                                Shopee
                            </strong>
                        </button>
                    </div>

                    <div className={styles.grid_item}>
                        <button
                            onClick={handleChangeStore}
                            value="https://www.google.com/search?sca_esv=584838229&tbm=shop&sxsrf=ACQVn0_ggscEc4TJx3bg9I-3AZmuwH62Xw:1710957528042&q=maquina+de+solda&tbs=mr:1,merchagg:g103272221%7Cm142944258&sa=X&ved=0ahUKEwjSt7y9tYOFAxWrrJUCHcqBDkIQsysI2QkoEw&biw=1592&bih=752&dpr=1|Shoptime"
                        >
                            <Image src={shoptime} width={80} height={40} alt="Shoptime" />
                            <strong>
                                Shoptime
                            </strong>
                        </button>
                    </div>
                </div>
            </main>
        </>
    )
}
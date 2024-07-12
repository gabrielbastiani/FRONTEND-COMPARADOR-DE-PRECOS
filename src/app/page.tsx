"use client"

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BiSolidCategory } from 'react-icons/bi';

import { Header } from "@/components/Header/page";

import cut from '../../public/maquina plasma.png';
import welding from '../../public/maquina-de-solda.png';
import styles from './styles.module.css';

import { setupAPIClient } from '@/services/api';

export default function Home() {

  const router = useRouter();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const imgs = [
    {
      image: welding
    },
    {
      image: cut
    }
  ]

  const [zeroCategs, setZeroCategs] = useState<any[]>();

  useEffect(() => {
    const apiClient = setupAPIClient();
    async function loadStore() {
      try {
        const response = await apiClient.get('/all_categorys');
        const categories = response?.data?.categorys_zero || [];
        const combinedArray = categories.map((category: any, index: number) => ({
          ...category,
          image: imgs[index % imgs.length].image
        }));
        setZeroCategs(combinedArray);
      } catch (error: any) {
        if (error.response) {
          console.log(error.response.data);
        } else {
          console.log(error.message);
        }
      }
    }
    loadStore();
  }, [imgs]);

  return (
    <>
      <Header />
      <main className={styles.mainContainer}>
        <div>
          <h1>Categorias</h1>
        </div>
        <div className={styles.grid_container}>
          {zeroCategs?.map((item, index) => {
            return (
              <div key={index} className={styles.grid_item}>
                <button onClick={() => router.push(`/category_products/${item?.id}/${item?.name}`)}>
                  <Image src={item?.image} width={70} height={70} alt={item?.name} />
                  <strong>
                    {item?.name}
                  </strong>
                </button>
                <span style={{ backgroundColor: 'white' }}>
                  <BiSolidCategory onClick={() => router.push(`/category/${item?.slug}/${item?.name}/${item?.id}`)} size={28} />
                </span>
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}

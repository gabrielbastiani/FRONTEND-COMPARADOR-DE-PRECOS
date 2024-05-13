"use client"

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { CiEdit } from 'react-icons/ci';
import { FaPlus, FaProductHunt } from 'react-icons/fa';

import { Header } from "@/components/Header/page";
import LoadingRequests from "@/components/LoadingRequests/page";

import styles from './styles.module.css';

import { setupAPIClient } from "@/services/api";


type CategorysProps = {
  id: string;
  name: string;
  slug: string;
  image: string;
  status: string;
  parentId: string;
  nivel: number;
}

export default function Home() {

  const router = useRouter();

  const [categorys_zero, setCategorys_zero] = useState<CategorysProps[]>();
  const [all_categorys, setAll_categorys] = useState<CategorysProps[]>();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setLoading(true);
    const apiClient = setupAPIClient();
    async function loadCategorys() {
      try {
        const { data } = await apiClient.get('/all_categorys');
        setCategorys_zero(data.categorys_zero || []);
        setAll_categorys(data.all_categorys || []);
        setLoading(false);

      } catch (error) {/* @ts-ignore */
        console.log(error.response.data);
        setLoading(false);
      }
    }
    loadCategorys();
  }, []);


  return (
    <>
      {loading ?
        <LoadingRequests />
        :
        <>
          <Header />
          <main className={styles.mainContainer}>
            <div>
              <h2>Categorias</h2>
            </div>
            <div className={styles.grid_container}>
              {all_categorys?.length === 0 ?
                <strong className={styles.text}>Adicione alguma categoria principal</strong>
                :
                <>
                  {categorys_zero?.map((item) => {
                    return (
                      <div key={item.id}>
                        {item?.status === "Indisponivel" ?
                          <button className={styles.grid_item_indisponivel} onClick={() => router.push(`/edit_category/${item?.id}`)}>
                            <Image src={'http://localhost:3333/files/' + item?.image} width={70} height={70} alt={item?.name} />
                            <strong>
                              {item.name}  <CiEdit color='black' size={25} />
                            </strong>
                          </button>
                          :
                          <div className={styles.grid_item}>
                            <button onClick={() => router.push(`/category/${item?.slug}/${item?.id}`)}>
                              <Image src={'http://localhost:3333/files/' + item?.image} width={70} height={70} alt={item?.name} />
                              <strong>
                                {item.name}
                              </strong>
                            </button>
                            <span style={{ backgroundColor: 'white' }}>
                              <CiEdit color='black' size={25} onClick={() => router.push(`/edit_category/${item?.id}`)} />
                              <br />
                              <br />
                              <FaProductHunt onClick={() => router.push(`/category_products/${item?.slug}`)} size={28} />
                            </span>
                          </div>
                        }
                      </div>
                    )
                  })}
                </>
              }
              <button
                style={{
                  backgroundColor: 'red',
                  cursor: 'pointer'
                }}
                className={styles.grid_item}
                onClick={() => router.push('/add_category')}
              >
                <FaPlus size={50} color='white' />
              </button>
            </div>
          </main>
        </>
      }
    </>
  );
}

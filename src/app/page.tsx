"use client"

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { CiEdit } from 'react-icons/ci';
import { FaPlus } from 'react-icons/fa';

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
}

export default function Home() {

  const router = useRouter();

  const [categorys, setCategorys] = useState<CategorysProps[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const apiClient = setupAPIClient();
    async function loadCategorys() {
      try {
        const { data } = await apiClient.get('/all_zeros_levels_categorys');
        setCategorys(data || []);
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
              {categorys?.length === 0 ?
                <strong className={styles.text}>Adicione alguma categoria principal</strong>
                :
                <>
                  {categorys?.map((item) => {
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
                          <button className={styles.grid_item}>
                            <Image src={'http://localhost:3333/files/' + item?.image} width={70} height={70} alt={item?.name} />
                            <strong>
                              {item.name}  <CiEdit color='black' size={25} onClick={() => router.push(`/edit_category/${item?.id}`)} />
                            </strong>
                          </button>
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

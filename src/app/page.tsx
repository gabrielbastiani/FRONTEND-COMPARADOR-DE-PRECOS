"use client"

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CiEdit } from 'react-icons/ci';
import { FaProductHunt } from 'react-icons/fa';

import { Header } from "@/components/Header/page";

import cut from '../../public/maquina plasma.png';
import welding from '../../public/maquina-de-solda.png';
import styles from './styles.module.css';

export default function Home() {

  const router = useRouter();

  return (
    <>
      <Header />
      <main className={styles.mainContainer}>
        <div>
          <h2>Categorias</h2>
        </div>
        <div className={styles.grid_container}>
          <div className={styles.grid_item}>
            <button onClick={() => router.push(`/category/maquinas-de-solda/Máquinas de solda/4e92b792-7602-4554-8e0c-d870037157f1`)}>
              <Image src={welding} width={70} height={70} alt="maquinas-de-solda" />
              <strong>
                Máquinas de Solda
              </strong>
            </button>
            <span style={{ backgroundColor: 'white' }}>
              <CiEdit color='black' size={25} onClick={() => router.push(`/add_subcategory/4e92b792-7602-4554-8e0c-d870037157f1/Máquinas de solda`)} />
              <br />
              <br />
              <FaProductHunt onClick={() => router.push(`/category_products/maquinas-de-solda/Máquinas de solda`)} size={28} />
            </span>
          </div>
          <div className={styles.grid_item}>
            <button onClick={() => router.push(`/category/maquinas-de-corte-plasma-manual/Máquinas de corte plasma manual/7e94cbea-4319-45ad-8999-97a736a795c7`)}>
              <Image src={cut} width={70} height={70} alt="maquinas-de-corte-plasma-manual" />
              <strong>
                Máquinas corte plasma manual
              </strong>
            </button>
            <span style={{ backgroundColor: 'white' }}>
              <CiEdit color='black' size={25} onClick={() => router.push(`/add_subcategory/7e94cbea-4319-45ad-8999-97a736a795c7/Máquinas de corte plasma manual`)} />
              <br />
              <br />
              <FaProductHunt onClick={() => router.push(`/category_products/maquinas-de-corte-plasma-manual/Máquinas de corte plasma manual`)} size={28} />
            </span>
          </div>
        </div>
      </main>
    </>
  )
}

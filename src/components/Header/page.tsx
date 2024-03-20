'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from "react";
import { CiLogin } from 'react-icons/ci';

import logoLoginImg from '../../../public/logo.png';
import styles from './styles.module.css';

import { AuthContext } from "@/contexts/AuthContext";
import { setupAPIClient } from '@/services/api';


type CategorysProps = {
    id: string;
    name: string;
    slug: string;
    image: string;
}

export function Header() {

    const router = useRouter();

    const { signOut, user } = useContext(AuthContext);
    const [categorys, setCategorys] = useState<CategorysProps[]>();

    useEffect(() => {
        const apiClient = setupAPIClient();
        async function loadCategorys() {
            try {
                const { data } = await apiClient.get('/all_categorys');
                setCategorys(data?.all_categorys || []);

            } catch (error) {/* @ts-ignore */
                console.log(error.response.data);
            }
        }
        loadCategorys();
    }, []);


    return (
        <nav className={styles.topMenu}>
            <div className={styles.logo}>
                <Link href='/'>
                    <Image src={logoLoginImg} width={150} height={80} alt="Logo SUMIG" />
                </Link>
            </div>
            {categorys?.length === 0 ?
                null
                :
                <div className={styles.topMenuLojas}>
                    <button
                        onClick={ () => router.push('/stores')}
                    >
                        LOJAS
                    </button>
                </div>
            }
            <div className={styles.menuItems}>
                <ul>
                    <Link href="/user">{user?.name}</Link>
                    <CiLogin size={35} color='white' onClick={signOut} />
                </ul>
            </div>
        </nav>
    )
}
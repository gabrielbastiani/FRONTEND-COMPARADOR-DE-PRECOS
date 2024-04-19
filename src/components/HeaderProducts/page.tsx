'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext } from "react";
import { CiLogin } from 'react-icons/ci';
import { FaArrowLeft } from 'react-icons/fa';

import logoLoginImg from '../../../public/logo.png';
import styles from './styles.module.css';

import { AuthContext } from "@/contexts/AuthContext";


export function HeaderProducts() {

    const router = useRouter();

    const { signOut, user } = useContext(AuthContext);


    return (
        <nav className={styles.topMenu}>
            <div className={styles.logo}>
                <Link href='/'>
                    <Image src={logoLoginImg} width={150} height={80} alt="Logo SUMIG" />
                </Link>
            </div>

            <FaArrowLeft
                style={{ cursor: "pointer" }}
                onClick={() => router.back()}
                size={32}
                color='white'
            />

            <div className={styles.menuItems}>
                <ul>
                    <Link href="/user">{user?.name}</Link>
                    <CiLogin size={35} color='white' onClick={signOut} />
                </ul>
            </div>
        </nav>
    )
}
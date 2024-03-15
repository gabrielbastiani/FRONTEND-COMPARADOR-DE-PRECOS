'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useContext } from "react";
import { CiLogin } from 'react-icons/ci';

import logoLoginImg from '../../../public/logo.png';
import styles from './styles.module.css';

import { AuthContext } from "@/contexts/AuthContext";

export function Header() {

    const { signOut, user } = useContext(AuthContext);

    return (
        <nav className={styles.topMenu}>
            <div className={styles.logo}>
                <Image src={logoLoginImg} width={150} height={80} alt="Logo SUMIG" />
            </div>
            <div className={styles.topMenuLojas}>
                <button>LOJAS</button>
            </div>
            <div className={styles.menuItems}>
                <ul>
                    <Link href="/user">{user?.name}</Link>
                    <CiLogin size={35} color='white' onClick={signOut} />
                </ul>
            </div>
        </nav>
    )
}
import { useContext } from "react";

import { AuthContext } from "@/contexts/AuthContext";


export function HeaderFirst() {

    const { signOut } = useContext(AuthContext)
    
    return (
        <button onClick={signOut}>
           Sair
        </button>
    )
}
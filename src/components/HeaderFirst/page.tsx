import { useContext } from "react";

import LoadingRequests from "../LoadingRequests/page";

import { AuthContext } from "@/contexts/AuthContext";


export function HeaderFirst() {
    /* @ts-ignore */
    const { signOut, loading } = useContext(AuthContext);

    return (
        <>
            {loading ? (
                <LoadingRequests />
            ) : (
                <button onClick={signOut}>
                    Sair
                </button>
            )}
        </>
    )
}
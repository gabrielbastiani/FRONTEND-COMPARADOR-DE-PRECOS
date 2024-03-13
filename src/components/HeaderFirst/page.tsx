import { useContext } from "react";

import LoadingRequests from "../LoadingRequests/page";

import { AuthContext } from "@/contexts/AuthContext";


export function HeaderFirst() {

    const { signOut, loadingRequests } = useContext(AuthContext);

    return (
        <>
            {loadingRequests ? (
                <LoadingRequests />
            ) : (
                <button onClick={signOut}>
                    Sair
                </button>
            )}
        </>
    )
}
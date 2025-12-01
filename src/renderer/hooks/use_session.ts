import { useContext } from "react";
import { SessionContext } from "../contexts/session.context.provider";

export function useSession(){
    const context = useContext(SessionContext);
    if(!context){
        throw new Error("useSession hook must be used within the session contxt provider.");
    }
    return context;
}
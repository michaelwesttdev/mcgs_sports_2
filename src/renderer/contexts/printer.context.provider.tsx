import React, { createContext, useEffect, useState } from "react"
import { PrinterInfo } from "electron"
import { Toast } from "../components/Toast";

type ContextProviderType={
    printers:PrinterInfo[],
    hasRun:boolean,
    selectedPrinter:PrinterInfo,
    setSelectedPrinter: React.Dispatch<React.SetStateAction<PrinterInfo>>
}
export const PrintersContext = createContext<ContextProviderType|undefined>(undefined);
export default function PrintersContextProvider({children}:{children:React.ReactNode}){
    const [printers,setPrinters] = useState<PrinterInfo[]>([]);
    const [hasRun,setHasRun] = useState(false);
    const [selectedPrinter,setSelectedPrinter] = useState<PrinterInfo|undefined>(undefined);

    async function getPrinterList(){
        try {
            const {data,success,error} = await window.api.getPrinterList();
            if(!success){
                throw new Error(error);
            }
            setPrinters(data as PrinterInfo[]);
        } catch (error) {
            Toast({message:error.message??"Something went wrong",variation:"success"});
        }
    }

    useEffect(()=>{
        if(!hasRun){
            getPrinterList();
            setHasRun(true);
        }
    },[])
    return (
        <PrintersContext.Provider value={{
            printers,
            hasRun,
            selectedPrinter,
            setSelectedPrinter
        }}>
            {children}
        </PrintersContext.Provider>
    )
}
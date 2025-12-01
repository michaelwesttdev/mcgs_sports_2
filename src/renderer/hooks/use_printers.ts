import { useContext } from "react";
import { PrintersContext } from "../contexts/printer.context.provider";

export function usePrinters() {
  const context = useContext(PrintersContext);
  if (!context) {
    throw new Error("usePrinters must be used within an PrintersContextProvider");
  }
  return context;
}

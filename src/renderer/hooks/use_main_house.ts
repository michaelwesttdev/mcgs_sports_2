import { useContext } from "react";
import { MainHousesContext } from "../contexts/main.house.context.provider";

export function useMainHouse() {
  const context = useContext(MainHousesContext);
  if (!context) {
    throw new Error(
      "useMainHouseContext must be used within a MainHouseProvider"
    );
  }
  return context;
}

import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { Toast } from "../components/Toast";
import { MHouse } from "@/db/sqlite/main/schema";

type Props = { children: React.ReactNode };

interface MainHouseContextProps {
  listAllHouses: () => void;
  createHouse: (
    student: Omit<
      MHouse,
      "id" | "createdAt" | "updatedAt" | "deletedAt"
    >,
    toast?:boolean
  ) => Promise<boolean>;
  deleteHouse: (id: string) => Promise<boolean>;
  updateHouse: (
    id: string,
    house: Partial<MHouse>
  ) => Promise<boolean>;
  houses: MHouse[];
  loading: boolean;
  error: Error | null;
}

export const MainHousesContext = React.createContext<MainHouseContextProps>({
  listAllHouses: () => Promise.resolve(),
  createHouse: () => Promise.resolve(false),
  deleteHouse: () => Promise.resolve(false),
  updateHouse: () => Promise.resolve(false),
  houses: [],
  loading: false,
  error: null,
});

export default function MainHousesContextProvider({ children }: Props) {
  const [houses, setHouses] = useState<MHouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  async function listAllHouses() {
    setLoading(true);
    try {
      const response = await window.api.mainListHouse(undefined);
      if (!response.success) throw new Error(response.error);
      const data = await response.data;
      setHouses(data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }
  async function createHouse(
    house: Omit<
      MHouse,
      "id" | "createdAt" | "updatedAt" | "deletedAt"
    >,
    toast= true
  ) {
    setLoading(true);
    try {
      const id = nanoid();
      const response = await window.api.mainCreateHouse({
        id,
        ...house,
      });
      if (!response.success) throw new Error(response.error);
      const data = await response.data;
      setHouses((prev) => [...prev, data]);
      toast??Toast({
        message: "house created successfully",
        variation: "success",
      });
      return response.success;
    } catch (error) {
      Toast({ message: error.message, variation: "error" });
      return false;
    } finally {
      setLoading(false);
    }
  }
  async function deleteHouse(id: string) {
    setLoading(true);
    try {
      const response = await window.api.mainDeleteHouse(id);
      if (!response.success) throw new Error(response.error);
      const data = await response.data;
      setHouses((prev) =>
        prev.filter((house) => house.id !== id)
      );
      Toast({
        message: "House deleted successfully",
        variation: "success",
      });
      return response.success;
    } catch (error) {
      Toast({ message: error.message, variation: "error" });
      return false;
    } finally {
      setLoading(false);
    }
  }
  async function updateHouse(
    id: string,
    house: Partial<MHouse>
  ) {
    setLoading(true);
    try {
      const response = await window.api.mainUpdateHouse([id, house]);
      if (!response.success) throw new Error(response.error);
      const data = await response.data;
      setHouses((prev) =>
        prev.map((house) => (house.id === id ? data : house))
      );
      Toast({
        message: "House updated successfully",
        variation: "success",
      });
      return response.success;
    } catch (error) {
      Toast({ message: error.message, variation: "error" });
      return false;
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    (async () => {
      await listAllHouses();
    })();
  }, []);
  return (
    <MainHousesContext.Provider
      value={{
        houses,
        loading,
        error,
        listAllHouses,
        createHouse,
        deleteHouse,
        updateHouse,
      }}>
      {children}
    </MainHousesContext.Provider>
  );
}

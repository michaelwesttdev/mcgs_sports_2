import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { Toast } from "../components/Toast";
import { MSession } from "@/db/sqlite/main/schema";

type Props = { children: React.ReactNode };

interface SessionContextProps {
  listAllSessions: () => void;
  createSession: (
    session: Omit<MSession, "id" | "createdAt" | "updatedAt" | "deletedAt">
  ) => Promise<boolean>;
  deleteSession: (id: string) => Promise<boolean>;
  updateSession: (id: string, session: Partial<MSession>) => Promise<boolean>;
  getSession: (id: string) => Promise<MSession | undefined>;
  sessions: MSession[];
  loading: boolean;
  error: Error | null;
}

export const SessionContext = React.createContext<SessionContextProps>({
  listAllSessions: () => Promise.resolve(),
  createSession: () => Promise.resolve(false),
  deleteSession: () => Promise.resolve(false),
  updateSession: () => Promise.resolve(false),
  getSession: () => Promise.resolve(undefined),
  sessions: [],
  loading: false,
  error: null,
});

export default function SessionContextProvider({ children }: Props) {
  const [sessions, setSessions] = useState<MSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  async function listAllSessions() {
    setLoading(true);
    try {
      const response = await window.api.mainListSession(undefined);
      if (!response.success) throw new Error(response.error);
      const data = await response.data;
      setSessions(data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }
  async function getSession(id: string) {
    try {
      const response = await window.api.mainReadSession(id);
      if (!response.success) throw new Error(response.error);
      const data = await response.data;
      return data;
    } catch (error) {
      Toast({ message: "Failed getting session data", variation: "error" });
      return undefined;
    }
  }
  async function createSession(
    session: Omit<MSession, "id" | "createdAt" | "updatedAt" | "deletedAt">
  ) {
    setLoading(true);
    try {
      const id = nanoid();
      const response = await window.api.mainCreateSession({
        id,
        ...session,
      });
      if (!response.success) throw new Error(response.error);
      console.log(response);
      const data = await response.data;
      setSessions((prev) => [...prev, data]);
      Toast({
        message: "Session created successfully",
        variation: "success",
      });
      return true;
    } catch (error) {
      Toast({ message: error.message, variation: "error" });
      return false;
    } finally {
      setLoading(false);
    }
  }
  async function deleteSession(id: string) {
    setLoading(true);
    try {
      const response = await window.api.mainDeleteSession(id);
      if (!response.success) throw new Error(response.error);
      const data = await response.data;
      setSessions((prev) => prev.filter((session) => session.id !== id));
      Toast({
        message: "Session deleted successfully",
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
  async function updateSession(id: string, session: Partial<MSession>) {
    setLoading(true);
    try {
      const response = await window.api.mainUpdateSession([id, session]);
      if (!response.success) throw new Error(response.error);
      const data = await response.data;
      setSessions((prev) =>
        prev.map((session) => (session.id === id ? data : session))
      );
      Toast({
        message: "Session updated successfully",
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
      await listAllSessions();
    })();
  }, []);
  return (
    <SessionContext.Provider
      value={{
        sessions,
        loading,
        error,
        listAllSessions,
        createSession,
        deleteSession,
        updateSession,
        getSession,
      }}>
      {children}
    </SessionContext.Provider>
  );
}

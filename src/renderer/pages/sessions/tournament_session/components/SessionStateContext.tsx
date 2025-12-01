
import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useTournamentSessionHelper } from "./useTournamentSessionHelper";
import { useSessionSettings } from "./hooks/use_settings";

// Define the context shape based on the return type of useSessionHelper
// (You can also explicitly type this if you want stricter typing)
const SessionStateContext = createContext<ReturnType<typeof useTournamentSessionHelper> &{sessionId:string} | undefined>(undefined);

export const SessionStateProvider: React.FC<{ sessionId: string; children: React.ReactNode }> = ({ sessionId, children }) => {
  const sessionHelper = useTournamentSessionHelper(sessionId);
    const {setSessionId,settings} = useSessionSettings();
  useEffect(() => {
    if (sessionId) {
      (async () => {
        await window.api.handleSessionDbCreate(sessionId,"tournament");
        await window.api.handleSessionSettingsContextCreate(settings,sessionId)
        setSessionId(sessionId);
      })(); 
    }
    return () => { 
      setSessionId(null)
      window.api.handleSessionSettingsContextClose(sessionId)
      window.api.handleSessionDbClose(sessionId);
    };
  }, []);
  const value = useMemo(() => sessionHelper, [sessionHelper]);
  return (
    <SessionStateContext.Provider value={{
        ...value,
        sessionId
    }}>
      {children}
    </SessionStateContext.Provider>
  );
};

export function useSessionState() {
  const ctx = useContext(SessionStateContext);
  if (!ctx) throw new Error("useSessionState must be used within a SessionStateProvider");
  return ctx;
}

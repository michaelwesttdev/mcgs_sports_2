
import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useTeamSessionHelper } from "./useTeamSessionHelper";
import { useSessionSettings } from "./hooks/use_settings";

// Define the context shape based on the return type of useSessionHelper
// (You can also explicitly type this if you want stricter typing)
const SessionStateContext = createContext<ReturnType<typeof useTeamSessionHelper> &{sessionId:string} | undefined>(undefined);

export const SessionStateProvider: React.FC<{ sessionId: string; children: React.ReactNode }> = ({ sessionId, children }) => {
  const sessionHelper = useTeamSessionHelper(sessionId);
    const {setSessionId,settings} = useSessionSettings();
  const value = useMemo(() => sessionHelper, [sessionHelper]);
  useEffect(() => {
    if (sessionId) {
      (async () => {
        await window.api.handleSessionDbCreate(sessionId,"team");
        await window.api.handleSessionSettingsContextCreate(settings,sessionId)
        setSessionId(sessionId);
      })();
    }
    return () => {
      setSessionId(null)
      window.api.handleSessionDbClose(sessionId);
      window.api.handleSessionSettingsContextClose(sessionId)
    };
  }, []);
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

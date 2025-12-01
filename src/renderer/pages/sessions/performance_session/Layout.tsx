import React from "react";
import { Outlet , useParams } from "react-router";
import PSessionSettingsContextProvider from "./components/hooks/use_settings";
import { SessionStateProvider } from "./components/SessionStateContext";

export default function PerfomanceSessionLayout() {
  const { sessionId } = useParams();
  if(!sessionId) return null;
  return(
    <PSessionSettingsContextProvider>
        <SessionStateProvider sessionId={sessionId}>
          {<Outlet />}
        </SessionStateProvider>
    </PSessionSettingsContextProvider>
  )
}

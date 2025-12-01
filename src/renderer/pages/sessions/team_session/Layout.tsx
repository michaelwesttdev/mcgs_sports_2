import React from "react";
import { Outlet, useParams } from "react-router";
import { SessionStateProvider } from "./components/SessionStateContext";
import TSessionSettingsContextProvider from "./components/hooks/use_settings";

export default function TeamSessionLayout() {
  const { sessionId } = useParams();
  if (!sessionId) return null;
  return (
    <TSessionSettingsContextProvider>
      <SessionStateProvider sessionId={sessionId}>
        {<Outlet />}
      </SessionStateProvider>
    </TSessionSettingsContextProvider>
  )
}

import React from "react";
import { Outlet, useParams } from "react-router";
import { SessionStateProvider } from "./components/SessionStateContext";
import TSessionSettingsContextProvider from "./components/hooks/use_settings";
import { TournamentProvider } from "./contexts/TournamentContext";

export default function TournamentSessionLayout() {
  const { sessionId } = useParams();
  if (!sessionId) return null;
  return (
    <TournamentProvider sessionId={sessionId}>
      <TSessionSettingsContextProvider>
        <SessionStateProvider sessionId={sessionId}>
          {<Outlet />}
        </SessionStateProvider>
      </TSessionSettingsContextProvider>
    </TournamentProvider>
  )
}

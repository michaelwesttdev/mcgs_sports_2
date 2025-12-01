import React from "react";
import { Route, Routes } from "react-router";
import RootLayout from "./components/layouts/RootLayout";
import DashboardPage from "./pages/dashboard";
import SessionsPage from "./pages/sessions";
import EventsPage from "./pages/events";
import SessionsLayout from "./pages/sessions/Layout";
import SettingsPage from "~/pages/settings";
import { ErrorBoundary } from "~/rootErrorBoundary";
import UnderConstructionPage from "~/components/UnderConstructionPage";
import HelpPage from "./pages/help";
import PerfomanceSessionLayout from "./pages/sessions/performance_session/Layout";
import PerformaceSessionPage from "./pages/sessions/performance_session";
import PerfomanceParticipantPage from "./pages/sessions/performance_session/participant";
import TeamSessionLayout from "./pages/sessions/team_session/Layout";
import TeamSessionViewPage from "./pages/sessions/team_session";
import TeamPlayerPage from "./pages/sessions/team_session/player";
import StudentsPage from "./pages/students";
import FixtureView from "./pages/sessions/team_session/fixture";
import TournamentSessionLayout from "./pages/sessions/tournament_session/Layout";
import TournamentDashboard from "./pages/sessions/tournament_session/TournamentSessionOverview";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />} errorElement={<ErrorBoundary />}>
        <Route index element={<DashboardPage />} />
        <Route path='sessions' element={<SessionsLayout />}>
          <Route index element={<SessionsPage />} />
          <Route path='performance/:sessionId' element={<PerfomanceSessionLayout />}>
            <Route index element={<PerformaceSessionPage />} />
            <Route path="participant/:pId" element={<PerfomanceParticipantPage />} />
          </Route>
          <Route path='team/:sessionId' element={<TeamSessionLayout />}>
            <Route index element={<TeamSessionViewPage />} />
            <Route path="player/:pId" element={<TeamPlayerPage />} />
            <Route path="fixture/:fId" element={<FixtureView />} />
          </Route>
          <Route path='tournament/:sessionId' element={<TournamentSessionLayout />}>
            <Route index element={<TournamentDashboard />} />
            <Route path="player/:pId" element={<TeamPlayerPage />} />
            <Route path="fixture/:fId" element={<FixtureView />} />
          </Route>
        </Route>
        <Route path='events' element={<EventsPage />} />
        <Route path='students' element={<StudentsPage />} />
        <Route path='settings' element={<SettingsPage />} />
        <Route path='help' element={<HelpPage />} />
      </Route>
    </Routes>
  );
}

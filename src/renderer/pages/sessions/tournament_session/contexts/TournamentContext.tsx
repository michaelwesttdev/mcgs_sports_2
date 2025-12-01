"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import {TournamentTeam, TournamentPlayer, TournamentGroup, TournamentMatch, MatchParticipant, TournamentPlayerStat } from "@/db/sqlite/tournaments/schema";

interface TournamentState {
  teams: (TournamentTeam & {players:(TournamentPlayer & {stats:TournamentPlayerStat[]})[]})[];
  players: TournamentPlayer[];
  groups: TournamentGroup[];
  matches: TournamentMatch[];
  participants: MatchParticipant[];
  stats: TournamentPlayerStat[];
  loading: boolean;
  error: string | null;
  sessionIdState:string|null
}

interface TournamentContextProps extends TournamentState {
  // Actions
  loadTournament: () => Promise<void>;
  addTeam: (team: Omit<TournamentTeam, "id" | "createdAt" | "updatedAt" | "deletedAt">) => Promise<void>;
  updateMatch: (match: Partial<TournamentMatch> & { id: string }) => Promise<void>;
  // ... other actions
}

export const TournamentContext = createContext<TournamentContextProps | undefined>(undefined);

export const TournamentProvider = ({ children, sessionId }: { children: ReactNode, sessionId: string }) => {
  const [state, setState] = useState<TournamentState>({
    teams: [],
    players: [],
    groups: [],
    matches: [],
    participants: [],
    stats: [],
    loading: true,
    error: null,
    sessionIdState:null
  });

  const handleApiResponse = (response: { success: boolean; data: any; error?: any }) => {
    if (!response.success) {
      throw new Error(response.error?.message || "An unknown error occurred");
    }
    return response.data;
  };

  const loadTournament = async () => {
    try {
      setState((s) => ({ ...s, loading: true }));
      const [teams, players, groups, matches, participants, stats] = await Promise.all([
        window.api.tournamentListTeam(sessionId),
        window.api.tournamentListPlayer(sessionId),
        window.api.tournamentListGroup(sessionId),
        window.api.tournamentListMatch(sessionId),
        window.api.tournamentListMatchParticipant(sessionId),
        window.api.tournamentListPlayerStat(sessionId),
      ]);

      setState((prev)=>({
        ...prev,
        teams: handleApiResponse(teams),
        players: handleApiResponse(players),
        groups: handleApiResponse(groups),
        matches: handleApiResponse(matches),
        participants: handleApiResponse(participants),
        stats: handleApiResponse(stats),
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      setState((s) => ({ ...s, loading: false, error: error.message }));
    }
  };

  const addTeam = async (team: Omit<TournamentTeam, "id" | "createdAt" | "updatedAt" | "deletedAt">) => {
    try {
      await window.api.tournamentCreateTeam([sessionId, team]);
      await loadTournament(); // Reload data
    } catch (error: any) {
      setState((s) => ({ ...s, error: error.message }));
    }
  };

  const updateMatch = async ( match: Partial<TournamentMatch> & { id: string }) => {
    try {
      await window.api.tournamentUpdateMatch([sessionId, match]);
      await loadTournament(); // Reload data
    } catch (error: any) {
        setState((s) => ({ ...s, error: error.message }));
    }
  };

  const value = {
    ...state,
    teams: state.teams.map(team => {
      const players = state.players.filter(player => player.teamId === team.id).map(player=>{
        const stats = state.stats.filter(stat=>stat.playerId === player.id);
        return {...player,stats}
      });
      return { ...team, players };
    }),
    loadTournament,
    addTeam,
    updateMatch,
  };

  return (
    <TournamentContext.Provider value={value}>
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (context === undefined) {
    throw new Error("useTournament must be used within a TournamentProvider");
  }
  return context;
};

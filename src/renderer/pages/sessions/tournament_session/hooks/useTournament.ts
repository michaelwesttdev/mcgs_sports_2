import { useContext } from "react";
import { TournamentContext } from "../contexts/TournamentContext";

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (context === undefined) {
    throw new Error("useTournament must be used within a TournamentProvider");
  }
  return context;
};

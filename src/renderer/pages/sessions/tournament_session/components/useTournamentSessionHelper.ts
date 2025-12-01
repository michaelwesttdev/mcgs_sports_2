import { MSession } from "@/db/sqlite/main/schema";
import {
  TSTeam,
  TSPlayer,
  TSFixture,
  TSFixtureEvent,
  TSFixtureParticipant,
  TSPlayerFixtureStats,
} from "@/db/sqlite/t_sports/schema";
import { Toast } from "@/renderer/components/Toast";
import { useSession } from "@/renderer/hooks/use_session";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { GroupTeam, MatchParticipant, TournamentGroup, TournamentMatch, TournamentPlayer, TournamentPlayerStat, TournamentRound, TournamentTeam } from "@/db/sqlite/tournaments/schema";
import { TournamentGroupCompund, TournamentTeamCompound } from "@/shared/types/api";

export type UnDoctoredStateType = {
  teamsNormal: TournamentTeam[];
  playersNormal:TournamentPlayer[];
  groupsNormal:TournamentGroup[];
  groupTeamsNormal:GroupTeam[];
  roundsNormal:TournamentRound[];
  matchesNormal:TournamentMatch[];
  matchParticipantsNormal:MatchParticipant[];
  playerStatsNormal:TournamentPlayerStat[];
};
export type DoctoredStateType = {
  teams: TournamentTeamCompound[];
  groups:TournamentGroupCompund[];
};
export function useTournamentSessionHelper(sessionId: string) {
  const { getSession } = useSession();
  const [session, setSession] = useState<MSession | undefined>(undefined);
  const [unDoctoredState, setUnDoctoredState] = useState<UnDoctoredStateType>({
    teamsNormal: [],
    playersNormal: [],
    groupsNormal: [],
    groupTeamsNormal:[],
    roundsNormal:[],
    matchesNormal:[],
    matchParticipantsNormal:[],
    playerStatsNormal:[],
  });
  const [doctoredState, setDoctoredState] = useState<DoctoredStateType>({
    teams: [],
    groups:[]
  });

  const [loading, setLoading] = useState(true);

  function handleApiResponse<T>(response: {
    success: boolean;
    data?: T;
    error?: any;
  }) {
    console.log("response: ",response)
    if (!response.success) {
      throw new Error(response.error?.message || "An unknown error occurred");
    }
    return response.data;
  }

  // Overload for unDoctored
  function handleSetState<K extends keyof UnDoctoredStateType>(
    state: "unDoctored",
    key: K,
    value: UnDoctoredStateType[K]
  ): void;

  // Overload for doctored
  function handleSetState<K extends keyof DoctoredStateType>(
    state: "doctored",
    key: K,
    value: DoctoredStateType[K]
  ): void;

  // Implementation
  function handleSetState(
    state: "unDoctored" | "doctored",
    key: string,
    value: any
  ): void {
    if (state === "unDoctored") {
      setUnDoctoredState((prev) => ({
        ...prev,
        [key]: value,
      }));
    } else {
      setDoctoredState((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  }

  async function fetchSession() {
    const session = await getSession(sessionId);
    setSession(session);
    setLoading(false);
  }
  // --- Fetchers ---
  //team
  async function getTeams() {
    try {
      const res = handleApiResponse<TournamentTeam[]>(await window.api.tournamentListTeam(sessionId))
      handleSetState("unDoctored", "teamsNormal", res);
      return res;
    } catch (error) {
      console.log(error);
      Toast({ message: "Teams Not Fetched Successfully", variation: "error" });
      return null;
    }
  }
  async function teamCreate(
    team: Omit<TournamentTeam, "id" | "createdAt" | "deletedAt" | "updatedAt">
  ) {
    try {
      const id = nanoid();
      handleApiResponse<null>(
        await window.api.tournamentCreateTeam([sessionId, { id, ...team }])
      );
      Toast({ message: "Team Created Successfully", variation: "success" });
      return id;
    } catch (error) {
      console.log(error);
      Toast({ message: "Team Creation Failed", variation: "error" });
      return null;
    } finally {
      await refresh();
    }
  }
  async function updateTeam(id: string, teamToUpdate: Partial<TournamentTeam>) {
    try {
      handleApiResponse<null>(
        await window.api.tournamentUpdateTeam([sessionId, [id, teamToUpdate]])
      );
      Toast({ message: "Team Updated Successfully", variation: "success" });
      return teamToUpdate;
    } catch (error) {
      console.log(error);
      Toast({ message: "Team Update Failed", variation: "error" });
      return null;
    } finally {
      await refresh();
    }
  }
  async function deleteTeam(id: string) {
    try {
      handleApiResponse<null>(
        await window.api.tournamentDeleteTeam([sessionId, id])
      );
      Toast({ message: "Team Deleted Successfully", variation: "success" });
      return true;
    } catch (error) {
      console.log(error);
      Toast({ message: "Team Removal Failed", variation: "error" });
      return false;
    } finally {
      await refresh();
    }
  }
  async function getTeamById(id: string) {
    try {
      const res = handleApiResponse<TournamentTeam[]>(
        await window.api.tournamentReadTeam([sessionId, id])
      );
      return res;
    } catch (error) {
      console.log(error);
      Toast({ message: "Team Not Fetched Successfully", variation: "error" });
      return null;
    }
  }

  //player

  async function getPlayers() {
    try {
      const res = handleApiResponse<TournamentPlayer[]>(
        await window.api.tournamentListPlayer(sessionId)
      );
      handleSetState("unDoctored", "playersNormal", res);
      return res;
    } catch (error) {
      console.log(error);
      Toast({
        message: "Players Not Fetched Successfully",
        variation: "error",
      });
      return null;
    }
  }

  async function playerCreate(
    player: Omit<
      TournamentPlayer,
      "id" | "createdAt" | "deletedAt" | "updatedAt"
    >
  ) {
    try {
      const id = nanoid();
      handleApiResponse<null>(
        await window.api.tournamentCreatePlayer([sessionId, { id, ...player }])
      );
      Toast({ message: "Player Created Successfully", variation: "success" });
      return id;
    } catch (error) {
      console.log(error);
      Toast({ message: "Player Creation Failed", variation: "error" });
      return null;
    } finally {
      await refresh();
    }
  }

  async function updatePlayer(
    id: string,
    playerToUpdate: Partial<TournamentPlayer>
  ) {
    try {
      handleApiResponse<null>(
        await window.api.tournamentUpdatePlayer([
          sessionId,
          [id, playerToUpdate],
        ])
      );
      Toast({ message: "Player Updated Successfully", variation: "success" });
      return playerToUpdate;
    } catch (error) {
      console.log(error);
      Toast({ message: "Player Update Failed", variation: "error" });
      return null;
    } finally {
      await refresh();
    }
  }

  async function deletePlayer(id: string) {
    try {
      handleApiResponse<null>(
        await window.api.tournamentDeletePlayer([sessionId, id])
      );
      Toast({ message: "Player Deleted Successfully", variation: "success" });
      return true;
    } catch (error) {
      console.log(error);
      Toast({ message: "Player Removal Failed", variation: "error" });
      return false;
    } finally {
      await refresh();
    }
  }

  async function getPlayerById(id: string) {
    try {
      const res = handleApiResponse<TournamentPlayer[]>(
        await window.api.tournamentReadPlayer([sessionId, id])
      );
      return res;
    } catch (error) {
      console.log(error);
      Toast({ message: "Player Not Fetched Successfully", variation: "error" });
      return null;
    }
  }

  // GROUP
  async function getGroups() {
    try {
      const res = handleApiResponse<TournamentGroup[]>(
        await window.api.tournamentListGroup(sessionId)
      );
      handleSetState("unDoctored", "groupsNormal", res);
      return res;
    } catch (error) {
      console.log(error);
      Toast({ message: "Groups Not Fetched Successfully", variation: "error" });
      return null;
    }
  }

  async function groupCreate(
    group: Omit<TournamentGroup, "id" | "createdAt" | "deletedAt" | "updatedAt">
  ) {
    try {
      const id = nanoid();
      handleApiResponse<null>(
        await window.api.tournamentCreateGroup([sessionId, { id, ...group }])
      );
      Toast({ message: "Group Created Successfully", variation: "success" });
      return id;
    } catch (error) {
      console.log(error);
      Toast({ message: "Group Creation Failed", variation: "error" });
      return null;
    } finally {
      await refresh();
    }
  }

  async function updateGroup(
    id: string,
    groupToUpdate: Partial<TournamentGroup>
  ) {
    try {
      handleApiResponse<null>(
        await window.api.tournamentUpdateGroup([sessionId, [id, groupToUpdate]])
      );
      Toast({ message: "Group Updated Successfully", variation: "success" });
      return groupToUpdate;
    } catch (error) {
      console.log(error);
      Toast({ message: "Group Update Failed", variation: "error" });
      return null;
    } finally {
      await refresh();
    }
  }

  async function deleteGroup(id: string) {
    try {
      handleApiResponse<null>(
        await window.api.tournamentDeleteGroup([sessionId, id])
      );
      Toast({ message: "Group Deleted Successfully", variation: "success" });
      return true;
    } catch (error) {
      console.log(error);
      Toast({ message: "Group Removal Failed", variation: "error" });
      return false;
    } finally {
      await refresh();
    }
  }

  async function getGroupById(id: string) {
    try {
      const res = handleApiResponse<TournamentGroup[]>(
        await window.api.tournamentReadGroup([sessionId, id])
      );
      return res;
    } catch (error) {
      console.log(error);
      Toast({ message: "Group Not Fetched Successfully", variation: "error" });
      return null;
    }
  }

  //group_team
 async function getGroupTeams() {
  try {
    const res = handleApiResponse<GroupTeam[]>(await window.api.tournamentListGroupTeam(sessionId));
    handleSetState("unDoctored", "groupTeamsNormal", res);
    return res;
  } catch (error) {
    console.log(error);
    Toast({ message: "Group-Teams Not Fetched Successfully", variation: "error" });
    return null;
  }
}

async function groupTeamCreate(groupTeam: Omit<GroupTeam, "id" | "createdAt" | "deletedAt" | "updatedAt">) {
  try {
    const id = nanoid();
    handleApiResponse<null>(await window.api.tournamentCreateGroupTeam([sessionId, { id, ...groupTeam }]));
    Toast({ message: "Group-Team Created Successfully", variation: "success" });
    return id;
  } catch (error) {
    console.log(error);
    Toast({ message: "Group-Team Creation Failed", variation: "error" });
    return null;
  } finally {
    await refresh();
  }
}

async function updateGroupTeam(id: string, data: Partial<GroupTeam>) {
  try {
    handleApiResponse<null>(await window.api.tournamentUpdateGroupTeam([sessionId, [id, data]]));
    Toast({ message: "Group-Team Updated Successfully", variation: "success" });
    return data;
  } catch (error) {
    console.log(error);
    Toast({ message: "Group-Team Update Failed", variation: "error" });
    return null;
  } finally {
    await refresh();
  }
}

async function deleteGroupTeam(id: string) {
  try {
    handleApiResponse<null>(await window.api.tournamentDeleteGroupTeam([sessionId, id]));
    Toast({ message: "Group-Team Deleted Successfully", variation: "success" });
    return true;
  } catch (error) {
    console.log(error);
    Toast({ message: "Group-Team Removal Failed", variation: "error" });
    return false;
  } finally {
    await refresh();
  }
}

async function getGroupTeamById(id: string) {
  try {
    const res = handleApiResponse<GroupTeam[]>(await window.api.tournamentReadGroupTeam([sessionId, id]));
    return res;
  } catch (error) {
    console.log(error);
    Toast({ message: "Group-Team Not Fetched Successfully", variation: "error" });
    return null;
  }
}


  //round
  async function getRounds() {
  try {
    const res = handleApiResponse<TournamentRound[]>(await window.api.tournamentListRound(sessionId));
    handleSetState("unDoctored", "roundsNormal", res);
    return res;
  } catch (error) {
    console.log(error);
    Toast({ message: "Rounds Not Fetched Successfully", variation: "error" });
    return null;
  }
}

async function roundCreate(round: Omit<TournamentRound, "id" | "createdAt" | "deletedAt" | "updatedAt">) {
  try {
    const id = nanoid();
    handleApiResponse<null>(await window.api.tournamentCreateRound([sessionId, { id, ...round }]));
    Toast({ message: "Round Created Successfully", variation: "success" });
    return id;
  } catch (error) {
    console.log(error);
    Toast({ message: "Round Creation Failed", variation: "error" });
    return null;
  } finally {
    await refresh();
  }
}

async function updateRound(id: string, data: Partial<TournamentRound>) {
  try {
    handleApiResponse<null>(await window.api.tournamentUpdateRound([sessionId, [id, data]]));
    Toast({ message: "Round Updated Successfully", variation: "success" });
    return data;
  } catch (error) {
    console.log(error);
    Toast({ message: "Round Update Failed", variation: "error" });
    return null;
  } finally {
    await refresh();
  }
}

async function deleteRound(id: string) {
  try {
    handleApiResponse<null>(await window.api.tournamentDeleteRound([sessionId, id]));
    Toast({ message: "Round Deleted Successfully", variation: "success" });
    return true;
  } catch (error) {
    console.log(error);
    Toast({ message: "Round Removal Failed", variation: "error" });
    return false;
  } finally {
    await refresh();
  }
}

async function getRoundById(id: string) {
  try {
    const res = handleApiResponse<TournamentRound[]>(await window.api.tournamentReadRound([sessionId, id]));
    return res;
  } catch (error) {
    console.log(error);
    Toast({ message: "Round Not Fetched Successfully", variation: "error" });
    return null;
  }
}


  //match
  async function getMatches() {
  try {
    const res = handleApiResponse<TournamentMatch[]>(await window.api.tournamentListMatch(sessionId));
    handleSetState("unDoctored", "matchesNormal", res);
    return res;
  } catch (error) {
    console.log(error);
    Toast({ message: "Matches Not Fetched Successfully", variation: "error" });
    return null;
  }
}

async function matchCreate(match: Omit<TournamentMatch, "id" | "createdAt" | "deletedAt" | "updatedAt">) {
  try {
    const id = nanoid();
    handleApiResponse<null>(await window.api.tournamentCreateMatch([sessionId, { id, ...match }]));
    Toast({ message: "Match Created Successfully", variation: "success" });
    return id;
  } catch (error) {
    console.log(error);
    Toast({ message: "Match Creation Failed", variation: "error" });
    return null;
  } finally {
    await refresh();
  }
}

async function updateMatch(id: string, data: Partial<TournamentMatch>) {
  try {
    handleApiResponse<null>(await window.api.tournamentUpdateMatch([sessionId, [id, data]]));
    Toast({ message: "Match Updated Successfully", variation: "success" });
    return data;
  } catch (error) {
    console.log(error);
    Toast({ message: "Match Update Failed", variation: "error" });
    return null;
  } finally {
    await refresh();
  }
}

async function deleteMatch(id: string) {
  try {
    handleApiResponse<null>(await window.api.tournamentDeleteMatch([sessionId, id]));
    Toast({ message: "Match Deleted Successfully", variation: "success" });
    return true;
  } catch (error) {
    console.log(error);
    Toast({ message: "Match Removal Failed", variation: "error" });
    return false;
  } finally {
    await refresh();
  }
}

async function getMatchById(id: string) {
  try {
    const res = handleApiResponse<TournamentMatch[]>(await window.api.tournamentReadMatch([sessionId, id]));
    return res;
  } catch (error) {
    console.log(error);
    Toast({ message: "Match Not Fetched Successfully", variation: "error" });
    return null;
  }
}


  //match_participant
  async function getMatchParticipants() {
  try {
    const res = handleApiResponse<MatchParticipant[]>(await window.api.tournamentListMatchParticipant(sessionId));
    handleSetState("unDoctored", "matchParticipantsNormal", res);
    return res;
  } catch (error) {
    console.log(error);
    Toast({ message: "Match Participants Not Fetched Successfully", variation: "error" });
    return null;
  }
}

async function matchParticipantCreate(data: Omit<MatchParticipant, "id" | "createdAt" | "deletedAt" | "updatedAt">) {
  try {
    const id = nanoid();
    handleApiResponse<null>(await window.api.tournamentCreateMatchParticipant([sessionId, { id, ...data }]));
    Toast({ message: "Match Participant Created Successfully", variation: "success" });
    return id;
  } catch (error) {
    console.log(error);
    Toast({ message: "Creation Failed", variation: "error" });
    return null;
  } finally {
    await refresh();
  }
}

async function updateMatchParticipant(id: string, data: Partial<MatchParticipant>) {
  try {
    handleApiResponse<null>(await window.api.tournamentUpdateMatchParticipant([sessionId, [id, data]]));
    Toast({ message: "Match Participant Updated Successfully", variation: "success" });
    return data;
  } catch (error) {
    console.log(error);
    Toast({ message: "Update Failed", variation: "error" });
    return null;
  } finally {
    await refresh();
  }
}

async function deleteMatchParticipant(id: string) {
  try {
    handleApiResponse<null>(await window.api.tournamentDeleteMatchParticipant([sessionId, id]));
    Toast({ message: "Deleted Successfully", variation: "success" });
    return true;
  } catch (error) {
    console.log(error);
    Toast({ message: "Removal Failed", variation: "error" });
    return false;
  } finally {
    await refresh();
  }
}

async function getMatchParticipantById(id: string) {
  try {
    const res = handleApiResponse<MatchParticipant[]>(await window.api.tournamentReadMatchParticipant([sessionId, id]));
    return res;
  } catch (error) {
    console.log(error);
    Toast({ message: "Fetch Failed", variation: "error" });
    return null;
  }
}


  //player_stat
  async function getPlayerStats() {
  try {
    const res = handleApiResponse<TournamentPlayerStat[]>(await window.api.tournamentListPlayerStat(sessionId));
    handleSetState("unDoctored", "playerStatsNormal", res);
    return res;
  } catch (error) {
    console.log(error);
    Toast({ message: "Stats Not Fetched Successfully", variation: "error" });
    return null;
  }
}

async function playerStatsCreate(stat: Omit<TSPlayerFixtureStats, "id" | "createdAt" | "deletedAt" | "updatedAt">) {
  try {
    const id = nanoid();
    handleApiResponse<null>(await window.api.tournamentCreatePlayerStat([sessionId, { id, ...stat }]));
    Toast({ message: "Stat Created Successfully", variation: "success" });
    return id;
  } catch (error) {
    console.log(error);
    Toast({ message: "Stat Creation Failed", variation: "error" });
    return null;
  } finally {
    await refresh();
  }
}

async function updatePlayerStats(id: string, data: Partial<TSPlayerFixtureStats>) {
  try {
    handleApiResponse<null>(await window.api.tournamentUpdatePlayerStat([sessionId, [id, data]]));
    Toast({ message: "Stat Updated Successfully", variation: "success" });
    return data;
  } catch (error) {
    console.log(error);
    Toast({ message: "Stat Update Failed", variation: "error" });
    return null;
  } finally {
    await refresh();
  }
}

async function deletePlayerStats(id: string) {
  try {
    handleApiResponse<null>(await window.api.tournamentDeletePlayerStat([sessionId, id]));
    Toast({ message: "Stat Deleted Successfully", variation: "success" });
    return true;
  } catch (error) {
    console.log(error);
    Toast({ message: "Stat Removal Failed", variation: "error" });
    return false;
  } finally {
    await refresh();
  }
}

async function getPlayerStatsById(id: string) {
  try {
    const res = handleApiResponse<TSPlayerFixtureStats[]>(await window.api.tournamentReadPlayerStat([sessionId, id]));
    return res;
  } catch (error) {
    console.log(error);
    Toast({ message: "Stat Fetch Failed", variation: "error" });
    return null;
  }
}

function createCompoundStates(){

  //compound teams
  const teams = unDoctoredState.teamsNormal.map(team=>{
    const players = unDoctoredState.playersNormal.filter(p=>p.teamId===team.id).map(player=>{
      const stats = unDoctoredState.playerStatsNormal.filter(stat=>stat.playerId===player.id);
      return {...player,stats}
    });
    return {...team,players}
  });

  //compund groups
  const groups = unDoctoredState.groupsNormal.map(group=>{
    const rounds = unDoctoredState.roundsNormal.filter(round=>round.groupId===group.id).map(r=>{
      const matches = unDoctoredState.matchesNormal.filter(m=>m.roundId===r.id).map(m=>{
        const teams = unDoctoredState.teamsNormal.filter(t=>unDoctoredState.matchParticipantsNormal.some(mp=>mp.matchId===m.id&&mp.teamId===t.id));
        return {...m,teams}
      });
      return {...r,matches}
    });
    return {...group,rounds}
  })


  setDoctoredState((prev)=>({
    ...prev,
    teams,
    groups
  }))
}


  async function refresh() {
    await getTeams();
    await getGroups();
    await getGroupTeams();
    await getMatchParticipants();
    await getPlayers();
    await getMatches();
    await getRounds();
    await getPlayerStats();
  }

  useEffect(() => {
    if (sessionId) {
      fetchSession();
      refresh().catch((e) => console.error(e));
    }
  }, [sessionId]);
  useEffect(() => {
    createCompoundStates();
  }, [unDoctoredState]);

  return {
    session,
    loading,
    teamCreate,
    getTeams,
    updateTeam,
    deleteTeam,
    getTeamById,
    playerCreate,
    getPlayers,
    updatePlayer,
    deletePlayer,
    getPlayerById,
    groupCreate,
    getGroups,
    updateGroup,
    deleteGroup,
    getGroupById,
    groupTeamCreate,
    getGroupTeams,
    updateGroupTeam,
    deleteGroupTeam,
    getGroupTeamById,
    roundCreate,
    getRounds,
    updateRound,
    deleteRound,
    getRoundById,
    matchCreate,
    getMatches,
    updateMatch,
    deleteMatch,
    getMatchById,
    matchParticipantCreate,
    getMatchParticipants,
    updateMatchParticipant,
    deleteMatchParticipant,
    getMatchParticipantById,
    playerStatsCreate,
    getPlayerStats,
    updatePlayerStats,
    deletePlayerStats,
    getPlayerStatsById,
    ...unDoctoredState,
    ...doctoredState,
  };
}

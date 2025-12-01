import { MainDBContext } from "@/db/contexts/main.db.context";
import { PerformanceSportsDBContext } from "@/db/contexts/perfomance_sports.db.context";
import { BaseRepository } from "@/db/repositories/base.repository";
import { IpcChannels } from "@/shared/constants/constants";
import { ipcRenderer } from "electron";

const apiExtension = {
  mainCreateSession: (payload: any) =>
    ipcRenderer.invoke("main:session:create", payload),
  mainReadSession: (payload: any) =>
    ipcRenderer.invoke("main:session:read", payload),
  mainUpdateSession: (payload: any) =>
    ipcRenderer.invoke("main:session:update", payload),
  mainDeleteSession: (payload: any) =>
    ipcRenderer.invoke("main:session:delete", payload),
  mainListSession: (payload: any) =>
    ipcRenderer.invoke("main:session:list", payload),
  mainCreateEvent: (payload: any) =>
    ipcRenderer.invoke("main:event:create", payload),
  mainReadEvent: (payload: any) =>
    ipcRenderer.invoke("main:event:read", payload),
  mainUpdateEvent: (payload: any) =>
    ipcRenderer.invoke("main:event:update", payload),
  mainDeleteEvent: (payload: any) =>
    ipcRenderer.invoke("main:event:delete", payload),
  mainListEvent: (payload: any) =>
    ipcRenderer.invoke("main:event:list", payload),
  mainCreateStudent: (payload: any) =>
    ipcRenderer.invoke("main:student:create", payload),
  mainReadStudent: (payload: any) =>
    ipcRenderer.invoke("main:student:read", payload),
  mainUpdateStudent: (payload: any) =>
    ipcRenderer.invoke("main:student:update", payload),
  mainDeleteStudent: (payload: any) =>
    ipcRenderer.invoke("main:student:delete", payload),
  mainListStudent: (payload: any) =>
    ipcRenderer.invoke("main:student:list", payload),
  mainCreateHouse: (payload: any) =>
    ipcRenderer.invoke("main:house:create", payload),
  mainReadHouse: (payload: any) =>
    ipcRenderer.invoke("main:house:read", payload),
  mainUpdateHouse: (payload: any) =>
    ipcRenderer.invoke("main:house:update", payload),
  mainDeleteHouse: (payload: any) =>
    ipcRenderer.invoke("main:house:delete", payload),
  mainListHouse: (payload: any) =>
    ipcRenderer.invoke("main:house:list", payload),

  psCreateEvent: (payload: any) =>
    ipcRenderer.invoke("ps:event:create", ...payload),
  psReadEvent: (payload: any) => ipcRenderer.invoke("ps:event:read", ...payload),
  psUpdateEvent: (payload: any) =>
    ipcRenderer.invoke("ps:event:update", ...payload),
  psDeleteEvent: (payload: any) =>
    ipcRenderer.invoke("ps:event:delete", ...payload),
  psListEvent: (payload: any) => ipcRenderer.invoke("ps:event:list", payload),
  psCreateEventResult: (payload: any) =>
      ipcRenderer.invoke("ps:event_result:create", ...payload),
  psReadEventResult: (payload: any) => ipcRenderer.invoke("ps:event_result:read", ...payload),
  psUpdateEventResult: (payload: any) =>
      ipcRenderer.invoke("ps:event_result:update", ...payload),
  psDeleteEventResult: (payload: any) =>
      ipcRenderer.invoke("ps:event_result:delete", ...payload),
  psListEventResults: (payload: any) => ipcRenderer.invoke("ps:event_result:list", payload),
  psCreateHouse: (payload: any) =>
    ipcRenderer.invoke("ps:house:create", ...payload),
  psReadHouse: (payload: any) => ipcRenderer.invoke("ps:house:read", ...payload),
  psUpdateHouse: (payload: any) =>
    ipcRenderer.invoke("ps:house:update", ...payload),
  psDeleteHouse: (payload: any) =>
    ipcRenderer.invoke("ps:house:delete", ...payload),
  psListHouse: (payload: any) => ipcRenderer.invoke("ps:house:list", payload),
  psCreateParticipant: (payload: any) =>
    ipcRenderer.invoke("ps:participant:create", ...payload),
  psReadParticipant: (payload: any) =>
    ipcRenderer.invoke("ps:participant:read", ...payload),
  psUpdateParticipant: (payload: any) =>
    ipcRenderer.invoke("ps:participant:update", ...payload),
  psDeleteParticipant: (payload: any) =>
    ipcRenderer.invoke("ps:participant:delete", ...payload),
  psListParticipant: (payload: any) =>
    ipcRenderer.invoke("ps:participant:list", payload),

  // Team Sports APIs
  tsCreateTeam: (payload: any) =>
    ipcRenderer.invoke("ts:team:create", ...payload),
  tsReadTeam: (payload: any) =>
    ipcRenderer.invoke("ts:team:read", ...payload),
  tsUpdateTeam: (payload: any) =>
    ipcRenderer.invoke("ts:team:update", ...payload),
  tsDeleteTeam: (payload: any) =>
    ipcRenderer.invoke("ts:team:delete", ...payload),
  tsListTeam: (payload: any) =>
    ipcRenderer.invoke("ts:team:list", payload),

  tsCreatePlayer: (payload: any) =>
    ipcRenderer.invoke("ts:player:create", ...payload),
  tsReadPlayer: (payload: any) =>
    ipcRenderer.invoke("ts:player:read", ...payload),
  tsUpdatePlayer: (payload: any) =>
    ipcRenderer.invoke("ts:player:update", ...payload),
  tsDeletePlayer: (payload: any) =>
    ipcRenderer.invoke("ts:player:delete", ...payload),
  tsListPlayer: (payload: any) =>
    ipcRenderer.invoke("ts:player:list", payload),

  tsCreateFixture: (payload: any) =>
    ipcRenderer.invoke("ts:fixture:create", ...payload),
  tsReadFixture: (payload: any) =>
    ipcRenderer.invoke("ts:fixture:read", ...payload),
  tsUpdateFixture: (payload: any) =>
    ipcRenderer.invoke("ts:fixture:update", ...payload),
  tsDeleteFixture: (payload: any) =>
    ipcRenderer.invoke("ts:fixture:delete", ...payload),
  tsListFixture: (payload: any) =>
    ipcRenderer.invoke("ts:fixture:list", payload),

  tsCreateFixtureEvent: (payload: any) =>
    ipcRenderer.invoke("ts:fixture_event:create", ...payload),
  tsReadFixtureEvent: (payload: any) =>
    ipcRenderer.invoke("ts:fixture_event:read", ...payload),
  tsUpdateFixtureEvent: (payload: any) =>
    ipcRenderer.invoke("ts:fixture_event:update", ...payload),
  tsDeleteFixtureEvent: (payload: any) =>
    ipcRenderer.invoke("ts:fixture_event:delete", ...payload),
  tsListFixtureEvent: (payload: any) =>
    ipcRenderer.invoke("ts:fixture_event:list", payload),

  tsCreateFixtureParticipant: (payload: any) =>
    ipcRenderer.invoke("ts:fixture_participant:create", ...payload),
  tsReadFixtureParticipant: (payload: any) =>
    ipcRenderer.invoke("ts:fixture_participant:read", ...payload),
  tsUpdateFixtureParticipant: (payload: any) =>
    ipcRenderer.invoke("ts:fixture_participant:update", ...payload),
  tsDeleteFixtureParticipant: (payload: any) =>
    ipcRenderer.invoke("ts:fixture_participant:delete", ...payload),
  tsListFixtureParticipant: (payload: any) =>
    ipcRenderer.invoke("ts:fixture_participant:list", payload),

  tsCreatePlayerFixtureStats: (payload: any) =>
    ipcRenderer.invoke("ts:player_fixture_stats:create", ...payload),
  tsReadPlayerFixtureStats: (payload: any) =>
    ipcRenderer.invoke("ts:player_fixture_stats:read", ...payload),
  tsUpdatePlayerFixtureStats: (payload: any) =>
    ipcRenderer.invoke("ts:player_fixture_stats:update", ...payload),
  tsDeletePlayerFixtureStats: (payload: any) =>
    ipcRenderer.invoke("ts:player_fixture_stats:delete", ...payload),
  tsListPlayerFixtureStats: (payload: any) =>
    ipcRenderer.invoke("ts:player_fixture_stats:list", payload),

  // Tournament APIs
  tournamentCreateTeam: (payload: any) =>
    ipcRenderer.invoke("tournament:team:create", ...payload),
  tournamentReadTeam: (payload: any) =>
    ipcRenderer.invoke("tournament:team:read", ...payload),
  tournamentUpdateTeam: (payload: any) =>
    ipcRenderer.invoke("tournament:team:update", ...payload),
  tournamentDeleteTeam: (payload: any) =>
    ipcRenderer.invoke("tournament:team:delete", ...payload),
  tournamentListTeam: (payload: any) =>
    ipcRenderer.invoke("tournament:team:list", payload),

  tournamentCreatePlayer: (payload: any) =>
    ipcRenderer.invoke("tournament:player:create", ...payload),
  tournamentReadPlayer: (payload: any) =>
    ipcRenderer.invoke("tournament:player:read", ...payload),
  tournamentUpdatePlayer: (payload: any) =>
    ipcRenderer.invoke("tournament:player:update", ...payload),
  tournamentDeletePlayer: (payload: any) =>
    ipcRenderer.invoke("tournament:player:delete", ...payload),
  tournamentListPlayer: (payload: any) =>
    ipcRenderer.invoke("tournament:player:list", payload),

  tournamentCreateGroup: (payload: any) =>
    ipcRenderer.invoke("tournament:group:create", ...payload),
  tournamentReadGroup: (payload: any) =>
    ipcRenderer.invoke("tournament:group:read", ...payload),
  tournamentUpdateGroup: (payload: any) =>
    ipcRenderer.invoke("tournament:group:update", ...payload),
  tournamentDeleteGroup: (payload: any) =>
    ipcRenderer.invoke("tournament:group:delete", ...payload),
  tournamentListGroup: (payload: any) =>
    ipcRenderer.invoke("tournament:group:list", payload),

  tournamentCreateGroupTeam: (payload: any) =>
    ipcRenderer.invoke("tournament:group_team:create", ...payload),
  tournamentReadGroupTeam: (payload: any) =>
    ipcRenderer.invoke("tournament:group_team:read", ...payload),
  tournamentUpdateGroupTeam: (payload: any) =>
    ipcRenderer.invoke("tournament:group_team:update", ...payload),
  tournamentDeleteGroupTeam: (payload: any) =>
    ipcRenderer.invoke("tournament:group_team:delete", ...payload),
  tournamentListGroupTeam: (payload: any) =>
    ipcRenderer.invoke("tournament:group_team:list", payload),

  tournamentCreateRound: (payload: any) =>
    ipcRenderer.invoke("tournament:round:create", ...payload),
  tournamentReadRound: (payload: any) =>
    ipcRenderer.invoke("tournament:round:read", ...payload),
  tournamentUpdateRound: (payload: any) =>
    ipcRenderer.invoke("tournament:round:update", ...payload),
  tournamentDeleteRound: (payload: any) =>
    ipcRenderer.invoke("tournament:round:delete", ...payload),
  tournamentListRound: (payload: any) =>
    ipcRenderer.invoke("tournament:round:list", payload),

  tournamentCreateMatch: (payload: any) =>
    ipcRenderer.invoke("tournament:match:create", ...payload),
  tournamentReadMatch: (payload: any) =>
    ipcRenderer.invoke("tournament:match:read", ...payload),
  tournamentUpdateMatch: (payload: any) =>
    ipcRenderer.invoke("tournament:match:update", ...payload),
  tournamentDeleteMatch: (payload: any) =>
    ipcRenderer.invoke("tournament:match:delete", ...payload),
  tournamentListMatch: (payload: any) =>
    ipcRenderer.invoke("tournament:match:list", payload),

  tournamentCreateMatchParticipant: (payload: any) =>
    ipcRenderer.invoke("tournament:match_participant:create", ...payload),
  tournamentReadMatchParticipant: (payload: any) =>
    ipcRenderer.invoke("tournament:match_participant:read", ...payload),
  tournamentUpdateMatchParticipant: (payload: any) =>
    ipcRenderer.invoke("tournament:match_participant:update", ...payload),
  tournamentDeleteMatchParticipant: (payload: any) =>
    ipcRenderer.invoke("tournament:match_participant:delete", ...payload),
  tournamentListMatchParticipant: (payload: any) =>
    ipcRenderer.invoke("tournament:match_participant:list", payload),

  tournamentCreatePlayerStat: (payload: any) =>
    ipcRenderer.invoke("tournament:player_stat:create", ...payload),
  tournamentReadPlayerStat: (payload: any) =>
    ipcRenderer.invoke("tournament:player_stat:read", ...payload),
  tournamentUpdatePlayerStat: (payload: any) =>
    ipcRenderer.invoke("tournament:player_stat:update", ...payload),
  tournamentDeletePlayerStat: (payload: any) =>
    ipcRenderer.invoke("tournament:player_stat:delete", ...payload),
  tournamentListPlayerStat: (payload: any) =>
    ipcRenderer.invoke("tournament:player_stat:list", payload),
};
export const api = apiExtension;

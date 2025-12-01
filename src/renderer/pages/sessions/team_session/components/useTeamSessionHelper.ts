
import { MSession } from "@/db/sqlite/main/schema";
import { TSTeam, TSPlayer, TSFixture, TSFixtureEvent, TSFixtureParticipant, TSPlayerFixtureStats } from "@/db/sqlite/t_sports/schema";
import { Toast } from "@/renderer/components/Toast";
import { useSession } from "@/renderer/hooks/use_session";
import { useEffect, useState } from "react";
import {nanoid} from "nanoid";

export function useTeamSessionHelper(sessionId: string) {
  const { getSession } = useSession();
  const [session, setSession] = useState<MSession | undefined>(undefined);
  const [teams, setTeams] = useState<TSTeam[]>([]);
  const [players, setPlayers] = useState<TSPlayer[]>([]);
  const [fixtures, setFixtures] = useState<TSFixture[]>([]);
  const [fixtureEvents, setFixtureEvents] = useState<TSFixtureEvent[]>([]);
  const [fixtureParticipants, setFixtureParticipants] = useState<TSFixtureParticipant[]>([]);
  const [playerFixtureStats, setPlayerFixtureStats] = useState<TSPlayerFixtureStats[]>([]);

  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  async function fetchSession() {
    const session = await getSession(sessionId);
    setSession(session);
    setLoading(false);
  }
   // --- Fetchers ---
    async function fetchTeams() {
      try {
        const res = await window.api.tsListTeam(sessionId);
        if (!res.success) throw new Error(res.error);
        setTeams(res.data);
      } catch (error) { 
        Toast({ message: "Error fetching teams", variation: "error" });
      }
    }

    async function fetchPlayers() {
      try {
        const res = await window.api.tsListPlayer(sessionId);
        if (!res.success) throw new Error(res.error);
        setPlayers(res.data);
      } catch (error) {
        Toast({ message: "Error fetching players", variation: "error" });
      }
    }

    async function fetchFixtures() {
      try {
        const res = await window.api.tsListFixture(sessionId);
        if (!res.success) throw new Error(res.error);
        setFixtures(res.data);
      } catch (error) {
        Toast({ message: "Error fetching fixtures", variation: "error" });
      }
    }

    async function fetchFixtureEvents() {
      try {
        const res = await window.api.tsListFixtureEvent(sessionId);
        if (!res.success) throw new Error(res.error);
        setFixtureEvents(res.data);
      } catch (error) {
        Toast({ message: "Error fetching fixture events", variation: "error" });
      }
    }

    async function fetchFixtureParticipants() {
      try {
        const res = await window.api.tsListFixtureParticipant(sessionId);
        if (!res.success) throw new Error(res.error);
        setFixtureParticipants(res.data);
      } catch (error) {
        Toast({ message: "Error fetching fixture participants", variation: "error" });
      }
    }

    async function fetchPlayerFixtureStats() {
      try {
        const res = await window.api.tsListPlayerFixtureStats(sessionId);
        if (!res.success) throw new Error(res.error);
        setPlayerFixtureStats(res.data);
      } catch (error) {
        Toast({ message: "Error fetching player fixture stats", variation: "error" });
      }
    }

  const refresh = async () => {
    await fetchSession();

    await fetchTeams();
    await fetchPlayers();
    await fetchFixtures();
    await fetchFixtureEvents();
    await fetchFixtureParticipants();
    await fetchPlayerFixtureStats();
  }
  // --- CRUD and Get One Functions ---
  // Teams
  async function createTeam(team:Omit<TSTeam, 'id'| 'createdAt' | 'updatedAt'| 'deletedAt'>) {
    try {
      const id = nanoid();
      const res = await window.api.tsCreateTeam([sessionId,{ id, ...team }]);
      if (!res.success) throw new Error(res.error);
      await fetchTeams();
    } catch (e) {
      Toast({ message: "Error creating team", variation: "error" });
    }
  }
  async function updateTeam(id:string, data:Partial<TSTeam>) {
    try {
      const res = await window.api.tsUpdateTeam([sessionId,[id, data]]);
      if (!res.success) throw new Error(res.error);
      await fetchTeams();
    } catch (e) {
      Toast({ message: "Error updating team", variation: "error" });
    }
  }
  async function deleteTeam(id:string) {
    try {
      const res = await window.api.tsDeleteTeam([sessionId,id]);
      if (!res.success) throw new Error(res.error);
      await fetchTeams();
    } catch (e) {
      Toast({ message: "Error deleting team", variation: "error" });
    }
  }
  async function getTeam(id:string) {
    try {
      const res = await window.api.tsReadTeam([sessionId,id]);
      if (!res.success) throw new Error(res.error);
      return res.data;
    } catch (e) {
      Toast({ message: "Error fetching team", variation: "error" });
    }
  }

  // Players
  async function createPlayer(player:Omit<TSPlayer, 'id'| 'createdAt' | 'updatedAt'| 'deletedAt'>) {
    try {
      const id = nanoid();
      const res = await window.api.tsCreatePlayer([sessionId,{ id, ...player }]);
      if (!res.success) throw new Error(res.error);
      await fetchPlayers();
    } catch (e) {
      Toast({ message: "Error creating player", variation: "error" });
    }
  }
  async function updatePlayer(id:string, data:Partial<TSPlayer>) {
    try {
      const res = await window.api.tsUpdatePlayer([sessionId,[id, data]]);
      if (!res.success) throw new Error(res.error);
      await fetchPlayers();
    } catch (e) {
      Toast({ message: "Error updating player", variation: "error" });
    }
  }
  async function deletePlayer(id:string) {
    try {
      const res = await window.api.tsDeletePlayer([sessionId,id]);
      if (!res.success) throw new Error(res.error);
      await fetchPlayers();
    } catch (e) {
      Toast({ message: "Error deleting player", variation: "error" });
    }
  }
  async function getPlayer(id:string) {
    try {
      const res = await window.api.tsReadPlayer([sessionId,id]);
      if (!res.success) throw new Error(res.error);
      return res.data;
    } catch (e) {
      Toast({ message: "Error fetching player", variation: "error" });
    }
  }

  // Fixtures
  async function createFixture(fixture:Omit<TSFixture, 'createdAt' | 'updatedAt'| 'deletedAt'>) {
    try {
      const id = nanoid();
      const res = await window.api.tsCreateFixture([sessionId,{ id, ...fixture }]);
      if (!res.success) throw new Error(res.error);
      await fetchFixtures();
    } catch (e) {
      Toast({ message: "Error creating fixture", variation: "error" });
    }
  }
  async function updateFixture(id:string, data:Partial<TSFixture>) {
    try {
      const res = await window.api.tsUpdateFixture([sessionId,[id, data]]);
      if (!res.success) throw new Error(res.error);
      await fetchFixtures();
    } catch (e) {
      Toast({ message: "Error updating fixture", variation: "error" });
    }
  }
  async function deleteFixture(id:string) {
    try {
      const res = await window.api.tsDeleteFixture([sessionId,id]);
      if (!res.success) throw new Error(res.error);
      await fetchFixtures();
    } catch (e) {
      Toast({ message: "Error deleting fixture", variation: "error" });
    }
  }
  async function getFixture(id:string) {
    try {
      const res = await window.api.tsReadFixture([sessionId,id]);
      if (!res.success) throw new Error(res.error);
      return res.data;
    } catch (e) {
      Toast({ message: "Error fetching fixture", variation: "error" });
    }
  }

  // Fixture Events
  async function createFixtureEvent(event:Omit<TSFixtureEvent, 'id'| 'createdAt' | 'updatedAt'| 'deletedAt'>) {
    try {
      const id = nanoid();
      const res = await window.api.tsCreateFixtureEvent([sessionId,{ id, ...event }]);
      if (!res.success) throw new Error(res.error);
      await fetchFixtureEvents();
    } catch (e) {
      Toast({ message: "Error creating fixture event", variation: "error" });
    }
  }
  async function updateFixtureEvent(id:string, data:Partial<TSFixtureEvent>) {
    try {
      const res = await window.api.tsUpdateFixtureEvent([sessionId,[id, data]]);
      if (!res.success) throw new Error(res.error);
      await fetchFixtureEvents();
    } catch (e) {
      Toast({ message: "Error updating fixture event", variation: "error" });
    }
  }
  async function deleteFixtureEvent(id:string) {
    try {
      const res = await window.api.tsDeleteFixtureEvent([sessionId,id]);
      if (!res.success) throw new Error(res.error);
      await fetchFixtureEvents();
    } catch (e) {
      Toast({ message: "Error deleting fixture event", variation: "error" });
    }
  }
  async function getFixtureEvent(id:string) {
    try {
      const res = await window.api.tsReadFixtureEvent([sessionId,id]);
      if (!res.success) throw new Error(res.error);
      return res.data;
    } catch (e) {
      Toast({ message: "Error fetching fixture event", variation: "error" });
    }
  }

  // Fixture Participants
  async function createFixtureParticipant(participant:Omit<TSFixtureParticipant, 'id'| 'createdAt' | 'updatedAt'| 'deletedAt'>) {
    try {
      const id = nanoid()
      const res = await window.api.tsCreateFixtureParticipant([sessionId,{ ...participant,id }]);
      if (!res.success) throw new Error(res.error);
      await fetchFixtureParticipants();
    } catch (e) {
      Toast({ message: "Error creating fixture participant", variation: "error" });
    }
  }
  async function updateFixtureParticipant(id:string, data:Partial<TSFixtureParticipant>) {
    try {
      const res = await window.api.tsUpdateFixtureParticipant([sessionId,[id, data]]);
      if (!res.success) throw new Error(res.error);
      await fetchFixtureParticipants();
    } catch (e) {
      Toast({ message: "Error updating fixture participant", variation: "error" });
    }
  }
  async function deleteFixtureParticipant(id:string) {
    try {
      const res = await window.api.tsDeleteFixtureParticipant([sessionId,id]);
      if (!res.success) throw new Error(res.error);
      await fetchFixtureParticipants();
    } catch (e) {
      Toast({ message: "Error deleting fixture participant", variation: "error" });
    }
  }
  async function getFixtureParticipant(id:string) {
    try {
      const res = await window.api.tsReadFixtureParticipant([sessionId,id]);
      if (!res.success) throw new Error(res.error);
      return res.data;
    } catch (e) {
      Toast({ message: "Error fetching fixture participant", variation: "error" });
    }
  }

  // Player Fixture Stats
  async function createPlayerFixtureStats(stats:Omit<TSPlayerFixtureStats, 'id'| 'createdAt' | 'updatedAt'| 'deletedAt'>) {
    try {
      const id = nanoid()
      const res = await window.api.tsCreatePlayerFixtureStats([sessionId,{ ...stats,id }]);
      if (!res.success) throw new Error(res.error);
      await fetchPlayerFixtureStats();
    } catch (e) {
      Toast({ message: "Error creating player fixture stats", variation: "error" });
    }
  }
  async function updatePlayerFixtureStats(id:string, data:Partial<TSPlayerFixtureStats>) {
    try {
      const res = await window.api.tsUpdatePlayerFixtureStats([sessionId,[id, data]]);
      if (!res.success) throw new Error(res.error);
      await fetchPlayerFixtureStats();
    } catch (e) {
      Toast({ message: "Error updating player fixture stats", variation: "error" });
    }
  }
  async function deletePlayerFixtureStats(id:string) {
    try {
      const res = await window.api.tsDeletePlayerFixtureStats([sessionId,id]);
      if (!res.success) throw new Error(res.error);
      await fetchPlayerFixtureStats();
    } catch (e) {
      Toast({ message: "Error deleting player fixture stats", variation: "error" });
    }
  }
  async function getPlayerFixtureStats(id:string) {
    try {
      const res = await window.api.tsReadPlayerFixtureStats([sessionId,id]);
      if (!res.success) throw new Error(res.error);
      return res.data;
    } catch (e) {
      Toast({ message: "Error fetching player fixture stats", variation: "error" });
    }
  }

  useEffect(() => {
    if (sessionId) {
      refresh().catch(e=>console.error(e));
    }
  }, [sessionId]);

  return {
    session,
    loading,
    query,
    setQuery,
    teams,
    players,
    fixtures,
    fixtureEvents,
    fixtureParticipants,
    playerFixtureStats,
    fetchTeams,
    fetchPlayers,
    fetchFixtures,
    fetchFixtureEvents,
    fetchFixtureParticipants,
    fetchPlayerFixtureStats,
    createTeam,
    updateTeam,
    deleteTeam,
    getTeam,
    createPlayer,
    updatePlayer,
    deletePlayer,
    getPlayer,
    createFixture,
    updateFixture,
    deleteFixture,
    getFixture,
    createFixtureEvent,
    updateFixtureEvent,
    deleteFixtureEvent,
    getFixtureEvent,
    createFixtureParticipant,
    updateFixtureParticipant,
    deleteFixtureParticipant,
    getFixtureParticipant,
    createPlayerFixtureStats,
    updatePlayerFixtureStats,
    deletePlayerFixtureStats,
    getPlayerFixtureStats,
  };
}

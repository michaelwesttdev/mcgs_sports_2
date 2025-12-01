import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Trophy, Calendar, ArrowLeft, Shield, Star, Target } from "lucide-react";
import NotFound from "./components/not-found";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import Loader from "@/renderer/components/Loader";
import { Button } from "@/renderer/components/ui/button";
import ScrollBox from "@/renderer/components/ScrollBox";
import { TSPlayer, TSTeam, TSFixture, TSPlayerFixtureStats } from "@/db/sqlite/t_sports/schema";
import { mockPlayers, mockTeams, mockFixtures, mockPlayerStats } from "./components/mock-data";
import { useSessionState } from "../components/SessionStateContext";

export default function TeamPlayerPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [playerData, setPlayerData] = useState<TSPlayer>();
  const [teamData, setTeamData] = useState<TSTeam>();
  const [playerStats, setPlayerStats] = useState<TSPlayerFixtureStats[]>([]);
  const [fixtures, setFixtures] = useState<TSFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const {players,teams,playerFixtureStats,fixtures:fx} = useSessionState()

  useEffect(() => {
    if (params.pId) {
      const player = players.find((p) => p.id === params.pId);
      if (player) {
        const team = teams.find((t) => t.id === player.teamId);
        const stats = playerFixtureStats.filter((s) => s.playerId === player.id);
        const playerFixtures = fx.filter(f => stats.some(s => s.fixtureId === f.id));

        setPlayerData(player);
        setTeamData(team);
        setPlayerStats(stats);
        setFixtures(playerFixtures);
      }
      setLoading(false);
    }
  }, [params.pId]);

  if (loading) {
    return <Loader />;
  }

  if (!playerData) {
    return <NotFound sessionId={params.sessionId} />;
  }

  const getInitials = (name: string) => {
    const n = name.split(" ");
    if (n.length <= 0) return "";
    return `${n[0].charAt(0)}${n[n.length - 1].charAt(0)}`.toUpperCase();
  };

  return (
    <ScrollBox>
      <div className="container mx-auto p-6 space-y-6">
        <Button onClick={() => navigate(`/sessions/team/${params.sessionId}?tab=Players`)}><ArrowLeft />Back</Button>
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="flex-1">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="text-lg font-semibold">
                    {getInitials(playerData.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{playerData.name}</CardTitle>
                  {teamData && (
                    <div className="flex items-center gap-2 mt-2">
                      <Shield className="w-5 h-5 text-gray-500" />
                      <span className="font-semibold">{teamData.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Fixtures Played</CardTitle>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fixtures.length}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Fixture History & Stats</CardTitle>
          </CardHeader>
          <CardContent>
            {fixtures.length > 0 ? (
              <div className="space-y-4">
                {fixtures.map((fixture) => {
                  const statsForFixture = playerStats.filter(s => s.fixtureId === fixture.id);
                  return (
                    <div key={fixture.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold">{fixture.name}</h3>
                          <p className="text-sm text-muted-foreground">{new Date(fixture.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          {statsForFixture.map(stat => (
                            <div key={stat.id} className="text-center">
                              <p className="font-bold text-lg">{stat.statValue}</p>
                              <p className="text-sm text-muted-foreground capitalize">{stat.statKey}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No fixture history available.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollBox>
  );
}
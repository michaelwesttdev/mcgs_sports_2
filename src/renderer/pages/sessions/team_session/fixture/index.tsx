"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Calendar,
  Clock,
  Trophy,
  Users,
  Target,
  TrendingUp,
  ArrowLeft,
  Trash,
  X,
} from "lucide-react";
import type {
  TSFixture,
  TSTeam,
  TSFixtureParticipant,
  TSFixtureEvent,
  TSPlayerFixtureStats,
} from "@/db/sqlite/t_sports/schema";
import { useSessionState } from "../components/SessionStateContext";
import { useNavigate, useParams } from "react-router";
import ScrollBox from "@/renderer/components/ScrollBox";
import { Button } from "@/renderer/components/ui/button";
import { FixtureEventDialog } from "../components/FixtureEventDialog";
import { DeleteModal } from "@/renderer/components/deleteModal";
import { Toast } from "@/renderer/components/Toast";
import { PlayerStatsDialog } from "../components/PlayerStatsDialog";
import { Input } from "@/renderer/components/ui/input";

interface FixtureViewProps {
  fixtureId: string;
  sessionId: string;
  useTeamSessionHelper: (sessionId: string) => any;
}

export default function FixtureView() {
  const {
    fixtures,
    teams,
    players,
    fixtureParticipants,
    updateFixtureParticipant,
    fixtureEvents,
    playerFixtureStats,
    loading,
    sessionId,
    deleteFixtureEvent,
    deletePlayerFixtureStats,
  } = useSessionState();
  const params = useParams();
  const [fixture, setFixture] = useState<TSFixture | null>(null);
  const [homeTeam, setHomeTeam] = useState<TSTeam | null>(null);
  const [awayTeam, setAwayTeam] = useState<TSTeam | null>(null);
  const [participants, setParticipants] = useState<TSFixtureParticipant[]>([]);
  const [events, setEvents] = useState<TSFixtureEvent[]>([]);
  const [stats, setStats] = useState<TSPlayerFixtureStats[]>([]);
  const [fixtureId, setFixtureId] = useState("");
  const [updatedScores, setUpdatedScores] = useState({
    homeScore: {
      value: 0,
      changed: false
    },
    awayScore: {
      value: 0,
      changed: false
    },
  })
  const navigate = useNavigate();

  const getPlayerName = (playerId: string) => {
    const player = players.find((p) => p.id === playerId);
    return player?.name || "Unknown Player";
  };

  const getTeamName = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    return team?.name || "Unknown Team";
  };

  const getTeamScore = (teamId: string) => {
    const participant = participants.find((p) => p.teamId === teamId);
    return participant?.score || 0;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const groupStatsByPlayer = () => {
    const grouped: Record<string, TSPlayerFixtureStats[]> = {};
    stats.forEach((stat) => {
      if (!grouped[stat.playerId]) {
        grouped[stat.playerId] = [];
      }
      grouped[stat.playerId].push(stat);
    });
    return grouped;
  };
  const scores = useMemo(() => {
    if (!fixture) {
      return {
        homeScore: 0,
        awayScore: 0
      }
    }
    const homeScore = getTeamScore(fixture?.homeTeamId);
    const awayScore = getTeamScore(fixture?.awayTeamId);
    return {
      homeScore: homeScore,
      awayScore: awayScore
    }
  }, [fixture, fixtureParticipants]);
  useEffect(() => {
    if (params.fId) {
      setFixtureId(params.fId);
    }
  }, [params]);
  useEffect(() => {
    if (!loading && fixtures.length > 0) {
      const currentFixture = fixtures.find((f) => f.id === fixtureId);
      if (currentFixture) {
        setFixture(currentFixture);

        // Find teams
        const home = teams.find((t) => t.id === currentFixture.homeTeamId);
        const away = teams.find((t) => t.id === currentFixture.awayTeamId);
        setHomeTeam(home || null);
        setAwayTeam(away || null);

        // Filter related data
        setParticipants(
          fixtureParticipants.filter((p) => p.fixtureId === fixtureId)
        );
        setEvents(
          fixtureEvents
            .filter((e) => e.fixtureId === fixtureId)
            .sort(
              (a, b) =>
                new Date(a.timestamp).getTime() -
                new Date(b.timestamp).getTime()
            )
        );
        setStats(playerFixtureStats.filter((s) => s.fixtureId === fixtureId));
      }
    }
  }, [
    fixtureId,
    fixtures,
    teams,
    fixtureParticipants,
    fixtureEvents,
    playerFixtureStats,
    loading,
  ]);

  useEffect(() => {
    async function handleScoreUpdates() {
      if (!fixture) return;
      if (updatedScores.homeScore.changed) {
        const id = participants.find(p=>p.teamId === fixture.homeTeamId)?.id||""
        await updateFixtureParticipant(id, {
          score: updatedScores.homeScore.value
        })
      }
      if (updatedScores.awayScore.changed) {
        const id = participants.find(p=>p.teamId === fixture.awayTeamId)?.id||""
        await updateFixtureParticipant(id, {
          score: updatedScores.awayScore.value
        })
      }
    }
    const interval = setInterval(handleScoreUpdates, 500);
    return () => clearInterval(interval);
  }, [updatedScores, fixture])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading fixture details...</p>
        </div>
      </div>
    );
  }

  if (!fixture) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Fixture Not Found</h3>
          <p className="text-muted-foreground">
            The requested fixture could not be found.
          </p>
        </div>
      </div>
    );
  }
  const isFinished = participants.length > 0;

  return (
    <ScrollBox className="flex-1 overflow-y-auto pb-10">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <Button
          onClick={() => {
            navigate(`/sessions/team/${params.sessionId}?tab=Fixtures`);
          }}>
          <ArrowLeft />
          Back
        </Button>
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(fixture.date)}</span>
            {fixture.round && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <Badge variant="outline">{fixture.round}</Badge>
              </>
            )}
            {fixture.gender && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <Badge variant="secondary">{fixture.gender}</Badge>
              </>
            )}
          </div>

          <h1 className="text-3xl font-bold">{fixture.name}</h1>

          {/* Score Display */}
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    {homeTeam?.name || "Home Team"}
                  </h3>
                  <div className="text-4xl font-bold text-primary">
                    <Input value={
                      (() => {
                        const scoreChanged = updatedScores.homeScore.changed;
                        let score = 0;
                        if (scoreChanged) {
                          score = updatedScores.homeScore.value
                        } else {
                          score = scores.homeScore
                        }
                        return score;
                      })()
                    } onChange={(e) => {
                      setUpdatedScores(prev => ({
                        ...prev,
                        homeScore: {
                          value: parseInt(e.target.value),
                          changed: true
                        }
                      }))
                    }}
                      type="number"
                      className="text-4xl md:text-4xl text-center border-none outline-none shadow-none ring-0"
                    />
                  </div>
                </div>

                <div className="px-4">
                  <div className="text-2xl font-bold text-muted-foreground">
                    VS
                  </div>
                </div>

                <div className="text-center flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    {awayTeam?.name || "Away Team"}
                  </h3>
                  <div className="text-4xl font-bold text-primary">
                    <Input value={
                      (() => {
                        const scoreChanged = updatedScores.awayScore.changed;
                        let score = 0;
                        if (scoreChanged) {
                          score = updatedScores.awayScore.value
                        } else {
                          score = scores.awayScore
                        }
                        return score;
                      })()
                    } onChange={(e) => {
                      setUpdatedScores(prev => ({
                        ...prev,
                        awayScore: {
                          value: parseInt(e.target.value),
                          changed: true
                        }
                      }))
                    }}
                      type="number"
                      className="text-4xl md:text-4xl text-center border-none outline-none shadow-none ring-0"
                    />
                  </div>
                </div>
              </div>

              {isFinished && (
                <div className="text-center mt-4">
                  <Badge
                    variant={
                      scores.homeScore > scores.awayScore
                        ? "default"
                        : scores.awayScore > scores.homeScore
                          ? "secondary"
                          : "outline"
                    }>
                    {scores.homeScore > scores.awayScore
                      ? `${homeTeam?.name} Wins`
                      : scores.awayScore > scores.homeScore
                        ? `${awayTeam?.name} Wins`
                        : "Draw"}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Player Stats
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Info
            </TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Match Events
                  </CardTitle>
                  <CardDescription>
                    Timeline of events during the fixture
                  </CardDescription>
                </div>
                <FixtureEventDialog fixture={fixture} />
              </CardHeader>
              <CardContent>
                {events.length > 0 ? (
                  <div className="space-y-4">
                    {events.map((event, index) => (
                      <div
                        key={event.id}
                        className="flex items-center gap-4 p-3 rounded-lg border relative">
                        <div className="text-sm font-mono text-muted-foreground min-w-[60px]">
                          {formatTime(event.timestamp)}
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {event.eventType}
                        </Badge>
                        <div className="flex-1">
                          <p className="text-sm">Event #{index + 1}</p>
                        </div>
                        <div className="absolute right-4 top-1">
                          <DeleteModal
                            onDelete={async () => {
                              try {
                                await deleteFixtureEvent(event.id);
                                Toast({
                                  message: "Fixture Event Deleted Successfully",
                                  variation: "success",
                                });
                              } catch (error) {
                                Toast({
                                  message: "An Error Occured. Please try again",
                                  variation: "error",
                                });
                                console.log(error);
                              }
                            }}
                            itemName={event.eventType}
                            title="Are you SURE!"
                            trigger={
                              <Button size="icon" variant="destructive">
                                <Trash />
                              </Button>
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2" />
                    <p>No events recorded for this fixture</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Player Stats Tab */}
          <TabsContent value="stats" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Player Statistics
                  </CardTitle>
                  <CardDescription>
                    Individual player performance in this fixture
                  </CardDescription>
                </div>
                <PlayerStatsDialog fixture={fixture} />
              </CardHeader>
              <CardContent>
                {Object.keys(groupStatsByPlayer()).length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Player</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead>Statistics</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(groupStatsByPlayer()).map(
                        ([playerId, playerStats]) => {
                          const player = players.find((p) => p.id === playerId);
                          const team = teams.find(
                            (t) => t.id === player?.teamId
                          );

                          return (
                            <TableRow key={playerId}>
                              <TableCell className="font-medium">
                                {getPlayerName(playerId)}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {team?.name || "Unknown"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-2">
                                  {playerStats.map((stat) => (
                                    <Badge
                                      className="relative pr-8 group cursor-default"
                                      key={`${stat.playerId}-${stat.statKey}`}
                                      variant="secondary">
                                      {stat.statKey}: {stat.statValue}
                                      <div className="absolute right-2 top-0 h-full flex items-center justify-center group-hover:opacity-100 opacity-0 transition-opacity duration-200 cursor-pointer">
                                        <DeleteModal
                                          onDelete={async () => {
                                            try {
                                              await deletePlayerFixtureStats(
                                                stat.id
                                              );
                                              Toast({
                                                message:
                                                  "Player Stat Deleted Successfully",
                                                variation: "success",
                                              });
                                            } catch (error) {
                                              Toast({
                                                message:
                                                  "An Error Occured. Please try again",
                                                variation: "error",
                                              });
                                              console.log(error);
                                            }
                                          }}
                                          itemName={stat.statKey}
                                          title="Are you SURE!"
                                          trigger={<X size={15} />}
                                        />
                                      </div>
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                    <p>No player statistics recorded for this fixture</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Teams Tab */}
          <TabsContent value="teams" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Home Team */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {homeTeam?.name || "Home Team"}
                  </CardTitle>
                  <CardDescription>Home team details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Score:</span>
                      <span className="font-semibold">{scores.homeScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Players:</span>
                      <span>
                        {
                          players.filter((p) => p.teamId === fixture.homeTeamId)
                            .length
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Away Team */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {awayTeam?.name || "Away Team"}
                  </CardTitle>
                  <CardDescription>Away team details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Score:</span>
                      <span className="font-semibold">{scores.awayScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Players:</span>
                      <span>
                        {
                          players.filter((p) => p.teamId === fixture.awayTeamId)
                            .length
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollBox>
  );
}

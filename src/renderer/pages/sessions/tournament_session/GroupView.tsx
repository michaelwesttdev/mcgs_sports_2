"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Target, Trophy } from "lucide-react";
import { mockTournament, type Match } from "./components/mock-data";
import GroupForm from "./components/forms and dialogs/GroupForm";
import { Button } from "@/renderer/components/ui/button";
import { useSessionState } from "./components/SessionStateContext";
import { TournamentGroupCompund } from "@/shared/types/api";
import RoundCreationForm from "./components/forms and dialogs/RoundCreationForm";

interface GroupsTabProps {
  onMatchClick: (match: TournamentGroupCompund["rounds"][0]["matches"][0]) => void;
}

export function GroupsTab({ onMatchClick }: GroupsTabProps) {
  const { groups,matchParticipantsNormal } = useSessionState();

  const getTeamStats = (teamId: string, groupMatches: Match[]) => {
    let played = 0,
      wins = 0,
      draws = 0,
      losses = 0,
      points = 0;

    groupMatches.forEach((match) => {
      if (match.team1Id === teamId || match.team2Id === teamId) {
        played++;
        if (match.score1 !== null && match.score2 !== null) {
          if (match.team1Id === teamId) {
            if (match.score1 > match.score2) {
              wins++;
              points += 3;
            } else if (match.score1 === match.score2) {
              draws++;
              points += 1;
            } else {
              losses++;
            }
          } else {
            if (match.score2 > match.score1) {
              wins++;
              points += 3;
            } else if (match.score1 === match.score2) {
              draws++;
              points += 1;
            } else {
              losses++;
            }
          }
        }
      }
    });

    return { played, wins, draws, losses, points };
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Group Stage
        </CardTitle>
        <div className="flex items-center gap-4">
          <GroupForm />
          <RoundCreationForm/>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="A" className="space-y-4">
          <TabsList>
            {groups.map((group) => (
              <TabsTrigger key={group.name} value={group.name}>
                Group {group.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {groups.map((group) => {
            const groupMatches = mockTournament.matches.filter(
              (m) => m.group === group.name
            );

            return (
              <TabsContent
                key={group.name}
                value={group.name}
                className="space-y-6">
                {/* Standings */}
                <div>
                  {/* <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Group {group.name} Standings
                  </h3> */}
                  {/* <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Position</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead className="text-center">Played</TableHead>
                        <TableHead className="text-center">Wins</TableHead>
                        <TableHead className="text-center">Draws</TableHead>
                        <TableHead className="text-center">Losses</TableHead>
                        <TableHead className="text-center">Points</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.teams
                        .map((teamId) => {
                          const team = mockTournament.teams.find((t) => t.id === teamId)!
                          const stats = getTeamStats(teamId, groupMatches)
                          return { team, stats }
                        })
                        .sort((a, b) => b.stats.points - a.stats.points)
                        .map(({ team, stats }, index) => (
                          <TableRow key={team.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell className="font-medium">{team.name}</TableCell>
                            <TableCell className="text-center">{stats.played}</TableCell>
                            <TableCell className="text-center">{stats.wins}</TableCell>
                            <TableCell className="text-center">{stats.draws}</TableCell>
                            <TableCell className="text-center">{stats.losses}</TableCell>
                            <TableCell className="text-center font-semibold">{stats.points}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table> */}
                </div>

                {/* Group Matches */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Group {group.name} Matches
                  </h3>
                  {group.rounds.length <= 0 ? (
                    <div>No Rounds created yet</div>
                  ) : (
                    group.rounds.map((round) => {
                      return (
                        <div>
                          <h1 className="text-md font-semibold mb-3">Round {round.name}</h1>
                          <div className="grid gap-3 md:grid-cols-2">
                            {round.matches.map((match) => {
                              const team1 = matchParticipantsNormal.filter(mp=>mp.teamId===match.teams[0].id&&mp.matchId===match.id).map(mp=>{
                                const team = match.teams[0]
                                return {
                                  ...mp,team
                                }
                              })[0]
                              const team2 = match.isBye?undefined: matchParticipantsNormal.filter(mp=>mp.teamId===match.teams[0].id&&mp.matchId===match.id).map(mp=>{
                                const team = match.teams[0]
                                return {
                                  ...mp,team
                                }
                              })[0]

                              return (
                                <Card
                                  key={match.id}
                                  className="cursor-pointer hover:shadow-md transition-shadow"
                                  onClick={() => onMatchClick(match)}>
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div className="space-y-1">
                                        <div className="font-medium">
                                          {team1.team.name}
                                        </div>
                                        <div className="font-medium">
                                          {team2?.team.name??"N/A"}
                                        </div>
                                      </div>
                                      <div className="text-right space-y-1">
                                        {team1.score !== null &&
                                        (match.isBye?true:team2?.score !== null) ? (
                                          <>
                                            <div className="text-lg font-bold">
                                              {team1.score}
                                            </div>
                                            <div className="text-lg font-bold">
                                              {match.isBye?"-":team2.score}
                                            </div>
                                          </>
                                        ) : (
                                          <Badge variant="outline">
                                            Scheduled
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    <div className="mt-2 text-sm text-muted-foreground">
                                      Match {match.matchNumber}
                                    </div>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
}

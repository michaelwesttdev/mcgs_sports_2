"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Badge } from "~/components/ui/badge"
import { Trophy, Users } from "lucide-react"
import { mockTournament, type Match } from "./components/mock-data"

interface MatchDetailDialogProps {
  match: Match | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MatchDetailDialog({ match, open, onOpenChange }: MatchDetailDialogProps) {
  if (!match) return null

  const team1 = mockTournament.teams.find((t) => t.id === match.team1Id)
  const team2 = mockTournament.teams.find((t) => t.id === match.team2Id)

  const getMatchResult = () => {
    if (match.isBye) return "BYE"
    if (match.score1 === null || match.score2 === null) return "Scheduled"
    if (match.score1 === match.score2) return "Draw"
    return match.score1 > match.score2 ? `${team1?.name} wins` : `${team2?.name} wins`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Match {match.matchNumber} Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Match Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Match Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-sm text-muted-foreground">Round</div>
                  <div className="font-medium">
                    {match.round}
                    {match.group && ` - Group ${match.group}`}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Result</div>
                  <Badge variant={match.score1 !== null ? "default" : "outline"}>{getMatchResult()}</Badge>
                </div>
              </div>

              {!match.isBye && (
                <div className="mt-6">
                  <div className="flex items-center justify-center gap-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{team1?.name}</div>
                      <div className="text-4xl font-bold mt-2">{match.score1 ?? "-"}</div>
                    </div>
                    <div className="text-muted-foreground">vs</div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{team2?.name}</div>
                      <div className="text-4xl font-bold mt-2">{match.score2 ?? "-"}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Statistics */}
          {!match.isBye && team1 && team2 && (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Team 1 Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-4 w-4" />
                    {team1.name} Players
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Player</TableHead>
                        <TableHead className="text-right">Goals</TableHead>
                        <TableHead className="text-right">Assists</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {team1.players.map((player) => (
                        <TableRow key={player.id}>
                          <TableCell className="font-medium">{player.name}</TableCell>
                          <TableCell className="text-right">{player.stats.goals}</TableCell>
                          <TableCell className="text-right">{player.stats.assists}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Team 2 Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-4 w-4" />
                    {team2.name} Players
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Player</TableHead>
                        <TableHead className="text-right">Goals</TableHead>
                        <TableHead className="text-right">Assists</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {team2.players.map((player) => (
                        <TableRow key={player.id}>
                          <TableCell className="font-medium">{player.name}</TableCell>
                          <TableCell className="text-right">{player.stats.goals}</TableCell>
                          <TableCell className="text-right">{player.stats.assists}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

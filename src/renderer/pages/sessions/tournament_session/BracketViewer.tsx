"use client"

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Grid3X3 } from "lucide-react"
import { mockTournament, type Match } from "./components/mock-data"
import { useTournament } from "./hooks/useTournament"

interface BracketTabProps {
  onMatchClick: (match: Match) => void
}

/* export function BracketTab({ onMatchClick }: BracketTabProps) {
  const { matches, teams,groups } = useTournament()
  const knockoutMatches = matches.filter((m) => !m.roundId)
  const rounds = ["Quarterfinals", "Semifinals", "Final"]

  const getMatchesForRound = (round: string) => {
    return knockoutMatches.filter((m) => m.roundId === round)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Grid3X3 className="h-5 w-5" />
          Knockout Bracket
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          {rounds.map((round) => {
            const roundMatches = getMatchesForRound(round)

            return (
              <div key={round} className="space-y-4">
                <h3 className="text-lg font-semibold text-center">{round}</h3>
                <div className="space-y-3"> 
                  {roundMatches.map((match) => {
                    const team1 = mockTournament.teams.find((t) => t.id === match.team1Id)
                    const team2 = mockTournament.teams.find((t) => t.id === match.team2Id)

                    return (
                      <Card
                        key={match.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => onMatchClick(match)}
                      >
                        <CardContent className="p-4">
                          {match.isBye ? (
                            <div className="text-center">
                              <Badge variant="secondary">BYE</Badge>
                              <div className="mt-2 font-medium">{team1?.name || team2?.name || "TBD"}</div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-medium truncate">{team1?.name || "TBD"}</span>
                                <span className="text-lg font-bold ml-2">{match.score1 ?? "-"}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-medium truncate">{team2?.name || "TBD"}</span>
                                <span className="text-lg font-bold ml-2">{match.score2 ?? "-"}</span>
                              </div>
                              {match.winnerId && (
                                <div className="text-center pt-2 border-t">
                                  <Badge variant="default">
                                    Winner: {teams.find((t) => t.id === match.winnerId)?.name}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          )}
                          <div className="mt-2 text-xs text-muted-foreground text-center">
                            Match {match.matchNumber}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
} */

export function BracketTab ({ onMatchClick }: BracketTabProps){
  return (
    <></>
  )
}
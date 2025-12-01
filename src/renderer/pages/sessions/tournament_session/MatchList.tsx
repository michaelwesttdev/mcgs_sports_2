"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { mockTournament, type Match } from "./components/mock-data"

interface MatchesTabProps {
  onMatchClick: (match: Match) => void
}

export function MatchesTab({ onMatchClick }: MatchesTabProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const matchesPerPage = 5
  const totalMatches = mockTournament.matches.length
  const totalPages = Math.ceil(totalMatches / matchesPerPage)

  const startIndex = (currentPage - 1) * matchesPerPage
  const endIndex = startIndex + matchesPerPage
  const currentMatches = mockTournament.matches.slice(startIndex, endIndex)

  const getMatchStatus = (match: Match) => {
    if (match.score1 !== null && match.score2 !== null) {
      return "Completed"
    }
    return "Scheduled"
  }

  const getWinner = (match: Match) => {
    if (match.winnerId) {
      return mockTournament.teams.find((t) => t.id === match.winnerId)?.name || "Unknown"
    }
    if (match.score1 !== null && match.score2 !== null) {
      if (match.score1 === match.score2) return "Draw"
      return match.score1 > match.score2
        ? mockTournament.teams.find((t) => t.id === match.team1Id)?.name
        : mockTournament.teams.find((t) => t.id === match.team2Id)?.name
    }
    return "-"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          All Matches
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Match #</TableHead>
              <TableHead>Round</TableHead>
              <TableHead>Teams</TableHead>
              <TableHead className="text-center">Score</TableHead>
              <TableHead>Winner</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentMatches.map((match) => {
              const team1 = mockTournament.teams.find((t) => t.id === match.team1Id)
              const team2 = mockTournament.teams.find((t) => t.id === match.team2Id)
              const status = getMatchStatus(match)
              const winner = getWinner(match)

              return (
                <TableRow
                  key={match.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onMatchClick(match)}
                >
                  <TableCell className="font-medium">{match.matchNumber}</TableCell>
                  <TableCell>
                    <div>
                      {match.round}
                      {match.group && <div className="text-xs text-muted-foreground">Group {match.group}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>{team1?.name || "TBD"}</div>
                      <div className="text-muted-foreground">vs</div>
                      <div>{team2?.name || "TBD"}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {match.isBye ? (
                      <Badge variant="secondary">BYE</Badge>
                    ) : match.score1 !== null && match.score2 !== null ? (
                      <div className="font-mono text-lg">
                        {match.score1} - {match.score2}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{winner}</TableCell>
                  <TableCell>
                    <Badge variant={status === "Completed" ? "default" : "outline"}>{status}</Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, totalMatches)} of {totalMatches} matches
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

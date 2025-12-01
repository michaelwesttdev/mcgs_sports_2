"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible"
import { Plus, ChevronDown, ChevronRight, Users, UserPlus } from "lucide-react"
import { mockTournament } from "./components/mock-data"
import { useTournament } from "./contexts/TournamentContext"
import { Toast } from "@/renderer/components/Toast"
import { useSessionState } from "./components/SessionStateContext"

export function TeamsTab() {
  const { teams, teamCreate, loading } = useSessionState();
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set())
  const [newTeamName, setNewTeamName] = useState("")
  const [newPlayers, setNewPlayers] = useState<string[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  const toggleTeam = (teamId: string) => {
    const newExpanded = new Set(expandedTeams)
    if (newExpanded.has(teamId)) {
      newExpanded.delete(teamId)
    } else {
      newExpanded.add(teamId)
    }
    setExpandedTeams(newExpanded)
  }

  const addPlayer = () => {
    setNewPlayers([...newPlayers, ""])
  }

  const updatePlayer = (index: number, name: string) => {
    const updated = [...newPlayers]
    updated[index] = name
    setNewPlayers(updated)
  }

  const removePlayer = (index: number) => {
    if (newPlayers.length > 0) {
      setNewPlayers(newPlayers.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async() => {
    console.log("Adding team:", { name: newTeamName, players: newPlayers.filter((p) => p.trim()) })
    try {
      await teamCreate({name:newTeamName});
      if(newPlayers.length>0){
        //await addPlayers(players)
      }
      setNewTeamName("")
    setNewPlayers([])
    setDialogOpen(false)
    } catch (error) {
      console.log(error);
      Toast({message:"Failed to add team",variation:"error"})
    }
    
  }

  return (
    <Card className=" overflow-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Teams & Players
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Team
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Team</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="team-name">Team Name</Label>
                  <Input
                    id="team-name"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="Enter team name"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Players</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addPlayer}
                      className="gap-1 bg-transparent"
                    >
                      <UserPlus className="h-3 w-3" />
                      Add Player
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {newPlayers.map((player, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={player}
                          onChange={(e) => updatePlayer(index, e.target.value)}
                          placeholder={`Player ${index + 1} name`}
                        />
                        {newPlayers.length > 0 && (
                          <Button type="button" variant="outline" size="sm" onClick={() => removePlayer(index)}>
                            ×
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <Button onClick={handleSubmit} className="w-full">
                  Add Team
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {teams.map((team) => (
            <Collapsible key={team.id}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto"
                  onClick={() => toggleTeam(team.id)}
                >
                  <div className="flex items-center gap-3">
                    {expandedTeams.has(team.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="font-medium">{team.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{team.players.length} players</span>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="ml-7 mt-2 mb-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Player Name</TableHead>
                        <TableHead className="text-right">Goals</TableHead>
                        <TableHead className="text-right">Assists</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {team.players.map((player) => (
                        <TableRow key={player.id}>
                          <TableCell className="font-medium">{player.name}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Settings, Trophy, Users, Grid3X3, Calendar, Target } from "lucide-react"
import { mockTournament, type Match } from "./components/mock-data"
import { TeamsTab } from "./TeamManager"
import { GroupsTab } from "./GroupView"
import { BracketTab } from "./BracketViewer"
import { MatchesTab } from "./MatchList"
import { MatchDetailDialog } from "./MatchDetailDialog"
import { SettingsPanel } from "./components/Settings"
import { ScrollArea } from "@/renderer/components/ui/scroll-area"
import { useSessionState } from "./components/SessionStateContext"
import { useSessionSettings } from "./components/hooks/use_settings"

export default function TournamentDashboard() {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [activeView, setActiveView] = useState<'teams' | 'groups' | 'bracket' | 'matches'>('teams')
  const {session,teams} = useSessionState();
  const {settings} = useSessionSettings();

  return (
    <div className="h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl h-full flex flex-col gap-2">
        {/* Tournament Header */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                  {session?.title}
                </CardTitle>
                <CardDescription className="mt-2">
                  {settings?.format.name} • {settings?.ageGroup ??"Open"} • {settings?.gender}
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Users className="h-3 w-3" />
                  {teams.length} Teams
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  {mockTournament.matches.length} Matches
                </Badge>
                <Button variant="outline" size="sm" onClick={() => setShowSettings(true)} className="gap-1">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
          <Button 
            variant={activeView === 'teams' ? 'default' : 'outline'} 
            className="w-full gap-2"
            onClick={() => setActiveView('teams')}
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Teams</span>
          </Button>
          <Button 
            variant={activeView === 'groups' ? 'default' : 'outline'} 
            className="w-full gap-2"
            onClick={() => setActiveView('groups')}
          >
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Groups</span>
          </Button>
          <Button 
            variant={activeView === 'bracket' ? 'default' : 'outline'} 
            className="w-full gap-2"
            onClick={() => setActiveView('bracket')}
          >
            <Grid3X3 className="h-4 w-4" />
            <span className="hidden sm:inline">Bracket</span>
          </Button>
          <Button 
            variant={activeView === 'matches' ? 'default' : 'outline'} 
            className="w-full gap-2"
            onClick={() => setActiveView('matches')}
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Matches</span>
          </Button>
        </div>

        {/* Content Area */}
        <ScrollArea className="flex-1 pb-8">
          {activeView === 'teams' && <TeamsTab />}
          {activeView === 'groups' && <GroupsTab onMatchClick={setSelectedMatch as any} />}
          {activeView === 'bracket' && <BracketTab onMatchClick={setSelectedMatch} />}
          {activeView === 'matches' && <MatchesTab onMatchClick={setSelectedMatch} />}
        </ScrollArea>

        {/* Match Detail Dialog */} 
        <MatchDetailDialog
          match={selectedMatch}
          open={!!selectedMatch}
          onOpenChange={(open) => !open && setSelectedMatch(null)}
        />

        {/* Settings Panel */}
        <SettingsPanel open={showSettings} onOpenChange={setShowSettings} />
      </div>
    </div>
  )
}

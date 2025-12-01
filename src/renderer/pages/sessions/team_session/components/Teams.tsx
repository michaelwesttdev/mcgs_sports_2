
import ScrollBox from "@/renderer/components/ScrollBox";
import TeamFormDialog from "./forms and dialogs/TeamFormDialog";
import { useSessionState } from "./SessionStateContext";
import TitleBar from "./TitleBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/renderer/components/ui/card";
import { Trophy, Users } from "lucide-react";
import { Badge } from "@/renderer/components/ui/badge";

const getPositionColor = (position: number) => {
  switch (position) {
    case 1:
      return "bg-yellow-500"
    case 2:
      return "bg-gray-400"
    case 3:
      return "bg-amber-600"
    default:
      return "bg-slate-500"
  }
}


export default function Teams() {
  const { teams,players } = useSessionState();

  return (
    <div className="flex-1 h-full flex flex-col">
      <TitleBar
        title={`Teams (${teams.length})`}
        actions={
          <>
            <TeamFormDialog />
          </>
        }
      />
      <ScrollBox className="mt-4 flex-1 overflow-y-auto pb-20">
        {teams.length <= 0 ? (
          <div className={"flex items-center flex-col gap-4"}>
            No Teams found. Create one below.
            <TeamFormDialog purpose={"create"} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teams.map((team,index) => (
          <Card key={team.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{team.name}</CardTitle>
                <Badge className={`${getPositionColor(index+1)} text-white`}>#{index+1}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{players.filter(p=>p.teamId===team.id).length} players</span>
                </div>

                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{0} points</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}</div>
        )}
      </ScrollBox>
    </div>
  );
}

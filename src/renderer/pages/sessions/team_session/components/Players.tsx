import ScrollBox from "@/renderer/components/ScrollBox";
import PlayerFormDialog, {
  ZodPlayerType,
} from "./forms and dialogs/PlayerFormDialog";
import { useSessionState } from "./SessionStateContext";
import TitleBar from "./TitleBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/renderer/components/ui/table";
import {
  Building,
  MoreHorizontal,
  MoreVertical,
  Send,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { TSPlayer } from "@/db/sqlite/t_sports/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/renderer/components/ui/dropdown-menu";
import { DeleteModal } from "@/renderer/components/deleteModal";
import { Toast } from "@/renderer/components/Toast";
import { Button } from "@/renderer/components/ui/button";
import { handleSearch } from "@/shared/fuse";
import { StepConfig } from "../../../../../shared/types/mutli_step_dialog_types";
import { useStudents } from "@/renderer/hooks/use_students";
import { DynamicMultiStepDialog } from "../../../../components/dynamic_multistep_dialog";
import { boolean } from "drizzle-orm/mysql-core";

export default function Players() {
  const { players, teams, sessionId } = useSessionState();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const searched = handleSearch(
    players,
    {
      keys: ["name"],
    },
    searchQuery
  );

  return (
    <div className="flex-1 h-full flex flex-col">
      <TitleBar
        title={`Players (${
          searchQuery
            ? `${searched.length}/${players.length} players found.`
            : players.length
        })`}
        search
        searchValue={searchQuery}
        setSearchValue={setSearchQuery}
        actions={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button>Add Player/s</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="grid gap-2">
                <DropdownMenuItem asChild>
                  <PlayerFormDialog />
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <PlayerImport />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />
      <ScrollBox className="grid grid-cols-1 gap-4 mt-4 flex-1 overflow-y-auto pb-20">
        {players.length <= 0 ? (
          <div className={"flex items-center flex-col gap-4"}>
            No Players found. Create one below.
            <PlayerFormDialog purpose={"create"} />
          </div>
        ) : searchQuery && searched.length <= 0 ? (
          <div className={"flex items-center flex-col gap-4"}>
            No Players match your search. Create the missing player below or
            update search.
            <PlayerFormDialog purpose={"create"} />
          </div>
        ) : searched.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searched.map(({ item: player }) => (
                <TableRow
                  key={player.id}
                  onClick={() =>
                    navigate(
                      `/sessions/team/${sessionId}/player/${player.id}?searchP=${searchQuery}`
                    )
                  }>
                  <TableCell>
                    {player?.name
                      .toLowerCase()
                      .split(" ")
                      .map(
                        (n) => `${n.split("")[0]?.toUpperCase()}${n.slice(1)}`
                      )
                      .join(" ")}
                  </TableCell>
                  <TableCell>
                    {teams.find((t) => t.id === player.teamId)?.name}
                  </TableCell>
                  <TableCell
                    onClick={(e) => {
                      e.stopPropagation();
                    }}>
                    <PlayerActions player={player} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map((player) => (
                <TableRow
                  key={player.id}
                  onClick={() =>
                    navigate(
                      `/sessions/team/${sessionId}/player/${player.id}?searchP=${searchQuery}`
                    )
                  }>
                  <TableCell>
                    {player?.name
                      .toLowerCase()
                      .split(" ")
                      .map(
                        (n) =>n? `${n.split("")[0]?.toUpperCase()}${n.slice(1)}`:""
                      )
                      .join(" ")}
                  </TableCell>
                  <TableCell>
                    {teams.find((t) => t.id === player.teamId)?.name}
                  </TableCell>
                  <TableCell
                    onClick={(e) => {
                      e.stopPropagation();
                    }}>
                    <PlayerActions player={player} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </ScrollBox>
    </div>
  );
}

function PlayerActions({ player }: { player: TSPlayer }) {
  const { deletePlayer } = useSessionState();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="grid gap-3">
        <DropdownMenuItem asChild>
          <PlayerFormDialog
            player={player}
            purpose="edit"
            trigger={<Button>Edit Player</Button>}
          />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <DeleteModal
            onDelete={async () => {
              try {
                await deletePlayer(player.id);
                Toast({
                  message: "Player Deleted Successfully",
                  variation: "success",
                });
              } catch (error) {
                Toast({
                  message: "An Error Occured.please try again",
                  variation: "error",
                });
                console.log(error);
              }
            }}
            itemName={player.name}
            title="Are you SURE!"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function PlayerImport() {
  const { students } = useStudents();
  const { teams, createPlayer, players } = useSessionState();
  const studentImportSteps: StepConfig[] = [
    {
      id: "students",
      title: "Select Students",
      description: "Choose students to import",
      icon: <Users className="h-4 w-4" />,
      type: "multi-select",
      items: students.map((st) => ({
        id: st.id,
        label: `${st.firstName} ${st.lastName}`,
        metadata: st,
      })),
      validation: (selections) => selections.students?.length > 0,
    },
    {
      id: "team",
      title: "Select Team",
      description: "Choose which team they belong to",
      icon: <Building className="h-4 w-4" />,
      type: "single-select",
      items: teams.map((t) => ({
        id: t.id,
        label: t.name,
      })),
      validation: (selections) => !!selections.team,
    },
    {
      id: "review",
      title: "Review & Submit",
      description: "Confirm your team assignments",
      icon: <Send className="h-4 w-4" />,
      type: "review",
    },
  ];
  const handleStudentImportSubmit = async (selections: Record<string, any>) => {
    try {
      const {
        students: sts,
        team: teamId,
      }: { students: string[]; team: string } = selections as any;
      const playerStudents: { id: string; name: string; teamId: string }[] =
        sts.map((st) => {
          const student = students.find((s) => s.id === st);
          return {
            id: st,
            name: `${student.firstName.trim()} ${student.lastName.trim()}`,
            teamId,
          };
        });
      const filtered = playerStudents.filter(
        (p) => !players.some((player) => player.id === p.id)
      );
      await Promise.all(
        filtered.map(async (player) => {
          await createPlayer(player);
        })
      );
      Toast({ message: "Students Imported as Players", variation: "success" });
    } catch (error) {
      console.log(error);
      Toast({
        message: "An error occured. Please Try Again",
        variation: "error",
      });
    }
  };
  return (
    <DynamicMultiStepDialog
      title="Import Students from Main Store"
      triggerLabel="Import Students"
      triggerIcon={<Users className="mr-2 h-4 w-4" />}
      steps={studentImportSteps}
      onSubmit={handleStudentImportSubmit}
    />
  );
}

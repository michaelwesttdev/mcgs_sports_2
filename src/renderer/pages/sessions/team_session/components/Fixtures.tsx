import { Search } from "lucide-react";
import { useSessionState } from "./SessionStateContext";
import { Input } from "@/renderer/components/ui/input";
import { useState } from "react";
import ScrollBox from "@/renderer/components/ScrollBox";
import TitleBar from "./TitleBar";
import FixtureFormDialog from "./forms and dialogs/FixtureFormDialog";
import { Badge } from "@/renderer/components/ui/badge";
import { DeleteModal } from "@/renderer/components/deleteModal";
import { TSFixture } from "@/db/sqlite/t_sports/schema";
import { Toast } from "@/renderer/components/Toast";
import { Button } from "@/renderer/components/ui/button";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/renderer/components/ui/context-menu";
import { FixtureResultDialog } from "./FixtureResultDialog";
import { useNavigate } from "react-router";

export default function Fixtures() {
  const { fixtures, teams, deleteFixture,sessionId } = useSessionState();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  return (
    <div className="flex-1 h-full flex flex-col">
      <TitleBar
        title={`Fixtures (${fixtures.length})`}
        search
        searchValue={searchQuery}
        setSearchValue={setSearchQuery}
        actions={
          <>
            <FixtureFormDialog />
          </>
        }
      />
      <ScrollBox className="grid grid-cols-1 gap-4 mt-4 flex-1 overflow-y-auto pb-20 px-5">
        {fixtures.length <= 0 ? (
          <div className={"flex items-center flex-col gap-4"}>
            No Fictures found. Create one below.
            <FixtureFormDialog purpose={"create"} />
          </div>
        ) : (
          fixtures.map((fixture) => (
            <ContextMenu key={fixture.id}>
              <ContextMenuTrigger>
                <div onClick={()=>navigate(`/sessions/team/${sessionId}/fixture/${fixture.id}?searchP=${searchQuery}`)} className="p-4 border rounded-lg mt-4 group hover:bg-slate-400 transition-all relative">
                  <h3 className="font-bold">{fixture.name}</h3>
                  <Badge>{fixture.round}</Badge>
                  <p>
                    {teams.find((t) => t.id === fixture.homeTeamId)?.name} vs{" "}
                    {teams.find((t) => t.id === fixture.awayTeamId)?.name}
                  </p>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-52 grid gap-2">
                <ContextMenuItem asChild>
                  <DeleteModal
                    onDelete={async () => {
                      try {
                        await deleteFixture(fixture.id);
                        Toast({
                          message: "Fixture Deleted Successfully",
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
                    itemName={fixture.name}
                    title="Are you SURE!"
                  />
                </ContextMenuItem>
                <ContextMenuItem asChild>
                  <FixtureFormDialog
                    trigger={<Button>Edit Fixture</Button>}
                    fixture={fixture}
                    purpose="update"
                  />
                </ContextMenuItem>
                <ContextMenuItem asChild>
                  <FixtureResultDialog
                    trigger={<Button>Enter Results</Button>}
                    fixture={fixture}
                  />
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))
        )}
      </ScrollBox>
    </div>
  );
}

function FixtureActions({ fixture }: { fixture: TSFixture }) {
  const { deleteFixture } = useSessionState();
  return (
    <div className="grid gap-2 group-hover:opacity-100 opacity-0 transition-opacity duration-500 absolute right-5 top-2">
      <DeleteModal
        onDelete={async () => {
          try {
            await deleteFixture(fixture.id);
            Toast({
              message: "Fixture Deleted Successfully",
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
        itemName={fixture.name}
        title="Are you SURE!"
      />
      <FixtureFormDialog
        trigger={<Button>Edit Fixture</Button>}
        fixture={fixture}
        purpose="update"
      />
    </div>
  );
}

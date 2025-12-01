import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useState, useRef, useEffect } from "react";
import { PSHouse, PSParticipant } from "@/db/sqlite/p_sports/schema";
import ParticipantDialogForm from "~/components/participant-dialog-form";
import ParticipantCard from "./ParticipantCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/renderer/components/ui/dropdown-menu";
import { Button } from "@/renderer/components/ui/button";
import ParticipantsCsvImport from "./participantsCsvImport";
import { useSessionState } from "./SessionStateContext";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Search } from "lucide-react";
import ScrollBox from "@/renderer/components/ScrollBox";
import fuse from "fuse.js";
import { handleSearch } from "@/shared/fuse";
import { useSearchParams } from "react-router";

export default function Participants() {
  const {
    houses,
    participants,
    createHouse,
    deleteParticipant,
    createParticipant,
    updateParticipant,
    fetchSessionParticipants,
    fetchSessionHouses,
  } = useSessionState();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("searchP");
  const searched = handleSearch(
    participants,
    {
      // isCaseSensitive: false,
      // includeScore: false,
      // ignoreDiacritics: false,
      shouldSort: true,
      // includeMatches: false,
      // findAllMatches: false,
      minMatchCharLength: 1,
      // location: 0,
      threshold: 0.3,
      // distance: 100,
      // useExtendedSearch: false,
      // ignoreLocation: false,
      // ignoreFieldNorm: false,
      // fieldNormWeight: 1,
      keys: ["firstName", "lastName"],
    },
    searchQuery
  );
  useEffect(() => {
    if (search) {
      setSearchQuery(search);
    }
  }, [search]);
  console.log(searchParams.toString());
  return (
    <div className="flex-1 h-full flex flex-col">
      <div className="shrink-0 px-4 py-2 flex justify-between items-center border-b">
        <div className="flex-1 flex gap-8 items-center p-3">
          <h1 className="text-lg font-bold">
            Participants (
            {searchQuery
              ? `${searched.length}/${participants.length}`
              : participants.length}
            )
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Add</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="grid gap-3">
              <DropdownMenuItem asChild>
                <ParticipantDialogForm
                  createHouse={createHouse}
                  houses={houses}
                  fetchHouses={fetchSessionHouses}
                  onCreate={createParticipant}
                />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <ParticipantsCsvImport
                  houses={houses}
                  createHouse={createHouse}
                  fetchHouses={fetchSessionHouses}
                  participants={participants}
                  createNewParticipant={createParticipant}
                  fetchParticipants={fetchSessionParticipants}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search participants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <ScrollBox className="flex-1 overflow-y-auto pb-20 relative">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead className="hidden md:table-cell">Age</TableHead>
              <TableHead className="hidden md:table-cell">House</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground">
                  <div className={"flex items-center flex-col gap-4"}>
                    No Participants found. Create one below.
                    <ParticipantDialogForm
                      createHouse={createHouse}
                      houses={houses}
                      fetchHouses={fetchSessionHouses}
                      onCreate={createParticipant}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ) : searched.length === 0 && searchQuery ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground">
                  <div className={"flex items-center flex-col gap-4"}>
                    No Participants Match Your Search. Create one below.
                    <ParticipantDialogForm
                      createHouse={createHouse}
                      houses={houses}
                      fetchHouses={fetchSessionHouses}
                      onCreate={createParticipant}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ) : searchQuery ? (
              searched
                .sort((AResult, bResult) => {
                  const a = AResult.item;
                  const b = bResult.item;
                  return `${a.firstName} ${a.lastName}` >
                    `${b.firstName} ${b.lastName}`
                    ? 1
                    : -1;
                })
                .map(({ item: participant }) => {
                  return (
                    <ParticipantCard
                      key={participant.id}
                      houses={houses}
                      createHouse={createHouse}
                      fetchHouses={fetchSessionHouses}
                      participant={participant}
                      onUpdate={updateParticipant}
                      house={
                        houses.find((h) => h.id === participant.houseId) ?? null
                      }
                      onDelete={deleteParticipant}
                      searchString={searchQuery}
                    />
                  );
                })
            ) : (
              participants
                .sort((a, b) => {
                  return `${a.firstName} ${a.lastName}` >
                    `${b.firstName} ${b.lastName}`
                    ? 1
                    : -1;
                })
                .map((participant) => {
                  return (
                    <ParticipantCard
                      key={participant.id}
                      houses={houses}
                      createHouse={createHouse}
                      fetchHouses={fetchSessionHouses}
                      participant={participant}
                      onUpdate={updateParticipant}
                      house={
                        houses.find((h) => h.id === participant.houseId) ?? null
                      }
                      onDelete={deleteParticipant}
                    />
                  );
                })
            )}
          </TableBody>
        </Table>
      </ScrollBox>
    </div>
  );
}

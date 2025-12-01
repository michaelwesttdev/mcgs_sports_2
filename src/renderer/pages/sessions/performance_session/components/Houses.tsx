import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { useEffect, useState } from "react";
import { PSEvent, PSEventResult, PSHouse, PSParticipant } from "@/db/sqlite/p_sports/schema";
import HouseDialogForm from "~/components/house-dialog-form";
import { useSessionState } from "./SessionStateContext";
import { Search } from "lucide-react";
import ScrollBox from "@/renderer/components/ScrollBox";
import HouseCard from "./HouseCard";

interface Props {
    createHouse: (event: Omit<PSHouse, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    fetchSessionHouses: () => Promise<void>;
    participants: PSParticipant[];
    houses: PSHouse[];
    onDelete: (id: string) => Promise<void>;
    onUpdate: (id: string, data: Partial<PSEvent>) => Promise<void>;
    results: PSEventResult[];
}
function HousesTab() {
    const {createHouse,eventResults,updateHouse,houses,participants,deleteHouse,fetchSessionHouses} = useSessionState();
    const [query, setQuery] = useState("");
    const [points, setPoints] = useState<Map<string, number>>(new Map());
    const [positions, setPositions] = useState<Map<string, number>>(new Map());
    const [disqualifiedTotal, setDisqualifiedTotal] = useState<Map<string, number>>(new Map());

    useEffect(() => {
        const newPoints = new Map<string, number>();
        const newDisqualifiedTotal = new Map<string, number>();

        houses.forEach(house => {
            const resultsForHouse = eventResults.filter(r => {
                const isTeam = r.participantType === "house";
                if (isTeam) {
                    return r.participantId === house.id;
                } else {
                    const participant = participants.find(p => p.id === r.participantId);
                    return participant?.houseId === house.id;
                }
            });

            const totalPoints = resultsForHouse.reduce((sum, result) => sum + result.points, 0);
            const disqualified = resultsForHouse.reduce((sum, result) => sum + (result.position === 0 ? 1 : 0), 0);
            newDisqualifiedTotal.set(house.id, disqualified);
            newPoints.set(house.id, totalPoints);
        });

        setPoints(newPoints);
        setDisqualifiedTotal(newDisqualifiedTotal);

        // Now compute positions based on newPoints
        const sortedHousePoints = Array.from(newPoints.entries()).sort((a, b) => b[1] - a[1]);
        const newPositions = new Map<string, number>();
        let currentPosition = 1;

        for (let i = 0; i < sortedHousePoints.length; i++) {
            const [houseId, pointValue] = sortedHousePoints[i];

            if (i > 0 && sortedHousePoints[i - 1][1] === pointValue) {
                const prevHouseId = sortedHousePoints[i - 1][0];
                newPositions.set(houseId, newPositions.get(prevHouseId)!);
            } else {
                newPositions.set(houseId, currentPosition);
            }

            currentPosition++;
        }

        setPositions(newPositions);
    }, [eventResults, houses, participants]);

    return <Card className='w-full'>
        <CardHeader>
            <div className={"flex items-center gap-4 justify-end"}>
                <HouseDialogForm houses={houses} fetchHouses={fetchSessionHouses} onCreate={createHouse} purpose={"create"} />
            </div>

            <CardTitle className='flex items-center justify-between'>
                <div className='flex flex-1 items-center gap-2'>
                    <span>Houses</span>
                    <div className='flex-1 flex gap-8 items-center justify-between p-3'>
                        <div className='flex-1'>
                            <Input
                                placeholder='Search by house name or abbriviation'
                                className='max-w-60'
                                onChange={(e) => setQuery(e.target.value)}
                                value={query}
                            />
                        </div>
                        <div className='flex items-center gap-2 mr-8'>

                            <p className='font-semibold tracking-wider'>
                                Leading House: {(() => {
                                    const firstPlaceEntry = [...positions.entries()].find(([, pos]) => pos === 1);
                                    const houseId = firstPlaceEntry?.[0];
                                    const house = houses.find(h => h.id === houseId);

                                    if (!house) {
                                        return <span className="text-xs text-muted-foreground">"Calculating..."</span>;
                                    }

                                    return (
                                        <span style={{ color: house?.color ?? "black" }}>
                                            {house.name}
                                        </span>
                                    );
                                })()}
                            </p>


                            {/* <p className='font-semibold tracking-wider'>
                                Leading House: {(() => {
                                const firstPlaceEntry = [...positions.entries()].find(([, pos]) => pos === 1);
                                const houseId = firstPlaceEntry?.[0];
                                const houseName = houses.find(h => h.id === houseId)?.name;
                                //return houseName ?? <span className={"text-xs text-muted-foreground"}>"Calculating..."</span>;
                                return houseName ?? <span className={"text-xs text-muted-foreground"}>"Calculating..."</span>;
                            })()}
                            </p> */}
                        </div>
                    </div>
                </div>

                <Badge variant='outline'>{houses.length} House{houses.length > 1 && "'s"}</Badge>
            </CardTitle>
        </CardHeader>
        <CardContent className={"flex "}>
            <ScrollArea className={"w-full flex-1 min-w-[500px]"}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='w-20'>Position</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Abbreviation</TableHead>
                            <TableHead className='hidden md:table-cell'>
                                Total Participants
                            </TableHead><TableHead className='hidden md:table-cell'>
                                Total Disqualified
                            </TableHead><TableHead className='hidden md:table-cell'>
                                Points
                            </TableHead>
                            <TableHead className='w-24 text-right'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {houses.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className='text-center py-8 text-muted-foreground'>
                                    <div className={"flex items-center flex-col gap-4"}>
                                        No Houses found. Create one below.
                                        <HouseDialogForm houses={houses} fetchHouses={fetchSessionHouses} onCreate={createHouse} purpose={"create"} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) :
                            houses.filter((h) => h.name.toLowerCase().includes(query.toLowerCase()) || h.abbreviation.toLowerCase().includes(query.toLowerCase())).length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className='text-center py-8 text-muted-foreground'>
                                        <div className={"flex items-center flex-col gap-4"}>
                                            No Houses match your search. Create one below.
                                            <HouseDialogForm houses={houses} fetchHouses={fetchSessionHouses} onCreate={createHouse} purpose={"create"} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                houses.filter((h) => h.name.toLowerCase().includes(query.toLowerCase()) || h.abbreviation.toLowerCase().includes(query.toLowerCase())).sort((a, b) => {
                                    const positionA = positions.get(a.id) ?? Infinity;
                                    const positionB = positions.get(b.id) ?? Infinity;
                                    return positionA - positionB;
                                }).map((house) => (
                                    <HouseCard disqualified={disqualifiedTotal.get(house.id) ?? 0} position={positions.get(house.id)} points={points.get(house.id)} key={house.id} house={house} participants={participants.filter(p => p.houseId === house.id).length} onUpdate={updateHouse} onDelete={deleteHouse} houses={houses} fetchHouses={fetchSessionHouses} />
                                ))
                            )}
                    </TableBody>
                </Table>
                <ScrollBar orientation={"horizontal"} />
            </ScrollArea>
        </CardContent>
    </Card>
}

export default function Houses(){
    const {createHouse,eventResults,updateHouse,houses,participants,deleteHouse,fetchSessionHouses} = useSessionState();
    const [searchQuery, setSearchQuery] = useState("");
    const [points, setPoints] = useState<Map<string, number>>(new Map());
    const [positions, setPositions] = useState<Map<string, number>>(new Map());
    const [disqualifiedTotal, setDisqualifiedTotal] = useState<Map<string, number>>(new Map());

    useEffect(() => {
        const newPoints = new Map<string, number>();
        const newDisqualifiedTotal = new Map<string, number>();

        houses.forEach(house => {
            const resultsForHouse = eventResults.filter(r => {
                const isTeam = r.participantType === "house";
                if (isTeam) {
                    return r.participantId === house.id;
                } else {
                    const participant = participants.find(p => p.id === r.participantId);
                    return participant?.houseId === house.id;
                }
            });

            const totalPoints = resultsForHouse.reduce((sum, result) => sum + result.points, 0);
            const disqualified = resultsForHouse.reduce((sum, result) => sum + (result.position === 0 ? 1 : 0), 0);
            newDisqualifiedTotal.set(house.id, disqualified);
            newPoints.set(house.id, totalPoints);
        });

        setPoints(newPoints);
        setDisqualifiedTotal(newDisqualifiedTotal);

        // Now compute positions based on newPoints
        const sortedHousePoints = Array.from(newPoints.entries()).sort((a, b) => b[1] - a[1]);
        const newPositions = new Map<string, number>();
        let currentPosition = 1;

        for (let i = 0; i < sortedHousePoints.length; i++) {
            const [houseId, pointValue] = sortedHousePoints[i];

            if (i > 0 && sortedHousePoints[i - 1][1] === pointValue) {
                const prevHouseId = sortedHousePoints[i - 1][0];
                newPositions.set(houseId, newPositions.get(prevHouseId)!);
            } else {
                newPositions.set(houseId, currentPosition);
            }

            currentPosition++;
        }

        setPositions(newPositions);
    }, [eventResults, houses, participants]);

    return(
         <div className="flex-1 h-full flex flex-col">
            <div className="shrink-0 px-4 py-2 flex justify-between items-center border-b">
                <div className="flex items-center gap-5">
                    <h1 className="text-lg font-bold">Houses ({houses.length})</h1>
                <HouseDialogForm houses={houses} fetchHouses={fetchSessionHouses} onCreate={createHouse} purpose={"create"} />
                </div>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search houses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div> 
            </div>
            <ScrollBox className="flex-1 overflow-y-auto pb-20">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='w-20'>Position</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Abbreviation</TableHead>
                            <TableHead className='hidden md:table-cell'>
                                Total Participants
                            </TableHead><TableHead className='hidden md:table-cell'>
                                Total Disqualified
                            </TableHead><TableHead className='hidden md:table-cell'>
                                Points
                            </TableHead>
                            <TableHead className='w-24 text-right'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {houses.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className='text-center py-8 text-muted-foreground'>
                                    <div className={"flex items-center flex-col gap-4"}>
                                        No Houses found. Create one below.
                                        <HouseDialogForm houses={houses} fetchHouses={fetchSessionHouses} onCreate={createHouse} purpose={"create"} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) :
                            houses.filter((h) => h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className='text-center py-8 text-muted-foreground'>
                                        <div className={"flex items-center flex-col gap-4"}>
                                            No Houses match your search. Create one below.
                                            <HouseDialogForm houses={houses} fetchHouses={fetchSessionHouses} onCreate={createHouse} purpose={"create"} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                houses.filter((h) => h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())).sort((a, b) => {
                                    const positionA = positions.get(a.id) ?? Infinity;
                                    const positionB = positions.get(b.id) ?? Infinity;
                                    return positionA - positionB;
                                }).map((house) => (
                                    <HouseCard disqualified={disqualifiedTotal.get(house.id) ?? 0} position={positions.get(house.id)} points={points.get(house.id)} key={house.id} house={house} participants={participants.filter(p => p.houseId === house.id).length} onUpdate={updateHouse} onDelete={deleteHouse} houses={houses} fetchHouses={fetchSessionHouses} />
                                ))
                            )}
                    </TableBody>
                </Table>
            </ScrollBox>
        </div>
    )
}
import {PSEvent, PSEventResult, PSHouse, PSParticipant} from "@/db/sqlite/p_sports/schema";
import {TableCell, TableRow} from "~/components/ui/table";
import {Input} from "~/components/ui/input";
import {getGenderName} from "@/shared/genderName";
import {Button} from "~/components/ui/button";
import {Edit2, Save, Trash} from "lucide-react";
import {useState} from "react";
import SessionEventDialogForm from "~/components/session-event-dialog-form";
import {DeleteModal} from "~/components/deleteModal";
import PsEventResultsDialog from "~/components/ps_event_results_dialog";
import HouseDialogForm from "~/components/house-dialog-form";
import {cn} from "~/lib/utils";

type HouseProps = {
    house: PSHouse;
    participants: number;
    onUpdate: (eventId:string,event: Partial<PSEvent>) => Promise<void>;
    onDelete: (eventId:string) => Promise<void>;
    houses:PSHouse[];
    fetchHouses: () => Promise<void>;
    points:number;
    position:number;
    disqualified:number;
};
export default function HouseCard({points,position,disqualified, house, onUpdate,fetchHouses,participants,houses, onDelete }: HouseProps) {

    return (
        <TableRow className={cn(house.color?`text-[${house.color}]`:"")}
                  style={{color:house.color&&`${house.color}`}}
        >
            <TableCell>{position}</TableCell>
            <TableCell className='font-medium'>{house.name}</TableCell>
            <TableCell className='font-medium'>{house.abbreviation??"N/A"}</TableCell>
            <TableCell className='hidden md:table-cell'>{participants}</TableCell>
            <TableCell className='hidden md:table-cell'>{disqualified}</TableCell>
            <TableCell className='hidden md:table-cell'>{points}</TableCell>
            <TableCell className='flex items-center gap-2 justify-end'>
                <HouseDialogForm houses={houses} fetchHouses={fetchHouses} onUpdate={onUpdate} purpose={"edit"} house={house}/>
                <DeleteModal onDelete={async()=>await onDelete(house.id)} itemName={`${house.name} (${house.abbreviation??""})`} trigger={<Button variant="destructive" size={"icon"} className={`w-6 h-6`}>
                    <Trash className={"w-4 h-4"}/>
                </Button>}/>
            </TableCell>
        </TableRow>
    );
}
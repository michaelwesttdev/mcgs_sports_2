import {PSEvent, PSHouse, PSParticipant} from "@/db/sqlite/p_sports/schema";
import {TableCell, TableRow} from "~/components/ui/table";
import {Input} from "~/components/ui/input";
import {getGenderName} from "@/shared/genderName";
import {Button} from "~/components/ui/button";
import {Edit2, Save, Trash} from "lucide-react";
import SessionEventDialogForm from "~/components/session-event-dialog-form";
import {DeleteModal} from "~/components/deleteModal";
import PsEventResultsDialog from "~/components/ps_event_results_dialog";
import {getAge} from "@/shared/helpers/dates";
import ParticipantDialogForm from "~/components/participant-dialog-form";
import { useNavigate } from "react-router";
import { useSessionState } from "./SessionStateContext";
import { CSSProperties } from "react";

type ParticipantCardProps = {
    participant: PSParticipant;
    onUpdate: (id:string,participant: Partial<PSParticipant>) => Promise<void>;
    onDelete: (id:string) => Promise<void>;
    house:PSHouse,
    createHouse: (house: Omit<PSHouse,"id"|"createdAt"|"updatedAt"|"deletedAt">) => Promise<void>;
    fetchHouses:()=>Promise<void>;
    houses:PSHouse[],
    searchString?:string ,
    style?: CSSProperties,
};
export default function ParticipantCard({style, searchString,participant, onUpdate,createHouse,fetchHouses,houses, onDelete,house }: ParticipantCardProps) {
    const navigate = useNavigate();
    const {sessionId} = useSessionState();
    return (
        <TableRow style={style} key={participant.id} onClick={()=>navigate(`/sessions/performance/${sessionId}/participant/${participant.id}?searchP=${searchString}`)}>
            <TableCell> {participant.firstName || "-"}</TableCell>
            <TableCell className='font-medium'>{`${participant.lastName}`}</TableCell>
            <TableCell className='font-medium capitalize'>{participant.gender}</TableCell>
            <TableCell className='hidden md:table-cell'>{getAge(participant.dob)}</TableCell>
            <TableCell className='hidden md:table-cell'> {house.name}</TableCell>
            <TableCell onClick={(e)=>e.stopPropagation()} className='flex items-center gap-2 justify-end'>
                <ParticipantDialogForm fetchHouses={fetchHouses} purpose={"edit"} participant={participant}
                                       onUpdate={onUpdate} createHouse={createHouse} houses={houses}/>
                <DeleteModal onDelete={async()=>await onDelete(participant.id)} itemName={`${participant.firstName} ${participant.lastName}`} trigger={<Button variant="destructive" size={"icon"} className={`w-6 h-6`}>
                    <Trash className={"w-4 h-4"}/>
                </Button>}/>
            </TableCell>
        </TableRow>
    );
}
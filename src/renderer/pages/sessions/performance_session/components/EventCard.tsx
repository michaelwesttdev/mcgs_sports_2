import {PSEvent, PSEventResult, PSHouse, PSParticipant} from "@/db/sqlite/p_sports/schema";
import {TableCell, TableRow} from "~/components/ui/table";
import {Input} from "~/components/ui/input";
import {getGenderName} from "@/shared/genderName";
import {Button} from "~/components/ui/button";
import {Edit2, MoreHorizontal, Printer, Save, Trash} from "lucide-react";
import {useState} from "react";
import SessionEventDialogForm from "~/components/session-event-dialog-form";
import {DeleteModal} from "~/components/deleteModal";
import PsEventResultsDialog from "~/components/ps_event_results_dialog";
import {Badge} from "~/components/ui/badge";
import { cn } from "@/renderer/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/renderer/components/ui/dialog";
import Print from "@/renderer/components/print";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/renderer/components/ui/dropdown-menu";
import { useSessionState } from "./SessionStateContext";

type EventProps = {
    event: PSEvent;
};
export default function EventCard({event}: EventProps) {
    const [printDialogOpen,setPrintDialogOpen] = useState(false)
    const {sessionId,updateEventResult,createEventResult,deleteEventResult,eventResults,updateEvent,participants,houses,deleteEvent} = useSessionState();
    const results = eventResults.filter(result => result.eventId === event.id)

    return (
        <TableRow key={event.id} className={cn(event.status==="complete"&&"bg-muted text-green-800")}>
            <TableCell> {event.eventNumber || "-"}</TableCell>
            <TableCell className='font-medium'>{`${event.title} - ${event.ageGroup}`}</TableCell>
            <TableCell className='font-medium'>{getGenderName(event.gender)}</TableCell>
            <TableCell className='hidden md:table-cell'>{event.recordHolder || "-"}</TableCell>
            <TableCell className='hidden md:table-cell'> {event.record ? (`${event.record} ${event.measurementMetric || ""}`) : ("-")}</TableCell>
            <TableCell>
                <Badge variant={event.isRecordBroken?"default":"outline"}>
                    {
                        event.isRecordBroken?"New Record!":"Unchanged"
                    }
                </Badge>
            </TableCell>
            <TableCell className='flex items-center gap-2 justify-end'>
                <PsEventResultsDialog onDone={()=>setPrintDialogOpen(true)} updateEvent={updateEvent} createResult={createEventResult} updateResult={updateEventResult} results={results} deleteResult={deleteEventResult} participants={participants} houses={houses} eventId={event.id} eventTitle={`${event.title} - ${event.ageGroup} ${getGenderName(event.gender)}`} event={event}/>
                <DeleteModal onDelete={async()=>await deleteEvent(event.id)} itemName={`event number ${event.eventNumber} (${event.title} - U${event.ageGroup} (${getGenderName((event.gender))}))`} trigger={<Button variant="destructive" size={"icon"} className={`w-6 h-6`}>
                    <Trash className={"w-4 h-4"}/>
                </Button>}/>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size={"icon"} className={`w-6 h-6`}>
                            <MoreHorizontal className={"w-4 h-4"}/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="flex flex-col gap-2">

                        <DropdownMenuItem asChild>
                            <SessionEventDialogForm trigger={<Button>Edit</Button>} purpose={"edit"} event={event} onUpdate={updateEvent}/>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Button variant="outline" size={"sm"} className={`w-full`} onClick={()=>setPrintDialogOpen(true)}>
                                <span className="flex items-center gap-2">
                                    <Printer className={"w-4 h-4"}/>
                                    Print
                                </span>
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <PrintDialog sessionId={sessionId} isOpen={printDialogOpen} id={event.id} title={`Print Event Number ${event.eventNumber} - ${event.ageGroup} - ${event.gender}`} setIsOpen={(v)=>setPrintDialogOpen(v)}/>
            </TableCell>
        </TableRow>
    );
}

export function PrintDialog({isOpen=false,id,sessionId,title="Print Event",setIsOpen}:{isOpen:boolean,id:string,sessionId:string,title?:string,setIsOpen:(v:boolean)=>void}){
    return(
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogTitle>{title}</DialogTitle>
                <div className="flex items-center justify-center gap-5 min-w-[300px]">
                    <Button variant="destructive">Cancel</Button>
                    <Print onDone={()=>setIsOpen(false)} sessionId={sessionId} id={id} type="event"/>
                </div>
            </DialogContent>
        </Dialog>
    )
}
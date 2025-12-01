import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import { Input } from "../../../../components/ui/input";
import { cn } from "~/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { useEffect, useState } from "react";
import { useSession } from "../../../../hooks/use_session";
import { useSessionState } from "./SessionStateContext";
import Loader from "@/renderer/components/Loader";
import { useSessionSettings } from "./hooks/use_settings";
import { Separator } from "@/renderer/components/ui/separator";
import { Label } from "@/renderer/components/ui/label";
import { Checkbox } from "@/renderer/components/ui/checkbox";

export type SessionCsvEvent = {
  eventNumber: number;
  title: string;
  type: "team" | "individual";
  ageGroup: Date;
  gender: "male" | "female" | "mixed";
  recordHolder: string;
  measurementMetric: string;
  record: string;
};
export const SessionCsvEventHeaders = [
  "eventNumber",
  "title",
  "type",
  "ageGroup",
  "gender",
  "recordHolder",
  "measurementMetric",
  "record",
];

type Props = {
  triggerClassName?: string;
  onDone:()=>void
};
export default function EventFromOtherDialog({ triggerClassName,onDone }: Readonly<Props>) {
  const [selectedSession, setSelectedSession] = useState<string>(undefined);
  const { sessions } = useSession();
  const {fetchAndUpdateSettingsFromAnotherSession} = useSessionSettings();
  const { importEventsFromAnotherSession, loading,session } = useSessionState();
  const [isOpen,setIsOpen] = useState(false);
  const [includeSettings,setIncludeSettings] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={(v)=>{
      if(!v){
        setSelectedSession(undefined);
      onDone();
      }
      setIsOpen(v);
    }}>
      <DialogTrigger asChild>
        <Button className={cn(triggerClassName)}>From Session</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Events and/or Settings From Another Session</DialogTitle>
        </DialogHeader>
        {loading ? (<Loader />) : (
          <>
          <Select value={selectedSession} onValueChange={(v) => setSelectedSession(v)}>
          <SelectTrigger>
            <SelectValue placeholder={"Select a session"} />
          </SelectTrigger>
          <SelectContent>
            {
              sessions.filter(s=>s.type===session.type && s.id!==session.id).map(s => (
                <SelectItem value={s.id}>{s.title}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>
        <Separator/>
        <div>
          <Label htmlFor="includeSettings">Include Settings?: </Label>
          <Checkbox checked={includeSettings} onCheckedChange={(v)=>{
            setIncludeSettings(v as boolean);
          }}/>
        </div>
          </>
        )}
        <DialogFooter>
          <Button disabled={selectedSession ? false : true} onClick={async () => {
            await importEventsFromAnotherSession(selectedSession);
            if(includeSettings){
              await fetchAndUpdateSettingsFromAnotherSession(selectedSession)
            }
            setSelectedSession(undefined);
            setIsOpen(false);
            onDone();
          }}>Pull Events</Button>
        </DialogFooter>
      </DialogContent>

    </Dialog>
  );
}

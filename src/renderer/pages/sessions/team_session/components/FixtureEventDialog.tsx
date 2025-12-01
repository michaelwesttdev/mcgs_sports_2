import { Button } from "@/renderer/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/renderer/components/ui/dialog";
import { Input } from "@/renderer/components/ui/input";
import { Label } from "@/renderer/components/ui/label";
import { TSFixture } from "@/db/sqlite/t_sports/schema";
import { useState } from "react";
import { SearchableSelectWithDialog } from "@/renderer/components/creatable_select";
import { useSessionSettings } from "./hooks/use_settings";
import { z } from "zod";
import { Toast } from "@/renderer/components/Toast";
import { TSessionSettings } from "@/shared/settings";
import { useSessionState } from "./SessionStateContext";
import { dateToString } from "@/shared/helpers/dates";

interface FixtureEventDialogProps {
  fixture: TSFixture;
}

export function FixtureEventDialog({ fixture }: FixtureEventDialogProps) {
  const [eventType, setEventType] = useState("");
  const { settings, updateSettings } = useSessionSettings();
  const {createFixtureEvent} = useSessionState();

  async function onSave(){
    if(!fixture) return;
    try {
      await createFixtureEvent({
        eventType,
        fixtureId:fixture.id,
        timestamp:dateToString(new Date())
      });
      Toast({message:"Event Added",variation:"success"});
      setEventType("");
    } catch (error) {
      Toast({message:"An Error has occured.",variation:"success"})
      console.log(error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Event</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Event to {fixture.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="event-type" className="text-right">
              Event Type
            </Label>
            <SearchableSelectWithDialog
              value={eventType}
              onChange={setEventType}
              options={settings.eventTypes.map((et) => ({
                id: et,
                name: et,
              }))}
              schema={z.object({
                eventType: z.string(),
              })}
              onAddOption={async (data) => {
                const exists = settings.eventTypes.find(
                  (type) => type.toLowerCase() === data.eventType.toLowerCase()
                );
                if (exists) {
                  Toast({
                    message: "Event Type Already Exists",
                    variation: "error",
                  });
                  return;
                }
                const newSettings: TSessionSettings = {
                  ...settings,
                  eventTypes: [...settings.eventTypes, data.eventType.toLowerCase()],
                };
                await updateSettings(
                  newSettings
                    ? { settings: newSettings }
                    : ({ settings } as any)
                );
                setEventType(data.eventType);
                Toast({
                  message: "Settings saved",
                  variation: "success",
                });
              }}
            />
          </div>
        </div>
        <Button onClick={async() => await onSave()}>Save</Button>
      </DialogContent>
    </Dialog>
  );
}

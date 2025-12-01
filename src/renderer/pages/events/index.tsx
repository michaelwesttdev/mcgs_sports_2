import React, { useEffect, useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {Copy, CopyPlus, Trash} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/renderer/components/ui/select";
import { useEvents } from "~/hooks/use_events";
import NewEventDialogForm from "~/components/new-event-dialog-form";
import {DeleteModal} from "~/components/deleteModal";
import {getGenderName} from "@/shared/genderName";
import { ScrollBar } from "@/renderer/components/ui/scroll-area";
import ScrollBox from "@/renderer/components/ScrollBox";
import { DisciplineType } from "@/shared/constants/constants";

export default function EventsPage() {
  const [searchTitle, setSearchTitle] = useState("");
  const [searchDiscipline, setSearchDiscipline] = useState("");
  const { events, listAllEvents,duplicateEvent,deleteEvent } = useEvents();

  const filteredEvents = events.filter((event) => {
    const matchesTitle = event.title
      .toLowerCase()
      .includes(searchTitle.toLowerCase().trim());
    const matchesDiscipline =
      !searchDiscipline ||
      searchDiscipline === "all" ||
      event.type ===
        DisciplineType.find((t) => t=== searchDiscipline);

    return matchesTitle && matchesDiscipline;
  });

  useEffect(() => {
    (async () => {
      await listAllEvents();
    })();
  }, []);

  return (
    <ScrollBox>
    <div className='p-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold'>Events</h1>
          <p className='text-xs text-gray-500'>
            Please Note: Events Here are only for performance sports
          </p>
        </div>
        <NewEventDialogForm />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Input
          placeholder='Search by title'
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
        <Select
          value={searchDiscipline}
          onValueChange={(v) => setSearchDiscipline(v)}>
          <SelectTrigger>
            <SelectValue placeholder='Filter by discipline' />
          </SelectTrigger>
          <SelectContent>
            {DisciplineType
              .filter((d) => d === "swimming" || d === "athletics")
              .map((discipline) => (
                <SelectItem key={discipline} value={discipline}>
                  {discipline}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className='grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
        {filteredEvents.map((event) => (
          <Card key={event.id} className='rounded-2xl shadow-md'>
            <CardContent className='p-4 flex items-center'>
              <div className='flex-1'>
                <h2 className='text-lg font-semibold'>{event.title}</h2>
                <p className='text-sm text-gray-500'>
                  {`Age group: U${event.ageGroup} - ${event.gender === "male"?"Boys":event.gender==="female"?"Girls":"Mixed"}`}
                </p>
                <p className='text-sm text-gray-500'>
                  Discipline:{" "}
                  {event.type??
                      "N/A"}
                </p>
              </div>
              <aside className='grid gap-3'>

                <DeleteModal itemName={`${event.title} - U${event.ageGroup} (${getGenderName(event.gender)})`} onDelete={async()=>{
                  await deleteEvent(event.id);
                }} trigger={<Button variant='destructive' className='w-6 h-6' size='icon'>
                  <Trash/>
                </Button>}/>
                <NewEventDialogForm event={event} purpose='edit' />
                <Button
                  variant='outline'
                  size='icon'
                  className='w-6 h-6'
                  onClick={async()=>await duplicateEvent(event)}
                >
                  <CopyPlus/>
                  </Button>
              </aside>
            </CardContent>
          </Card>
        ))}
        {filteredEvents.length === 0 && (
          <Card>
            <CardContent className='p-4 flex flex-col gap-2 items-center justify-center'>
              <p className='text-center text-gray-500'>No Events found.</p>
              <NewEventDialogForm />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
    </ScrollBox>
  );
}

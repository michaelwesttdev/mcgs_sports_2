import React, { useEffect, useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Edit, PlusCircle, Trash } from "lucide-react";
import NewSessionDialogForm from "@/renderer/components/NewSessionDialogForm";
import { useSession } from "@/renderer/hooks/use_session";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/renderer/components/ui/select";
import { useNavigate } from "react-router";
import ScrollBox from "@/renderer/components/ScrollBox";
import { DeleteModal } from "@/renderer/components/deleteModal";
import { DisciplineType } from "@/shared/constants/constants";

export default function SessionsPage() {
  const [searchTitle, setSearchTitle] = useState("");
  const [searchDescipline, setSearchDescipline] = useState("all");
  const { sessions, listAllSessions, deleteSession } = useSession();
  const navigate = useNavigate();
  const filteredSessions = sessions.filter((session) => {
    const titleMatch = session.title
      .toLowerCase()
      .includes(searchTitle.toLowerCase());
    const disciplineMatch =
      searchDescipline === "all"
        ? true
        : session.type
          .toLowerCase()
          .includes(searchDescipline.toLowerCase());
    return titleMatch && disciplineMatch;
  });
  function getSessionType(type:string){
    switch(type){
      case "swimming":
      case "athletics":
        return "performance"
      default:
        return type
    }
  }

  useEffect(() => {
    (async () => {
      await listAllSessions();
    })();
  }, []);

  return (
    <ScrollBox>
      <div className='p-6 space-y-6'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>Sessions</h1>
          <NewSessionDialogForm />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Input
            placeholder='Search by title'
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
          <Select
            value={searchDescipline}
            onValueChange={(value) => setSearchDescipline(value)}>
            <SelectTrigger>
              <SelectValue placeholder='filter by discipline' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All</SelectItem>
              {DisciplineType.map((discipline) => (
                <SelectItem key={discipline} value={discipline}>
                  {discipline}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='grid gap-4'>
          {filteredSessions.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            // Zero out the time (optional if your dates are already in YYYY-MM-DD format)
            dateA.setHours(0, 0, 0, 0);
            dateB.setHours(0, 0, 0, 0);

            return dateB.getTime() - dateA.getTime();
          }).map((session) => (
            <Card
              key={session.id}
              onClick={() => {
                navigate(`/sessions/${getSessionType(session.type)}/${session.id}`);
              }}
              className='rounded-2xl shadow-md cursor-pointer select-none group hover:scale-105 transition-all duration-200'>
              <CardContent className='p-4 flex items-center gap-1 flex-row'>
                <div className={"flex-1"}>
                  <h2 className='text-lg font-semibold'>{session.title}</h2>
                  <p className='text-sm text-gray-500'>
                    Descipline:{" "}
                    {session.type}
                  </p>
                  <p className='text-sm text-gray-500'>
                    Year: {new Date(session.date).getFullYear()}
                  </p>

                </div>
                <div onClick={(e) => e.stopPropagation()} className={"flex flex-col gap-2 group-hover:opacity-100 opacity-0"}>
                  <DeleteModal
                    title={`Delete Session`}
                    itemName={session.title}
                    onDelete={() => deleteSession(session.id)}
                    trigger={
                      <Button className={"w-6 h-6"} variant={"destructive"} size={"icon"}>
                        <Trash className={"w-4 h-4"} />
                      </Button>
                    }
                  />
                  <NewSessionDialogForm trigger={
                    <Button className='w-6 h-6' variant='outline'>
                      <Edit className='w-4 h-4' />
                    </Button>
                  }
                    type="edit"
                    defValues={{
                      id: session.id,
                      title: session.title,
                      date: session.date,
                      time: session.time,
                      location: session.location,
                      type: session.type
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredSessions.length === 0 && (
            <p className='text-center text-gray-500'>No sessions found.</p>
          )}
        </div>
      </div>
    </ScrollBox>
  );
}

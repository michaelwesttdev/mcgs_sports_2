import NewSessionDialogForm from "@/renderer/components/NewSessionDialogForm";
import { Button } from "@/renderer/components/ui/button";
import { Card, CardContent } from "@/renderer/components/ui/card";
import { format } from "date-fns";
import React, { useEffect } from "react";
import {useEvents} from "~/hooks/use_events";
import {useSession} from "~/hooks/use_session";
import {useNavigate} from "react-router";
import ScrollBox from "@/renderer/components/ScrollBox";

function DashboardPageHeader() {
  return (
    <div className='bg-gradient-to-r from-[#ff0000] to-[#00007e] rounded-md p-4 text-white w-full'>
      <div className='flex items-center gap-2 justify-between'>
        <h1 className='text-xl font-bold'>MCGS Sports Scoring DashBoard</h1>
        <p className='text-xs tracking-wide'>{format(new Date(), "PPPP")}</p>
      </div>
      <div className='container flex items-center justify-end pt-4 gap-4'>
        <NewSessionDialogForm />
      </div>
    </div>
  );
}
function DashboardPageQuickActions() {
  const {events} = useEvents();
  const {sessions} = useSession();
  const navigate = useNavigate();
  return (
    <Card className='my-4'>
      <CardContent className='flex items-center gap-5 p-4'>
        <Card onClick={()=>navigate("/sessions")} className='max-w-[250px] w-max p-2 cursor-pointer select-none hover:scale-105 transition-all duration-200'>
          <CardContent>
            <h1 className='text-3xl font-bold'>{sessions.length}</h1>
            <p>Session{(sessions.length > 1 || sessions.length < 1) && "s"}</p>
          </CardContent>
        </Card>
        <Card onClick={()=>navigate("/events")} className='max-w-[250px] w-max p-2 cursor-pointer select-none hover:scale-105 transition-all duration-200'>
          <CardContent>
            <h1 className='text-3xl font-bold'>{events.length}</h1>
            <p>Event{(events.length > 1 || events.length < 1 )&& "s"}</p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <ScrollBox>
    <div className='p-6 pt-2'>
      <DashboardPageHeader />
      <DashboardPageQuickActions />
    </div>
    </ScrollBox>
  );
}

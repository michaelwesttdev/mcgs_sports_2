import { MSession } from "@/db/sqlite/main/schema";
import {PSEvent, PSEventResult, PSHouse, PSParticipant} from "@/db/sqlite/p_sports/schema";
import { Toast } from "@/renderer/components/Toast";
import { useEvents } from "@/renderer/hooks/use_events";
import { useSession } from "@/renderer/hooks/use_session";
import { useEffect, useState } from "react";
import {nanoid} from "nanoid";

export function useSessionHelper(sessionId: string) {
  const { getSession } = useSession();
  const { events: mainEvents, listAllEvents } = useEvents();
  const [session, setSession] = useState<MSession | undefined>(undefined);
  const [events, setEvents] = useState<PSEvent[]>([]);
  const [houses, setHouses] = useState<PSHouse[]>([]);
  const [eventResults, setEventResults] = useState<PSEventResult[]>([]);
  const [participants, setParticipants] = useState<PSParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  async function fetchSession() {
    const session = await getSession(sessionId);
    setSession(session);
    setLoading(false);
  }
  async function importEventsFromMainStore() {
    setLoading(true);
    try {
      await listAllEvents();
      const mainStoreEvents = mainEvents;
      const sessionEventsRes = await window.api.psListEvent(sessionId);
      if (!sessionEventsRes.success) throw new Error(sessionEventsRes.error);
      const sessionEvents = sessionEventsRes.data as PSEvent[];
      const eventsToImport = mainStoreEvents.filter(
        (event) =>
          !sessionEvents.find((se) => se.id === event.id) &&
          event.type === session?.type
      );
      console.log(eventsToImport);
      if(eventsToImport.length<=0){
        Toast({
          message: "No Events found to import",
          variation: "success",
        });
        return
      }
      const insertedEvents = await window.api.psCreateEvent([
        sessionId,
        eventsToImport,
      ]);
      if (!insertedEvents.success) throw new Error(insertedEvents.error);
      await fetchSessionEvents();
      Toast({
        message: "Events imported successfully",
        variation: "success",
      });
    } catch (error) {
      Toast({ message: error.message, variation: "error" });
    } finally {
      setLoading(false);
    }
  }
  async function importEventsFromAnotherSession(id:string){
    setLoading(true);
    try {
      //connect to other session db
      await window.api.handleSessionDbCreate(id,"performance");
      //get the events
      const {data:eventsFromOtherSession,success,error} = await window.api.psListEvent(id);
      if(!success){
        throw new Error(error)
      }
      //compare events to avoid duplicates
      const eventsToCreate = (eventsFromOtherSession as PSEvent[]).filter(es=>{
        const exists = events.some(e=>e.title.toLowerCase().includes(es.title.toLowerCase())||e.id === es.id)
        return !exists;
      }).map(es=>({
            ...es,
            isRecordBroken:false,
            bestScore:"",
      }));
      //create non existing events into current session
      if(eventsToCreate.length<=0){
        Toast({
          message: "No Events found to import",
          variation: "success",
        });
        return
      }
      const res = await window.api.psCreateEvent([
        sessionId,
        eventsToCreate,
      ]);
      if (!res.success) throw new Error(res.error);
      //close other session db
      await window.api.handleSessionDbClose(id);
      Toast({message:"Event Share Successful",variation:"success"})
      await refresh();
    } catch (error) {
      console.log(error);
      Toast({message:"An Error has Occured",variation:"error"})
    }finally{
      setLoading(false)
    }
  }
  //session event function
  async function createEvent(event:Omit<PSEvent,"id"|"createdAt"|"updatedAt"|"deletedAt">){
    try {
      const id = nanoid();
      const res = await window.api.psCreateEvent([
        sessionId,
        {id,...event},
      ]);
      if (!res.success) throw new Error(res.error);
      await fetchSessionEvents();
    }
    catch (e) {
      Toast({ message: "Error creating event", variation: "error" });
    }
  }
  async function updateEvent(eventId:string,eventData: Partial<PSEvent>)  {
    try {
      const res = await window.api.psUpdateEvent([sessionId,[eventId,eventData]]);
      if (!res.success) throw res.error;
      await refresh();
    } catch (error) {
      console.error("Failed to update event:", error);
      throw error;
    }
  }
  async function deleteEvent(id:string)  {
    try {
      const res = await window.api.psDeleteEvent([sessionId,id]);
      if (!res.success) throw res.error;
      await refresh();
      Toast({message:"Event Deleted Successfully",variation:"success"});
    }
    catch (error) {
      console.error("Failed to delete event:", error);
      Toast({message:"Failed to delete event",variation:"error"});
    }
  }
  async function fetchSessionEvents() {
    if (!sessionId) return;
    try {
      const events = await window.api.psListEvent(sessionId);
      if (!events.success) throw new Error(events.error);
      setEvents(events.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Toast({ message: "Error fetching session events", variation: "error" });
    }
  }
  //session house functions
  async function createHouse(house:Omit<PSHouse,"id"|"createdAt"|"updatedAt">){
    try {
      const id = nanoid();
      const exists = houses.find((h) => h.name.toLowerCase() === house.name.toLowerCase());
      if(exists) throw new Error("House already exists");
      const res = await window.api.psCreateHouse([
        sessionId,
        {id,...house},
      ]);
      if (!res.success) throw new Error(res.error);
      await fetchSessionHouses();
    }
    catch (e) {
      Toast({ message: e.message??"Error creating house", variation: "error" });
    }
  }
  async function fetchSessionHouses(){
    if (!sessionId) return;
    try {
      const houses = await window.api.psListHouse(sessionId);
      if (!houses.success) throw new Error(houses.error);
      setHouses(houses.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Toast({ message: "Error fetching session houses", variation: "error" });
    }
  }
  async function fetchHouse(id:string){
    if (!sessionId) return;
    try {
      const house = await window.api.psReadHouse([sessionId,[id]]);
      if (!house.success) throw new Error(house.error);
      return house.data as PSHouse
    } catch (error) {
      console.error(error);
      Toast({ message: "Error fetching house", variation: "error" });
    }
  }
  async function updateHouse(houseId:string,house:Partial<PSHouse>){
    try {
      const res = await window.api.psUpdateHouse([sessionId,[houseId,house]]);
      if (!res.success) throw res.error;
      await refresh();
    } catch (error) {
      console.error("Failed to update house:", error);
      throw error;
    }
  }
  async function deleteHouse(houseId:string){
    try {
      const res = await window.api.psDeleteHouse([sessionId,houseId]);
      if (!res.success) throw res.error;
      await refresh();
      Toast({message:"House Deleted Successfully",variation:"success"});
    }
    catch (error) {
      console.error("Failed to delete house:", error);
      Toast({message:"Failed to delete house",variation:"error"});
    }
  }
  //session Participant functions
  async function createParticipant(participant:Omit<PSParticipant,"id"|"createdAt"|"updatedAt">){
    try {
      const id = nanoid();
      const res = await window.api.psCreateParticipant([
        sessionId,
        {id,...participant},
      ]);
      if (!res.success) throw new Error(res.error);
      await fetchSessionParticipants();
    }
    catch (e) {
      Toast({ message: "Error creating Participant", variation: "error" });
    }
  }
  async function fetchSessionParticipants(){
    if (!sessionId) return;
    try {
      const participants = await window.api.psListParticipant(sessionId);
      if (!participants.success) throw new Error(participants.error);
      setParticipants(participants.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Toast({ message: "Error fetching session Participants", variation: "error" });
    }
  }
  async function fetchParticipant(id:string){
    if (!sessionId) return;
    try {
      const Participant = await window.api.psReadParticipant([sessionId,[id]]);
      if (!Participant.success) throw new Error(Participant.error);
      return Participant.data as PSParticipant
    } catch (error) {
      console.error(error);
      Toast({ message: "Error fetching participant", variation: "error" });
    }
  }
  async function updateParticipant(id:string,participant:Partial<PSParticipant>){
    try {
      const res = await window.api.psUpdateParticipant([sessionId,[id,participant]]);
      if (!res.success) throw res.error;
      await refresh();
    } catch (error) {
      console.error("Failed to update Participant:", error);
      throw error;
    }
  }
  async function deleteParticipant(id:string){
    try {
      const res = await window.api.psDeleteParticipant([sessionId,id]);
      if (!res.success) throw res.error;
      await refresh();
      Toast({message:"Participant Deleted Successfully",variation:"success"});
    }
    catch (error) {
      console.error("Failed to delete participant:", error);
      Toast({message:"Failed to delete participant",variation:"error"});
    }
  }
  //session event result functions
  async function createEventResult(result:Omit<PSEventResult,"createdAt"|"updatedAt"|"deletedAt">){
    try {
      const res = await window.api.psCreateEventResult([
        sessionId,
        {...result},
      ]);
      if (!res.success) throw new Error(res.error);
      await fetchSessionEventResults();
    }
    catch (e) {
      Toast({ message: "Error adding Result", variation: "error" });
    }
  }
  async function fetchSessionEventResults(){
    if (!sessionId) return;
    try {
      const results = await window.api.psListEventResults(sessionId);
      if (!results.success) throw new Error(results.error);
      setEventResults(results.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Toast({ message: "Error fetching session Event Results", variation: "error" });
    }
  }
  async function updateEventResult(id:string,result:Partial<PSEventResult>){
    try {
      const res = await window.api.psUpdateEventResult([sessionId,[id,result]]);
      if (!res.success) throw res.error;
      await refresh();
    } catch (error) {
      console.error("Failed to update EventResults:", error);
      throw error;
    }
  }
  async function deleteEventResult(id:string){
    try {
      const res = await window.api.psDeleteEventResult([sessionId,id]);
      if (!res.success) throw res.error;
      await refresh();
      Toast({message:"Event Result Deleted Successfully",variation:"success"});
    }
    catch (error) {
      console.error("Failed to delete event result:", error);
      Toast({message:"Failed to delete event result",variation:"error"});
    }
  }
  const refresh = async () => {
    await fetchSession();
    await fetchSessionEvents();
    await fetchSessionHouses();
    await fetchSessionParticipants();
    await fetchSessionEventResults();
  }
  useEffect(() => {
    if (sessionId) {
      refresh().catch(e=>console.error(e));
    }
  }, [sessionId]);
  return {
    session,
    loading,
    query,
    setQuery,
    importEventsFromMainStore,
    importEventsFromAnotherSession,
    fetchSessionEvents,
    fetchParticipant,
    fetchHouse,
    events,
    createEventResult,updateEventResult,deleteEventResult,fetchSessionEventResults,eventResults,
    createEvent,updateEvent,deleteEvent,createHouse,fetchSessionHouses,updateHouse,deleteHouse,createParticipant,fetchSessionParticipants,updateParticipant,deleteParticipant,houses,participants
  };
}

import { useContext } from "react";
import { EventContext } from "../contexts/event.context.provider";

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
}

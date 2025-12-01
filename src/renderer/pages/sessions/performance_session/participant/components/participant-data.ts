import { PSEventResult,PSParticipant, PSHouse, PSEvent } from "@/db/sqlite/p_sports/schema"

interface ParticipantStats {
  totalPoints: number
  totalVlp: number
  eventsParticipated: number
  averagePosition: number
  firstPlace: number
  secondPlace: number
  thirdPlace: number
  bestResult: {
    position: number
    points: number
    eventTitle: string
  } | null
  individualEvents: number
  teamEvents: number
}

interface EventResultWithEvent extends PSEventResult {
  event: PSEvent
}

export interface ParticipantData {
  participant: PSParticipant
  house: PSHouse | null
  eventResults: EventResultWithEvent[]
  stats: ParticipantStats
}

// Mock data - replace with actual database queries using your Drizzle setup
export async function getParticipantData(participantId: string,house:PSHouse,participant:PSParticipant,events:PSEvent[],results:PSEventResult[]): Promise<ParticipantData | null> {

  const eventResults: EventResultWithEvent[] = results.map(res=>{
    const event = events.find(e=>e.id===res.eventId);
    return {
      ...res,
      event
    }
  }).filter(res=>res.participantId===participantId)

  // Calculate stats
  const stats: ParticipantStats = {
    totalPoints: eventResults.reduce((sum, result) => sum + result.points, 0),
    totalVlp: eventResults.reduce((sum, result) => sum + result.vlp, 0),
    eventsParticipated: eventResults.length,
    averagePosition:
      eventResults.length > 0
        ? eventResults.reduce((sum, result) => sum + result.position, 0) / eventResults.length
        : 0,
    firstPlace: eventResults.filter((result) => result.position === 1).length,
    secondPlace: eventResults.filter((result) => result.position === 2).length,
    thirdPlace: eventResults.filter((result) => result.position === 3).length,
    bestResult:
      eventResults.length > 0
        ? eventResults.reduce(
            (best, current) =>
              current.position < best.position
                ? {
                    position: current.position,
                    points: current.points,
                    eventTitle: current.event.title,
                  }
                : best,
            {
              position: eventResults[0].position,
              points: eventResults[0].points,
              eventTitle: eventResults[0].event.title,
            },
          )
        : null,
    individualEvents: eventResults.filter((result) => result.event.eventType === "individual").length,
    teamEvents: eventResults.filter((result) => result.event.eventType === "team").length,
  }

  return {
    participant,
    house,
    eventResults,
    stats,
  }
}

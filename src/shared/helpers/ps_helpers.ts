import {PSessionSettings} from "@/shared/settings";
import {PSEvent, PSEventResult, PSHouse, PSParticipant} from "@/db/sqlite/p_sports/schema";
import { getAge } from "./dates";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

export function getPointsForParticipant(position:number,eventType:"team"|"individual",settings:PSessionSettings,isDisqualified:boolean){
    const pointAllocationInSettings = settings.points[eventType];
    const vlpPointsInSettings = settings.points.vlp;

    if(isDisqualified) return {
        points:0,
        vlp:0
    };
    return {
        points:pointAllocationInSettings[position]??0,
        vlp:eventType==="team"?0:vlpPointsInSettings[position]??0
    };
}
export function assignPointsPreservingOrder(
    results: {
        id: string;
        participantId: string;
        position: number; // ignored
    }[],
    eventType: "team" | "individual",
    settings: PSessionSettings,
    eventId: string
): Omit<PSEventResult, "createdAt" | "updatedAt" | "deletedAt">[] {
    const validResults = results
        .filter(r => r.position>0)
        .map(r => ({ ...r}));

    const sorted = [...validResults].sort((a, b) =>
        a.position - b.position
    );

    const groups: { position: number; participants: typeof sorted }[] = [];

    for (const r of sorted) {
        const existingGroup = groups.find(g=>g.position === r.position);
        if (existingGroup) {
            existingGroup.participants.push(r);
        } else {
            groups.push({ position: r.position, participants: [r] });
        }
    }

    // Step 4: Assign adjusted positions and average points
    const participantPoints = new Map<string, { adjustedPosition: number; points: number,vlp:number }>();
    let currentPosition = 1;

    for (const group of groups) {
        const groupSize = group.participants.length;

        const pointRange = Array.from({ length: groupSize }, (_, i) =>
            getPointsForParticipant(currentPosition + i, eventType, settings, false)
        );

        const averagePoints = pointRange.reduce((sum, pts) => sum + pts.points, 0) / groupSize;

        for (const participant of group.participants) {
            participantPoints.set(participant.participantId, {
                adjustedPosition: currentPosition,
                points: averagePoints,
                vlp:getPointsForParticipant(currentPosition, eventType, settings, false).vlp
            });
        }

        currentPosition += groupSize;
    }

    // Step 5: Map back to original result order
    return results.map(r => {
        const mapped = participantPoints.get(r.participantId);
        const isDisqualified = !mapped;

        return {
            id: r.id,
            eventId,
            participantId: r.participantId,
            position: isDisqualified ? 0 : mapped.adjustedPosition,
            participantType: eventType === "team" ? "house" : "participant",
            points: isDisqualified
                ? 0
                : mapped.points,
            vlp:isDisqualified
                ? 0
                : mapped.vlp,
        };
    });
}

function parseTimeString(time: string, unit: string): number {
    if (!time) return NaN;
    // Split milliseconds if present
    let ms = 0;
    let main = time;
    if (main.includes(".")) {
        const parts = main.split(".");
        main = parts[0];
        ms = parseInt(parts[1].padEnd(2, "0")) || 0;
    }
    const segments = main.split(":").map(Number);
    // Always fill from the right
    let totalSeconds = 0;
    if (unit === "hours" || unit === "h" || unit === "HH:mm:ss.SS") {
        // [hours, minutes, seconds]
        while (segments.length < 3) segments.unshift(0);
        const [h, m, s] = segments;
        totalSeconds = h * 3600 + m * 60 + s + ms / 100;
    } else if (unit === "minutes" || unit === "m" || unit === "mm:ss.SS") {
        // [minutes, seconds]
        while (segments.length < 2) segments.unshift(0);
        const [m, s] = segments;
        totalSeconds = m * 60 + s + ms / 100;
    } else if (unit === "seconds" || unit === "s" || unit === "ss.SS") {
        // [seconds]
        const s = segments[segments.length - 1] || 0;
        totalSeconds = s + ms / 100;
    } else if (unit === "DD:HH:mm:ss.SS") {
        // [days, hours, minutes, seconds]
        while (segments.length < 4) segments.unshift(0);
        const [d, h, m, s] = segments;
        totalSeconds = d * 86400 + h * 3600 + m * 60 + s + ms / 100;
    } else {
        // fallback: treat as mm:ss.SS
        while (segments.length < 2) segments.unshift(0);
        const [m, s] = segments;
        totalSeconds = m * 60 + s + ms / 100;
    }
    return totalSeconds;
}

export function checkIfRecordHasBeenBroken(bestScore:string,results:Omit<PSEventResult, "createdAt" | "updatedAt" | "deletedAt">[],eventNature:PSEvent["measurementNature"],event:PSEvent,participants:PSParticipant[],houses:PSHouse[]){
    const hasRecord = event?.record?true:false;
    const winner = results.find(r=>r.position === 1);
    if(!winner) return {
        isBroken:false
    };
    const individualParticipant = event.eventType === "individual"&&participants.find(p=>p.id===winner.participantId)
    const winnerName = event.eventType ==="team"?houses.find(h=>h.id===winner.participantId).name:`${individualParticipant.firstName.split("")[0].toUpperCase()}. ${individualParticipant.lastName} - ${houses.find(h=>h.id===individualParticipant.houseId).name}`
    if(!hasRecord){
        return {
            isBroken: true,
            newRecord: bestScore,
            recordHolder: winnerName 
        };
    }
    const timeMetricKeys = ["minutes", "seconds", "hours", "days", "milliseconds"] as const;
    const isTimeMetric = timeMetricKeys.includes(event.measurementMetric as any);
    let recordValue: number, bestScoreValue: number;
    if (isTimeMetric) {
        // Use the measurementMetric as the unit for parsing
        recordValue = parseTimeString(event.record, event.measurementMetric);
        bestScoreValue = parseTimeString(bestScore, event.measurementMetric);
    } else {
        recordValue = parseFloat(event.record);
        bestScoreValue = parseFloat(bestScore);
    }
    // Determine if higher or lower is better based on measurementNature
    const isLowerBetter = event.measurementNature === "time";
    const isBroken = isLowerBetter
        ? bestScoreValue < recordValue
        : bestScoreValue > recordValue;
    if(isBroken){
        return {
            isBroken: true,
            newRecord: bestScore,
            recordHolder: winnerName
        };
    }
    return {
        isBroken:false
    };
}

export function getAgeGroupName(ageGroups:PSessionSettings["ageGroups"],dob:string){
    if(!dob) return "Unknown";
    const age = getAge(dob);
    
    // Find the first age group that matches the age
    for (const [groupName, groupRange] of Object.entries(ageGroups)) {
        if(!Array.isArray(groupRange)) {
           return age>=groupRange?groupName:"Unknown";
        }else if (age >= groupRange[0] && age <= groupRange[1]) {
            return groupName;
        }
    }
    
    return "Unknown"; // If no match found    
} 
import { PSEvent, PSEventResult, PSHouse, PSParticipant } from "@/db/sqlite/p_sports/schema";
import { Button } from "./ui/button";
import { usePrinters } from "../hooks/use_printers";
import { Toast } from "./Toast";
import { format } from "date-fns";
import { getAgeGroupName } from "@/shared/helpers/ps_helpers";
import { PSessionSettings, Settings } from "@/shared/settings";
import { getAge } from "@/shared/helpers/dates";

import watermarkImage from '@/assets/watermark.png';
import { useSessionSettings } from "../pages/sessions/performance_session/components/hooks/use_settings";

type PrintOptions = {
  maxPositions?: number;
  includePageBreaks?: boolean;
  printOnlyCompletedEvents?: boolean;
};
type Props = {
  id?: string;
  type: "session" | "event" | "topCompetitors";
  trigger?: React.ReactElement;
  sessionId: string;
  printOptions?: PrintOptions;
  onDone?: () => void;
};

type eventDataToPrint = {
  eventName: string;
  eventNumber: number;
  sex: "male" | "female" | "mixed";
  age_group: string;
  event_type: "team" | "individual";
  metric: string,
  bestScore: string;
  eventRecord: string;
  recordSetter: string;
  results: Promise<{
    pos: number;
    participantId: string;
    name: string;
    house: string;
    age_group: string;
    sex: string;
    hp: number;
    vlp: number;
    additionalInfo: string;
  }>[]
  firstPosMeasurement: string;
  newRecord: string;
}
export default function Print({ id, type, sessionId, printOptions, onDone, trigger }: Props) {
  const { selectedPrinter } = usePrinters();
  const { settings } = useSessionSettings();
  function handlePrint() {
    switch (type) {
      case "event":
        printEvent();
        break;
      case "session":
        printSession(printOptions);
        break;
      default:
        return;
    }
    onDone();
  }
  async function printEvent() {
    const dataToPrint = await getEventDataToPrint(id, sessionId, settings);
    const dataResults = await Promise.all(dataToPrint.results);
    const eventDataHtml = await renderEventBlock(dataToPrint, dataResults.length, false);
    const structure = `
   <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Event Record Sheet</title>
  <style>
    @media print {
      @page {
        size: A4 portrait; /* Change to A5 if needed */
        margin: 0.5cm;
      }

      body {
        margin: 0;
      }

      input {
        border: none;
        background: transparent;
        padding: 0;
      }
    }

    body {
      font-family: Arial, sans-serif;
      margin: 1.5cm;
      font-size: 11pt;
    }

    h2 {
      text-align: center;
      text-transform: uppercase;
      margin-bottom: 20px;
      font-size: 14pt;
    }

    .field-group {
      display: grid;
      grid-template-columns: 4.5cm 1fr;
      row-gap: 8px;
      max-width: 100%;
      margin-bottom: 20px;
    }

    .field-group label {
      font-weight: bold;
    }

    .field-group input {
      border: none;
      background: transparent;
      border-bottom: 1px solid #000;
      width: 100%;
      padding: 2px 0;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
        font-size: 10pt;
      }
      th, td {
        border: 1px solid #000;
        padding: 5px;
        text-align: center;
      }

    .footer-section {
      margin-top: 30px;
    }

    .footer-section label {
      display: inline-block;
      width: 5.5cm;
      font-weight: bold;
    }

    .footer-section input {
      border: none;
      background: transparent;
      border-bottom: 1px solid #000;
      width: 7cm;
      padding: 2px 0;
    }
  </style>
</head>
<body>

  <h2>Event Record Sheet</h2>

  <div class="field-group">
  <p><strong>Event Number:</strong> ${dataToPrint.eventNumber}</p>
  <p><strong>Event Name:</strong> ${dataToPrint.eventName}</p>
  <p><strong>Gender:</strong> ${dataToPrint.sex}</p>
  <p><strong>Age Group:</strong> ${dataToPrint.age_group}</p>
  <p><strong>Event Type:</strong> ${dataToPrint.event_type}</p>
  <p><strong>Best Score:</strong> ${dataToPrint.bestScore}</p>
  </div>

  ${eventDataHtml}

</body>
</html>

    `;
    try {
      await window.api.printHTML({
        html: structure,
        deviceName: selectedPrinter?.name,
        silent: true
      });
    } catch (error) {
      Toast({ message: error.message, variation: "error" });
    }
  }

  async function printSession(options: PrintOptions = {}) {
    const { maxPositions, includePageBreaks } = options;
    const sessionDataToPrint = await getSessionDataToPrint(sessionId, settings, options.printOnlyCompletedEvents);
    const {
      events, ludorum, allEventData, housePointsSummary
    } = sessionDataToPrint;

    const summaryHTML = await renderSessionSummary(sessionId, events.length, events.filter(e => e.status === "complete").length, housePointsSummary);
    const victorHTML = renderLudorumTable("Victor Ludorum (Male)", ludorum.male);
    const victrixHTML = renderLudorumTable("Victrix Ludorum (Female)", ludorum.female);
    const eventsHTML = await Promise.all(
      allEventData.map((data) => renderEventBlock(data, maxPositions, includePageBreaks))
    );

    const fullHTML = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Session Printout</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        font-size: 11pt;
        margin: 1.5cm;
      }
      h1, h2 {
        text-align: center;
        text-transform: uppercase;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
        font-size: 10pt;
      }
      th, td {
        border: 1px solid #000;
        padding: 5px;
        text-align: center;
      }
      .page-break {
        page-break-after: always;
      }
        .no-break {
    break-inside: avoid;
    page-break-inside: avoid;
  }
      .border{
        border: 1px solid black;
        margin-top: 5px;
        padding:5px;
      }
        @media print {
          .watermark-image {
            position: fixed;
            top: 50%;
            left: 50%;
            width: 400px;
            height: 400px;
            opacity: 0.05;
            transform: translate(-50%, -50%) rotate(-30deg);
            z-index: 9999;
            pointer-events: none;
          }
          .watermark-image img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          body {
            -webkit-print-color-adjust: exact;
          }
        }
    </style>
  </head>
  <body>
  <div class="watermark-image">
        <img src="${watermarkImage}" alt="Watermark" />
      </div>

    ${summaryHTML}
    ${victorHTML}
    ${victrixHTML}
    <div class="page-break"></div>
    ${eventsHTML.join("")}

  </body>
  </html>
  `;

    try {
      await window.api.printHTML({
        html: fullHTML,
        deviceName: selectedPrinter?.name,
        silent: true
      });
    } catch (error) {
      console.log(error);
    }
  }
  return trigger ?? (<Button onClick={handlePrint}>Print</Button>);
}

async function getSessionDataToPrint(sessionId: string, settings: PSessionSettings, printOnlyCompletedEvents = false) {
  const session = await window.api.mainReadSession(sessionId);
  console.log("session: ", session)
  const events = await window.api.psListEvent(sessionId);
  console.log("events: ", session)
  if (!session.success || !events.success) {
    throw new Error("Failed to fetch session or events data");
  }
  const eventResults = await window.api.psListEventResults(sessionId);
  if (!eventResults.success) {
    throw new Error("Failed to fetch event results data");
  }
  const participants = await window.api.psListParticipant(sessionId);
  if (!participants.success) {
    throw new Error("Failed to fetch participants data");
  }
  const houses = await window.api.psListHouse(sessionId);
  if (!houses.success) {
    throw new Error("Failed to fetch houses data");
  }
  const housePointsMap = new Map<string, { name: string, points: number }>();
  houses.data.forEach((house: PSHouse) => {
    const resultsForHouse: PSEventResult[] = eventResults.data.filter((r: PSEventResult) => {
      const isTeam = r.participantType === "house";
      if (isTeam) {
        return r.participantId === house.id;
      } else {
        const participant = participants.data.find((p: PSParticipant) => p.id === r.participantId);
        return participant?.houseId === house.id;
      }
    });
    const totalPoints = resultsForHouse.reduce((sum, result) => sum + result.points, 0)
    housePointsMap.set(house.id, { name: house.name, points: totalPoints });
  })
  const allEventData: eventDataToPrint[] = await Promise.all(events.data.filter((e: PSEvent) => printOnlyCompletedEvents ? e.status === "complete" : true).map(async (e: PSEvent) => {
    return await getEventDataToPrint(e.id, sessionId, settings)
  })) as eventDataToPrint[]

  const allResults = await Promise.all(allEventData.flatMap(async (e) => {
    const results = await Promise.all(e.results);
    return results.map((r) => ({ ...r, event: e }))
  }));
  const ludorum = calculateLudorumTables(allResults.flat());
  return {
    sessionName: session.data.name,
    ludorum,
    allEventData,
    events: events.data as PSEvent[],
    housePointsSummary: housePointsMap,
  }
}

async function getEventDataToPrint(id: string, sessionId: string, settings: PSessionSettings) {
  const { data, success, error } = await window.api.psReadEvent([
    sessionId,
    id,
  ]);
  if (!success) return null;
  const event = data as PSEvent;
  const results = await window.api.psListEventResults(sessionId);
  if (!results.success) return null;
  const thisEventResults = (results.data as PSEventResult[]).filter(
    (res) => res.eventId === id
  );

  return {
    eventName: event.title,
    eventNumber: event.eventNumber,
    sex: event.gender,
    bestScore: event.bestScore,
    metric: event.measurementMetric,
    age_group: event.ageGroup,
    event_type: event.eventType,
    eventRecord: event.record,
    recordSetter: event.recordHolder,
    results: thisEventResults.map(async (res) => {
      const isHuman = res.participantType === "participant";
      let pName = "";
      let hName = "";
      let participantSex = "";
      let p_age_group = "";
      let add = "";
      let age = 0;
      if (isHuman) {
        const p = await window.api.psReadParticipant([
          sessionId,
          res.participantId,
        ]);
        if (!p.success) {
          pName = "Unknown";
          hName = "Unknown";
          participantSex = "Unknown";
          p_age_group = "Unknown";
          add = "Internal App Error";
          age = 0;
        } else {
          const house = await window.api.psReadHouse([
            sessionId,
            p.data.houseId,
          ]);
          pName = `${p.data.firstName} ${p.data.lastName}`;
          hName = !house.success ? "Unknown" : house.data?.name;
          participantSex = p.data.gender;
          age = getAge(p.data?.dob)
          p_age_group = getAgeGroupName(settings.ageGroups, p.data?.dob);
          const allowedEventAges = settings.ageGroups[event.ageGroup];
          if (
            (typeof allowedEventAges === "number" && age < allowedEventAges) ||
            (Array.isArray(allowedEventAges) &&
              typeof allowedEventAges[0] === "number" &&
              typeof allowedEventAges[1] === "number" &&
              (age < allowedEventAges[0] || age > allowedEventAges[1]))
          ) {
            add = "Not Of Age Group";
          } else {
            add = "Athlete";
          }
        }
      } else {
        const house = await window.api.psReadHouse([
          sessionId,
          res.participantId,
        ]);
        if (house.success) {
          hName = house.data.name;
          pName = house.data.name;
          participantSex = event.gender;
          p_age_group = event.ageGroup;
          add = "Team";
        } else {
          pName = "Unknown";
          hName = "Unknown";
          participantSex = "Unknown";
          p_age_group = "Unknown";
          add = "Internal App Error";
        }
      }
      return {
        pos: res.position,
        name: pName,
        house: hName,
        age_group: p_age_group,
        participantId: res.participantId,
        sex: participantSex,
        hp: res.points,
        vlp: res.vlp,
        additionalInfo: add,
      };
    }),
    firstPosMeasurement: event.bestScore,
    newRecord: event.isRecordBroken ? event.bestScore : "",
  };
}

function calculateLudorumTables(results: {
  event: eventDataToPrint;
  pos: number;
  participantId: string;
  name: string;
  house: string;
  age_group: string;
  sex: string;
  hp: number;
  vlp: number;
  additionalInfo: string;
}[]) {
  const scores = new Map<string, { name: string; age_group: string; gender: string; total: number }>();

  for (const res of results) {
    const key = res.participantId;
    if (!scores.has(key)) {
      scores.set(key, {
        name: res.name,
        age_group: res.age_group,
        gender: res.sex,
        total: 0
      });
    }
    scores.get(key)!.total += res.vlp;
  }

  type Score = ReturnType<typeof scores.values> extends Iterable<infer T> ? T : never;

  const byGroup = Array.from(scores.values()).reduce((acc, curr) => {
    const key = `${curr.age_group}-${curr.gender}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {} as Record<string, Score[]>);

  const male: { age_group: string; participants: Score[] }[] = [];
  const female: { age_group: string; participants: Score[] }[] = [];

  for (const [groupKey, list] of Object.entries(byGroup)) {
    const sorted = list.sort((a, b) => b.total - a.total);

    const ranked: Score[] = [];
    let i = 0;
    let currentRank = 1;

    while (i < sorted.length && currentRank <= 3) {
      const tieGroup = [sorted[i]];
      let j = i + 1;

      while (j < sorted.length && sorted[j].total === sorted[i].total) {
        tieGroup.push(sorted[j]);
        j++;
      }

      if (currentRank <= 3) {
        ranked.push(...tieGroup);
      }

      currentRank += tieGroup.length;
      i = j;
    }

    const [age_group, gender] = groupKey.split("-");

    const entry = { age_group, participants: ranked };

    if (gender === "male") male.push(entry);
    else if (gender === "female") female.push(entry);
  }

  return { male, female };
}

async function renderSessionSummary(sessionId: string, eventCount: number, completedEvents = 0, housePointsSummary?: Map<string, { name: string, points: number }>) {
  const session = await window.api.mainReadSession(sessionId);
  let name = "Unknown Session";
  let dateOfSession = "Unknown Date";
  if (session.success) {
    name = session.data.title || "Unknown Session";
    dateOfSession = session.data.date || "Unknown Date";
  }
  return `
    <h1>Session Summary</h1>
    <p><strong>Session ID:</strong> ${sessionId}</p>
    <p><strong>Session Name:</strong> ${name} - ${dateOfSession}</p>
    <p><strong>Total Events:</strong> ${eventCount}</p>
    <p><strong>Completed Events:</strong> ${completedEvents}</p>
    <p><strong>Generated At:</strong> ${format(new Date(), 'dd MMM yyyy HH:mm')}</p>
    <hr />
    <h2>House Points Summary</h2>
    <table>
      <thead><tr><th>Position</th><th>Name</th><th>Points</th></tr></thead>
      <tbody>
        ${Array.from(housePointsSummary).sort((a, b) => {
    return b[1].points - a[1].points;
  }).map((house, index) => `
          <tr key="${house[0]}">
            <td>${index + 1}</td>
            <td>${house[1].name}</td>
            <td>${house[1].points}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
    <hr/>
  `;
}

function renderLudorumTable(
  title: string,
  data: {
    age_group: string;
    participants: { name: string; age_group: string; gender: string; total: number }[];
  }[]
) {
  return `
    <h2>${title}</h2>
    ${data.map(group => {
    const sorted = [...group.participants].sort((a, b) => b.total - a.total);

    const rows = [];
    let position = 1;
    let i = 0;

    while (i < sorted.length) {
      const tieGroup = [sorted[i]];
      let j = i + 1;

      // Collect all participants with the same score
      while (j < sorted.length && sorted[j].total === sorted[i].total) {
        tieGroup.push(sorted[j]);
        j++;
      }

      // Render all participants in the tie group with the same position
      for (const p of tieGroup) {
        rows.push(`
            <tr>
              <td>${ordinal(position)}</td>
              <td>${p.name}</td>
              <td>${p.total}</td>
            </tr>
          `);
      }

      // Compact (dense) ranking: increment by 1 regardless of tie size
      position += 1;
      i = j;
    }

    return `
        <h3>Age Group: ${group.age_group}</h3>
        <table border="1" cellspacing="0" cellpadding="5">
          <thead>
            <tr>
              <th>Position</th>
              <th>Name</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            ${rows.join("")}
          </tbody>
        </table>
      `;
  }).join("")}
  `;
}
function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}



async function renderEventBlock(data: eventDataToPrint, maxPositions: number, pageBreak: boolean) {
  const dataResults = (await Promise.all(data.results)).slice(0, maxPositions);
  const firstPos = dataResults.find(r => r.pos === 1);

  return `
  <div class="${pageBreak ? 'page-break' : 'no-break'} border">
    <h2>Event Number ${data.eventNumber} - ${data.eventName} (${data.sex.toUpperCase()} ${data.age_group})</h2>

    <table>
      <thead>
        <tr>
          <th>Pos</th><th class="name">Name</th><th>House</th><th>Age G</th><th>Sex</th><th>HP</th><th>VLP</th><th>Info</th>
        </tr>
      </thead>
      <tbody>
        ${dataResults.map(res => `
          <tr>
            <td>${res.pos}</td>
            <td class="name">${res.name}</td>
            <td>${res.house}</td>
            <td>${res.age_group}</td>
            <td>${res.sex}</td>
            <td>${res.hp}</td>
            <td>${res.vlp}</td>
            <td>${res.additionalInfo}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    ${data.newRecord ? `
      <p><strong>New Record:</strong> ${data.newRecord} ${data.metric}</p>
      <p><strong>Set By:</strong> ${firstPos?.name || "N/A"}</p>
    ` : `
    <p><strong>Old Record:</strong> ${data.eventRecord} ${data.metric}</p>
      <p><strong>Set By:</strong> ${data.recordSetter || "N/A"}</p>
    `}
  </div>
  `;
}


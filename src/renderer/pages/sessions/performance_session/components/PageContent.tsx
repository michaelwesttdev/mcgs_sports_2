import { useEffect, useState } from "react"
import { ArrowLeft, Printer } from "lucide-react"
import { Button } from "~/components/ui/button"
import Events from "./Events"
import { Segmented } from "antd"
import { useSessionState } from "./SessionStateContext"
import Participants from "./Participants"
import Houses from "./Houses"
import SettingsPage from "./Settings"
import { useNavigate, useSearchParams } from "react-router"
import Print from "@/renderer/components/print"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/renderer/components/ui/dialog";
import { Checkbox } from "@/renderer/components/ui/checkbox";


const SEGMENT_OPTIONS = [
  {
    key: "Events",
    component: <Events />
  },
  {
    key: "Participants",
    component: <Participants />
  },
  {
    key: "Houses",
    component: <Houses />
  },
  {
    key: "Settings",
    component: <SettingsPage />
  }
];
export default function SessionPageContent() {
  const { session, sessionId } = useSessionState() 
  const [tab, setTab] = useState("Events");
  const navigate = useNavigate();
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromSearch = searchParams.get("tab");
  useEffect(() => {
    if (tabFromSearch) {
      setTab(tabFromSearch);
    }
  }, [])
  return (
    <div className="flex-1 h-full flex flex-col">
      {/* Header */}
      <div className=" w-full shrink-0 px-4 pb-2">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button onClick={() => navigate("/sessions")} variant="ghost" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <h1 className="text-xl font-semibold text-gray-900">{session?.title}</h1>
          <PrintDialog
            isOpen={printDialogOpen}
            setIsOpen={setPrintDialogOpen}
            id={sessionId}
            sessionId={sessionId}
            title={`Print Session ${session?.title ?? ""}`} />
        </div>
      </div>
      <Segmented className="w-max" options={SEGMENT_OPTIONS.map(seg => seg.key)} value={tab} onChange={setTab} />
      {
        SEGMENT_OPTIONS.find(seg => seg.key === tab).component
      }
    </div>
  )
}

export function PrintDialog({ isOpen = false, id, sessionId, title = "Print Event", setIsOpen }: { isOpen: boolean, id: string, sessionId: string, title?: string, setIsOpen: (v: boolean) => void }) {
  const [maxPositions, setMaxPositions] = useState(3);
  const [includePageBreaks, setIncludePageBreaks] = useState(false);
  const [printOnlyCompletedEvents, setPrintOnlyCompletedEvents] = useState(false);
  //const {settings} = useSettings(); # for future use, settings will return a value for max positions in an event
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                <Printer className="h-4 w-4" />
                Print Session
              </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogTitle>{title}</DialogTitle>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="maxPositions">Max Positions per Event To Print:</label>
            <input
              type="number"
              id="maxPositions"
              value={maxPositions}
              min={2}
              onChange={(e) => setMaxPositions(Number(e.target.value))}
              className="border rounded p-1 w-20"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="includePageBreaks">Include Page Breaks:</label>
            <Checkbox checked={includePageBreaks} onCheckedChange={() => setIncludePageBreaks(!includePageBreaks)} />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="printOnlyCompletedEvents">Print Only Completed Events:</label>
            <Checkbox checked={printOnlyCompletedEvents} onCheckedChange={() => setPrintOnlyCompletedEvents(!printOnlyCompletedEvents)} />
          </div>
        </div>
        <div className="flex items-center justify-center gap-5 min-w-[300px]">
          <Button onClick={() => setIsOpen(false)} variant="destructive">Cancel</Button>
          <Print printOptions={{
            maxPositions,
            includePageBreaks,
            printOnlyCompletedEvents
          }} onDone={() => setIsOpen(false)} sessionId={sessionId} type="session" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
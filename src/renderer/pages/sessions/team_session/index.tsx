import { Button } from "@/renderer/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, Printer } from "lucide-react";
import Fixtures from "./components/Fixtures";
import Teams from "./components/Teams";
import Players from "./components/Players";
import { useSessionState } from "./components/SessionStateContext";
import { Segmented } from "antd/es";
import SettingsPage from "./components/Settings";

const SEGMENT_OPTIONS = [
  {
    key: "Fixtures",
    component: <Fixtures />,
  },
  {
    key: "Teams",
    component: <Teams />,
  },
  {
    key: "Players",
    component: <Players />,
  },
  {
    key: "Settings",
    component: <SettingsPage />,
  },
];

export default function TeamSessionViewPage() {
  const [params] = useSearchParams();
  const { session } = useSessionState();
  const [tab, setTab] = useState("Players");
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromSearch = searchParams.get("tab");
  const navigate = useNavigate();

  useEffect(() => {
    if (tabFromSearch) {
      setTab(tabFromSearch);
    }
  }, []);

  return (
    <div className="flex-1 h-full flex flex-col">
      {/* Header */}
      <div className=" w-full shrink-0 px-4 pb-2">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button
            onClick={() => navigate("/sessions")}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <h1 className="text-xl font-semibold text-gray-900">
            {session?.title}
          </h1>
          {/* <PrintDialog
                  isOpen={printDialogOpen}
                  setIsOpen={setPrintDialogOpen}
                  id={sessionId}
                  sessionId={sessionId}
                  title={`Print Session ${session?.title ?? ""}`} /> */}
          <Button>Print Session</Button>
        </div>
      </div>
      <Segmented
        className="w-max"
        options={SEGMENT_OPTIONS.map((seg) => seg.key)}
        value={tab}
        onChange={setTab}
      />
      {SEGMENT_OPTIONS.find((seg) => seg.key === tab).component}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Separator } from "~/components/ui/separator";
import { Plus, Trash2, Save } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Toast } from "~/components/Toast";
import { Settings } from "@/shared/settings";
import { useSettings } from "~/hooks/use_settings";
import ScrollBox from "@/renderer/components/ScrollBox";

// Default settings

export default function SettingsPage() {
  const { settings: defaultSettings, updateSettings } = useSettings();
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Save all settings
  const saveSettings = async (data?:Partial<Settings>) => {
    // In a real application, you would save to a database or API
    console.log("Saving settings:");
    await updateSettings(data??settings);
    setSettings((data??settings) as Settings);
    Toast({
      message: "Settings saved",
      variation: "success",
    });
  };

  return (
    <ScrollBox>
    <div className="py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Competition Settings</h1>
        <Button onClick={async()=>saveSettings()}>
          <Save className="mr-2 h-4 w-4" />
          Save All Settings
        </Button>
      </div>

      <Tabs defaultValue="ageGroups" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ageGroups">Age Groups</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="points">Points</TabsTrigger>
        </TabsList>

        {/* Age Groups Tab */}
        <TabsContent value="ageGroups">
        </TabsContent>
        <TabsContent value="points">
        </TabsContent>
      </Tabs>
    </div>
    </ScrollBox>
  );
}

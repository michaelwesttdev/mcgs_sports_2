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
import { PSessionSettings, Settings } from "@/shared/settings";
import { useSettings } from "~/hooks/use_settings";
import { useSessionSettings } from "./hooks/use_settings";
import { cn } from "@/renderer/lib/utils";
import SettingsFromOtherDialog from "./settingsFromOtherDialog";
import ScrollBox from "@/renderer/components/ScrollBox";

export default function SettingsPage() {
  const { settings: defaultSettings, updateSettings } = useSessionSettings();
  const [settings, setSettings] = useState<PSessionSettings>(defaultSettings);
  // Age Groups
  const [newAgeGroupName, setNewAgeGroupName] = useState("");
  const [newAgeGroupMin, setNewAgeGroupMin] = useState("");
  const [newAgeGroupMax, setNewAgeGroupMax] = useState("");
  const [isRangeAgeGroup, setIsRangeAgeGroup] = useState(true);

  // Points
  const [newPointPlace, setNewPointPlace] = useState("");
  const [newPointValue, setNewPointValue] = useState("");
  const [pointsType, setPointsType] = useState<"individual" | "team">(
    "individual",
  );
  // VLP Points 
  const [newVlpPlace, setNewVlpPlace] = useState("");
  const [newVlpValue, setNewVlpValue] = useState("");

  //general settings
  const [rules, setRules] = useState({
    ...settings.rules
  });

  // Add new age group
  const addAgeGroup = () => {
    if (!newAgeGroupName.trim()) {
      Toast({
        message: "Age group name is required",
        variation: "error",
      });
      return;
    }

    const minAge = Number.parseInt(newAgeGroupMin);
    if (isNaN(minAge)) {
      Toast({
        message: "Minimum age must be a valid number",
        variation: "error",
      });
      return;
    }

    let ageValue: number | [number, number] = minAge;

    if (isRangeAgeGroup) {
      const maxAge = Number.parseInt(newAgeGroupMax);
      if (isNaN(maxAge)) {
        Toast({
          message: "Maximum age must be a valid number",
          variation: "error",
        });
        return;
      }

      if (maxAge < minAge) {
        Toast({
          message: "Maximum age must be greater than or equal to minimum age",
          variation: "error",
        });
        return;
      }

      ageValue = [minAge, maxAge];
    }

    const newSettings = {
      ...settings,
      ageGroups: {
        ...settings.ageGroups,
        [newAgeGroupName]: ageValue,
      },
    };
    saveSettings(newSettings);

    // Reset form
    setNewAgeGroupName("");
    setNewAgeGroupMin("");
    setNewAgeGroupMax("");
  };

  // Remove age group
  const removeAgeGroup = (name: string) => {
    const updatedAgeGroups = { ...settings.ageGroups };
    delete updatedAgeGroups[name];

    const newSettings = {
      ...settings,
      ageGroups: updatedAgeGroups,
    };
    saveSettings(newSettings)
  };

  // Add new point allocation
  const addPointAllocation = () => {
    const place = Number.parseInt(newPointPlace);
    const points = Number.parseInt(newPointValue);

    if (isNaN(place) || place <= 0) {
      Toast({
        message: "Place must be a positive number",
        variation: "error",
      });
      return;
    }

    if (isNaN(points) || points < 0) {
      Toast({
        message: "Points must be a non-negative number",
        variation: "error",
      });
      return;
    }

    const updatedPoints = {
      ...settings.points,
      [pointsType]: {
        ...settings.points[pointsType],
        [place]: points,
      },
    };

    const newSettings = {
      ...settings,
      points: updatedPoints,
    };
    saveSettings(newSettings);

    // Reset form
    setNewPointPlace("");
    setNewPointValue("");
  };

  // Remove point allocation
  const removePointAllocation = (
    type: "individual" | "team",
    place: number,
  ) => {
    const updatedPointsType = { ...settings.points[type] };
    delete updatedPointsType[place];

    const newSettings = {
      ...settings,
      points: {
        ...settings.points,
        [type]: updatedPointsType,
      },
    };
    saveSettings(newSettings)
  };
  // Add new point allocation
  const addVlpAllocation = () => {
    const place = Number.parseInt(newVlpPlace);
    const points = Number.parseInt(newVlpValue);

    if (isNaN(place) || place <= 0) {
      Toast({
        message: "Place must be a positive number",
        variation: "error",
      });
      return;
    }

    if (isNaN(points) || points < 0) {
      Toast({
        message: "Points must be a non-negative number",
        variation: "error",
      });
      return;
    }

    const updatedPoints = {
      ...settings.points,
      vlp: {
        ...settings.points.vlp,
        [place]: points,
      },
    };

    const newSettings = {
      ...settings,
      points: updatedPoints,
    };

    saveSettings(newSettings)

    // Reset form
    setNewVlpPlace("");
    setNewVlpValue("");
  };

  // Remove point allocation
  const removeVlpAllocation = (
    place: number,
  ) => {
    const updatedPointsType = { ...settings.points.vlp };
    delete updatedPointsType[place];

    const newSettings = {
      ...settings,
      points: {
        ...settings.points,
        vlp: updatedPointsType,
      },
    };
    saveSettings(newSettings)
  };

  function handleRuleChange({
    key,
    value
  }: {
    key: keyof typeof rules,
    value: string
  }) {
    let v;
    if (typeof rules[key] === "number") {
      v = Number(value)
    }
    else {
      v = value;
    }
    setRules({ ...rules, [key as any]: v })
  }
  function handleRuleUpdate(key:keyof typeof settings.rules){
    const newSettings = {
      ...settings,
      rules: {
        ...settings.rules,
        [key]:rules[key]
      },
    };
    saveSettings(newSettings)
  }

  // Save all settings
  const saveSettings = async (data?: Partial<PSessionSettings>) => {
    await updateSettings(data ? { settings: data } : { settings } as any);
    setSettings((data ?? settings) as PSessionSettings);
    Toast({
      message: "Settings saved",
      variation: "success",
    });
  };

  return (
    <div className="py-10 flex-1 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Competition Settings</h1>
        <SettingsFromOtherDialog onDone={() => Promise.resolve()}/>
      </div>

      <Tabs defaultValue="general" className="w-full flex-1 h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="ageGroups">Age Groups</TabsTrigger>
          <TabsTrigger value="points">Points</TabsTrigger>
          <TabsTrigger value="vlp">VLP Points</TabsTrigger>
        </TabsList>

        <ScrollBox className="flex-1 pb-20">

        {/* General settings and rules Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Rules and Settings</CardTitle>
              <CardDescription>
                Configure general settings and rules for the session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-4">
                  {
                   settings&& Object.entries(settings?.rules).map(item => {
                      const key = item[0] as keyof typeof settings.rules;
                      const val = item[1];
                      return (
                        <div className="flex items-center gap-6">
                          <div className="">
                            <Label>{key}</Label>
                            <Input type={typeof val === "number" ? "number" : "text"} value={rules[key]} onChange={(e) => {
                              handleRuleChange({
                                key,
                                value: e.target.value
                              })
                            }} />
                          </div>
                          <Button onClick={()=>handleRuleUpdate(key)} className={cn("w-full md:w-auto",settings.rules[key]===rules[key]?"hidden":"")}>
                            <Plus className="mr-2 h-4 w-4" />
                            Update
                          </Button>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Age Groups Tab */}
        <TabsContent value="ageGroups">
          <Card>
            <CardHeader>
              <CardTitle>Age Groups</CardTitle>
              <CardDescription>
                Configure age groups for competition categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="newAgeGroupName">Group Name</Label>
                      <Input
                        id="newAgeGroupName"
                        placeholder="e.g. U14, Senior"
                        value={newAgeGroupName}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.trim() && !/\d$/.test(value)) {
                            setIsRangeAgeGroup(false);
                          } else {
                            setIsRangeAgeGroup(true);
                          }
                          setNewAgeGroupName(e.target.value);
                        }}
                      />
                    </div>

                    <div className="flex items-center space-x-2 mt-8">
                      <input
                        type="checkbox"
                        id="isRangeAgeGroup"
                        checked={isRangeAgeGroup}
                        onChange={() => setIsRangeAgeGroup(!isRangeAgeGroup)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="isRangeAgeGroup">Age Range</Label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isRangeAgeGroup ? (
                      <>
                        <div>
                          <Label htmlFor="newAgeGroupMin">Minimum Age</Label>
                          <Input
                            id="newAgeGroupMin"
                            type="number"
                            placeholder="e.g. 12"
                            value={newAgeGroupMin}
                            onChange={(e) => setNewAgeGroupMin(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="newAgeGroupMax">Maximum Age</Label>
                          <Input
                            id="newAgeGroupMax"
                            type="number"
                            placeholder="e.g. 13"
                            value={newAgeGroupMax}
                            onChange={(e) => setNewAgeGroupMax(e.target.value)}
                          />
                        </div>
                      </>
                    ) : (
                      <div>
                        <Label htmlFor="newAgeGroupMin">Minimum Age</Label>
                        <Input
                          id="newAgeGroupMin"
                          type="number"
                          placeholder="e.g. 18"
                          value={newAgeGroupMin}
                          onChange={(e) => setNewAgeGroupMin(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  <Button onClick={addAgeGroup} className="w-full md:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Age Group
                  </Button>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Current Age Groups
                  </h3>
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="grid gap-4">
                      {Object.entries(settings.ageGroups).map(
                        ([name, value]) => (
                          <div
                            key={name}
                            className="flex justify-between items-center p-2 rounded-md border"
                          >
                            <div>
                              <Badge variant="outline" className="mr-2">
                                {name}
                              </Badge>
                              {Array.isArray(value) ? (
                                <span>
                                  Ages {value[0]} to {value[1]}
                                </span>
                              ) : (
                                <span>Age {value}+</span>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeAgeGroup(name)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ),
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Points Tab */}
        <TabsContent value="points">
          <Card>
            <CardHeader>
              <CardTitle>Points Allocation</CardTitle>
              <CardDescription>
                Configure points awarded for placements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <Tabs
                  value={pointsType}
                  onValueChange={(value) =>
                    setPointsType(value as "individual" | "team")
                  }
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="individual">Individual</TabsTrigger>
                    <TabsTrigger value="team">Team</TabsTrigger>
                  </TabsList>

                  <TabsContent value="individual" className="pt-4">
                    <div className="grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="newPointPlace">Place</Label>
                          <Input
                            id="newPointPlace"
                            type="number"
                            placeholder="e.g. 1, 2, 3"
                            value={newPointPlace}
                            onChange={(e) => setNewPointPlace(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="newPointValue">Points</Label>
                          <Input
                            id="newPointValue"
                            type="number"
                            placeholder="e.g. 10, 8, 6"
                            value={newPointValue}
                            onChange={(e) => setNewPointValue(e.target.value)}
                          />
                        </div>
                      </div>

                      <Button
                        onClick={addPointAllocation}
                        className="w-full md:w-auto"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Point Allocation
                      </Button>
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Current Individual Points
                      </h3>
                      <ScrollArea className="h-[200px] rounded-md border p-4">
                        <div className="grid gap-4">
                          {settings.points.individual &&
                            Object.entries(settings.points.individual)
                              .sort(
                                ([a], [b]) =>
                                  Number.parseInt(a) - Number.parseInt(b),
                              )
                              .map(([place, points]) => (
                                <div
                                  key={place}
                                  className="flex justify-between items-center p-2 rounded-md border"
                                >
                                  <div>
                                    <Badge variant="outline" className="mr-2">
                                      Place {place}
                                    </Badge>
                                    <span>{points} points</span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      removePointAllocation(
                                        "individual",
                                        Number.parseInt(place),
                                      )
                                    }
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </TabsContent>

                  <TabsContent value="team" className="pt-4">
                    <div className="grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="newPointPlace">Place</Label>
                          <Input
                            id="newPointPlace"
                            type="number"
                            placeholder="e.g. 1, 2, 3"
                            value={newPointPlace}
                            onChange={(e) => setNewPointPlace(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="newPointValue">Points</Label>
                          <Input
                            id="newPointValue"
                            type="number"
                            placeholder="e.g. 12, 8, 6"
                            value={newPointValue}
                            onChange={(e) => setNewPointValue(e.target.value)}
                          />
                        </div>
                      </div>

                      <Button
                        onClick={addPointAllocation}
                        className="w-full md:w-auto"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Point Allocation
                      </Button>
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Current Team Points
                      </h3>
                      <ScrollArea className="h-[200px] rounded-md border p-4">
                        <div className="grid gap-4">
                          {settings.points.team &&
                            Object.entries(settings.points.team)
                              .sort(
                                ([a], [b]) =>
                                  Number.parseInt(a) - Number.parseInt(b),
                              )
                              .map(([place, points]) => (
                                <div
                                  key={place}
                                  className="flex justify-between items-center p-2 rounded-md border"
                                >
                                  <div>
                                    <Badge variant="outline" className="mr-2">
                                      Place {place}
                                    </Badge>
                                    <span>{points} points</span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      removePointAllocation(
                                        "team",
                                        Number.parseInt(place),
                                      )
                                    }
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Vlp Tab */}
        <TabsContent value="vlp">
          <Card>
            <CardHeader>
              <CardTitle>VLP Points Allocation</CardTitle>
              <CardDescription>
                Configure vlp points awarded for placements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="newVlpPlace">Place</Label>
                      <Input
                        id="newVlpPlace"
                        type="number"
                        placeholder="e.g. 1, 2, 3"
                        value={newVlpPlace}
                        onChange={(e) => setNewVlpPlace(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newVlpValue">Points</Label>
                      <Input
                        id="newVlpValue"
                        type="number"
                        placeholder="e.g. 10, 8, 6"
                        value={newVlpValue}
                        onChange={(e) => setNewVlpValue(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={addVlpAllocation}
                    className="w-full md:w-auto"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Point Allocation
                  </Button>
                </div>

                <Separator className="my-4" />

                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Current VLP Points
                  </h3>
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="grid gap-4">
                      {settings.points.vlp &&
                        Object.entries(settings.points.vlp)
                          .sort(
                            ([a], [b]) =>
                              Number.parseInt(a) - Number.parseInt(b),
                          )
                          .map(([place, points]) => (
                            <div
                              key={place}
                              className="flex justify-between items-center p-2 rounded-md border"
                            >
                              <div>
                                <Badge variant="outline" className="mr-2">
                                  Place {place}
                                </Badge>
                                <span>{points} points</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  removeVlpAllocation(
                                    Number.parseInt(place),
                                  )
                                }
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </ScrollBox>
      </Tabs>
    </div>
  );
} 